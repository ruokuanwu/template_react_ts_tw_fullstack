import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ProductPreview } from "@/features/landing/components/product-preview";
import { demoIssuesOptions } from "@/features/landing/demo-data";

export const Route = createFileRoute("/demo")({
  loader: ({ context }) => context.queryClient.ensureQueryData(demoIssuesOptions),
  component: DemoPage,
});

function DemoPage() {
  return <main className="page-container py-16 sm:py-24">
    <Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white"><ArrowLeft size={15} /> Back to Orbit</Link>
    <p className="eyebrow">YOUR NEXT BIG THING STARTS HERE</p><h1 className="section-heading">Less setup. More doing.</h1>
    <p className="mb-10 mt-5 max-w-xl text-sm leading-7 text-muted-foreground">Take a look around this sample workspace. Filter by status, search an issue, or open one for a closer look. This demo uses local sample data and does not create an account.</p>
    <ProductPreview expanded />
  </main>;
}
