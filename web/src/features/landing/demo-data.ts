import { queryOptions } from "@tanstack/react-query";

export type IssueStatus = "In progress" | "Todo" | "Done";
export type Issue = { id: string; title: string; status: IssueStatus; label: string; assignee: string; priority: number };

const issues: Issue[] = [
  { id: "ORB-142", title: "Build a better first impression", status: "In progress", label: "Design", assignee: "AK", priority: 3 },
  { id: "ORB-143", title: "Introduce the new command menu", status: "In progress", label: "Product", assignee: "JL", priority: 2 },
  { id: "ORB-144", title: "Refine the onboarding experience", status: "In progress", label: "Design", assignee: "EM", priority: 3 },
  { id: "ORB-145", title: "Make every interaction feel instant", status: "Todo", label: "Engineering", assignee: "JL", priority: 2 },
  { id: "ORB-146", title: "Bring projects and people together", status: "Todo", label: "Product", assignee: "AK", priority: 1 },
  { id: "ORB-147", title: "Ship the workspace navigation", status: "Done", label: "Engineering", assignee: "EM", priority: 2 },
];

export const demoIssuesOptions = queryOptions({
  queryKey: ["demo", "issues"],
  queryFn: async (): Promise<Issue[]> => issues.map((issue) => ({ ...issue })),
});
