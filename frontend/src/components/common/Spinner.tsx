import "./Spinner.css";
export function Spinner({ size = "md", label }: { size?: "sm"|"md"|"lg"; label?: string }) { return (<div className={`spinner-container spinner-${size}`}><div className="spinner" />{label && <span className="spinner-label">{label}</span>}</div>); }
