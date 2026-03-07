import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: string;
  gradient?: string;
}

const StatCard = ({ title, value, subtitle, icon, trend, gradient }: StatCardProps) => {
  return (
    <div className={`rounded-xl border border-border bg-gradient-to-br ${gradient || 'from-card to-card'} p-6 shadow-card transition-all duration-200 hover:shadow-soft hover:-translate-y-0.5`}>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="rounded-lg bg-card/80 p-2 shadow-sm">{icon}</div>
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
