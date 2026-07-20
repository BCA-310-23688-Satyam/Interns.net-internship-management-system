import Card from "./Card";

function DashboardPanel({
  eyebrow,
  title,
  description,
  aside,
  className = "",
  children
}) {
  return (
    <Card className={`panel${className ? ` ${className}` : ""}`}>
      <div className="panel-head">
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>
          {description ? <p className="panel-copy">{description}</p> : null}
        </div>
        {aside ? <div className="panel-aside">{aside}</div> : null}
      </div>
      {children}
    </Card>
  );
}

export default DashboardPanel;
