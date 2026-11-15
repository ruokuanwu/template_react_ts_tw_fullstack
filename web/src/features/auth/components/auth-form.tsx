import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Orbit, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { authClient } from "../auth-client";

type AuthMode = "login" | "register";
type Field = "name" | "email" | "password";

const credentialsSchema = z.object({
  email: z.email("Enter a valid email address.").max(254, "Email address is too long."),
  password: z.string().min(8, "Use at least 8 characters.").max(128, "Use no more than 128 characters."),
});
const registrationSchema = credentialsSchema.extend({
  name: z.string().trim().min(1, "Enter your full name.").max(100, "Use no more than 100 characters."),
});

export function AuthForm({ mode }: { mode: AuthMode }) {
  const registering = mode === "register";
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const mutation = useMutation({
    mutationFn: async (values: { name: string; email: string; password: string }) => {
      const result = registering
        ? await authClient.signUp.email(values)
        : await authClient.signIn.email({ email: values.email, password: values.password });
      if (result.error) throw new Error(result.error.message || "Unable to authenticate. Please try again.");
      return result.data;
    },
    onSuccess: async () => { await navigate({ to: "/dashboard" }); },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mutation.isPending) return;
    mutation.reset();
    const data = new FormData(event.currentTarget);
    const values = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      password: String(data.get("password") ?? ""),
    };
    const validation = (registering ? registrationSchema : credentialsSchema).safeParse(values);
    if (!validation.success) {
      const fieldErrors: Partial<Record<Field, string>> = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0];
        if (field === "name" || field === "email" || field === "password") fieldErrors[field] ??= issue.message;
      }
      setErrors(fieldErrors);
      const firstField = validation.error.issues[0]?.path[0];
      if (typeof firstField === "string") event.currentTarget.querySelector<HTMLInputElement>(`[name="${firstField}"]`)?.focus();
      return;
    }
    setErrors({});
    mutation.mutate(values);
  }

  const inputClass = "mt-2 w-full rounded-lg border border-border bg-surface px-3.5 py-3 text-sm text-secondary-foreground placeholder:text-[#62666d] disabled:opacity-60 aria-invalid:border-destructive";

  return (
    <main className="page-container py-12 sm:py-20">
      <Link to="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-white"><ArrowLeft size={14} /> Back to home</Link>
      <div className="mx-auto grid max-w-[920px] overflow-hidden rounded-2xl border border-border bg-[#08090a] lg:my-10 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="hidden flex-col justify-between border-r border-border bg-surface p-10 lg:flex">
          <div><div className="mb-16 flex items-center gap-2 text-xl font-semibold"><Orbit size={26} className="text-[#828fff]" /> orbit</div><p className="eyebrow">A LITTLE LESS FRICTION</p><h2 className="text-4xl font-medium leading-tight tracking-[-0.045em]">Your next chapter.<br /><span className="text-muted-foreground">One small step away.</span></h2><p className="mt-6 text-sm leading-7 text-muted-foreground">A thoughtful space for your ideas, your projects, and the people who make them happen.</p></div>
          <div className="mt-16 rounded-xl border border-border bg-[#141516] p-5"><div className="mb-4 flex items-center gap-2 text-xs"><span className="h-1.5 w-1.5 rounded-full bg-[#828fff]" /> Make room for what matters</div><div className="mb-4 flex gap-1.5" aria-hidden="true">{[100, 75, 45, 20].map((width) => <div key={width} className="h-1 flex-1 rounded bg-border"><div style={{ width: `${width}%` }} className="h-full rounded bg-primary" /></div>)}</div><p className="text-xs leading-6 text-muted-foreground">Less noise. Clearer priorities.<br />A little more momentum, every day.</p></div>
        </aside>
        <section className="px-6 py-10 sm:px-12 sm:py-12" aria-labelledby="auth-title">
          <Orbit size={28} className="mb-7 text-[#828fff]" />
          <h1 id="auth-title" className="text-3xl font-medium tracking-[-0.04em]">{registering ? "Make room for your best work." : "Welcome back."}</h1>
          <p className="mb-8 mt-3 text-sm leading-6 text-muted-foreground">{registering ? "Create your Orbit account. A fresh start awaits." : "Good to see you. Let’s keep things moving."}</p>
          <form noValidate onSubmit={handleSubmit} aria-busy={mutation.isPending} className="space-y-5">
            {registering && <div><label htmlFor="auth-name" className="text-xs font-medium">Full name</label><input id="auth-name" name="name" autoComplete="name" placeholder="Alex Morgan" maxLength={100} required disabled={mutation.isPending} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} className={inputClass} />{errors.name && <p id="name-error" className="mt-2 text-xs text-destructive">{errors.name}</p>}</div>}
            <div><label htmlFor="auth-email" className="text-xs font-medium">Email address</label><input id="auth-email" name="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="you@company.com" required disabled={mutation.isPending} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} className={inputClass} />{errors.email && <p id="email-error" className="mt-2 text-xs text-destructive">{errors.email}</p>}</div>
            <div><label htmlFor="auth-password" className="text-xs font-medium">Password</label><div className="relative"><input id="auth-password" name="password" type={showPassword ? "text" : "password"} autoComplete={registering ? "new-password" : "current-password"} placeholder={registering ? "Create a password" : "Enter your password"} required disabled={mutation.isPending} aria-invalid={!!errors.password} aria-describedby={errors.password ? "password-error" : registering ? "password-hint" : undefined} className={`${inputClass} !pr-12`} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)} className="absolute bottom-3.5 right-3.5 text-muted-foreground hover:text-white">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{errors.password ? <p id="password-error" className="mt-2 text-xs text-destructive">{errors.password}</p> : registering && <p id="password-hint" className="mt-2 text-[11px] text-muted-foreground">Use 8–128 characters. Make it uniquely yours.</p>}</div>
            {mutation.isError && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs leading-6 text-destructive">{mutation.error instanceof TypeError ? "Unable to reach the server. Check your connection and try again." : mutation.error.message}</p>}
            <button disabled={mutation.isPending} className="button-primary w-full disabled:cursor-wait disabled:opacity-60">{mutation.isPending ? <><Loader2 size={15} className="animate-spin" />{registering ? "Creating your account…" : "Signing you in…"}</> : <>{registering ? "Create account" : "Log in"}<ArrowRight size={15} /></>}</button>
          </form>
          <p className="mt-6 text-center text-xs text-muted-foreground">{registering ? "Already have an account?" : "New to Orbit?"} <Link to={registering ? "/login" : "/register"} className="ml-1 text-[#a3abf4] hover:text-white">{registering ? "Log in" : "Create an account"}</Link></p>
          <div className="my-7 flex items-center gap-3 text-[10px] text-[#62666d]"><span className="h-px flex-1 bg-border" />OR TAKE A LOOK FIRST<span className="h-px flex-1 bg-border" /></div>
          <Link to="/demo" className="button-secondary w-full !text-xs">Explore without an account <ArrowRight size={13} /></Link>
          <p className="mt-7 flex items-center justify-center gap-2 text-[10px] text-muted-foreground"><ShieldCheck size={13} /> Email and password. No distractions.</p>
        </section>
      </div>
    </main>
  );
}
