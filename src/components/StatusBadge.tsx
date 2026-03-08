import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/i18n/LanguageContext";

type StatusType = "draft" | "sent" | "accepted" | "rejected" | "paid" | "overdue";

const statusStyles: Record<StatusType, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  sent: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  accepted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  overdue: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { t } = useLanguage();
  const style = statusStyles[status] || "bg-muted text-muted-foreground border-border";
  const label = t.status[status] || status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <Badge variant="outline" className={`text-xs font-medium ${style}`}>
      {label}
    </Badge>
  );
};

export default StatusBadge;
export type { StatusType };
