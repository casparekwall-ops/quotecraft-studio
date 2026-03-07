import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: string;
}

const StatCard = ({ title, value, subtitle, icon, trend }: StatCardProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
      </div>
      <div className="text-3xl font-bold text-foreground">{value}</div>
      {(subtitle || trend) && (
        <div className="mt-1 flex items-center gap-2">
          {trend && (
            <span className="text-xs font-medium text-success">{trend}</span>
          )}
          {subtitle && (
            <span className="text-sm text-muted-foreground">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
