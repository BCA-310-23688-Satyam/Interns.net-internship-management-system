function AdminTable({ columns, rows, emptyState, actionsLabel = "Actions" }) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return emptyState || null;
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            <th>{actionsLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.key} data-label={column.label}>
                  {column.render ? column.render(row) : row[column.key] ?? "-"}
                </td>
              ))}
              <td data-label={actionsLabel}>{row.actions || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;
