function AdminLoadingState({ label = "Loading..." }) {
  return (
    <section className="panel admin-feedback-panel">
      <p>{label}</p>
    </section>
  );
}

export default AdminLoadingState;
