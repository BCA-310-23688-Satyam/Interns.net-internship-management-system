function AdminEmptyState({ title, description }) {
  return (
    <section className="state-block admin-empty-state">
      <h3 className="state-title">{title}</h3>
      <p className="state-copy">{description}</p>
    </section>
  );
}

export default AdminEmptyState;
