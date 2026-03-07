import { Badge } from "@/components/ui/badge";

type StatusType = "draft" | "sent" | "accepted" | "rejected" | "paid" | "overdue";

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground border-border" },
  sent: { label: "Sent", className: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
  accepted: { label: "Accepted", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  rejected: { label: "Rejected", className: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
  paid: { label: "Paid", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  overdue: { label: "Overdue", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
};

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={`text-xs font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
export type { StatusType };
