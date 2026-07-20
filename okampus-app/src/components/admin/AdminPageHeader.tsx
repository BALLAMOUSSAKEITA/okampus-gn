type AdminPageHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  pill?: { label: string; variant?: "blue" | "green" | "orange" | "violet" };
};

export default function AdminPageHeader({
  title,
  description,
  action,
  pill,
}: AdminPageHeaderProps) {
  return (
    <div className="admin-page-header">
      <div>
        {pill && (
          <span className={`admin-pill admin-pill-${pill.variant ?? "blue"} mb-3 inline-flex`}>
            {pill.label}
          </span>
        )}
        <h1 className="admin-display">{title}</h1>
        {description && <p className="admin-lead">{description}</p>}
      </div>
      {action && <div className="admin-page-header-action">{action}</div>}
    </div>
  );
}
