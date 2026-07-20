function AdminStatCard({ label, value }) {
  return (
    <article className="admin-stat-card">
      <p>{label}</p>
      <h3>{value ?? 0}</h3>
    </article>
  );
}

export default AdminStatCard;
