interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
      <div className="mb-4 rounded-xl bg-muted p-4 text-muted-foreground">{icon}</div>
      <h3 className="mb-1 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
