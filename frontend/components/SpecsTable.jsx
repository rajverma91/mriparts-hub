export default function SpecsTable({ item }) {
  const rows = [
    ['Model',    item.model],
    ['Brand',    item.brand],
    ['Category', item.category],
    ['Condition', item.condition_type],
    ['Year',     item.year],
    ['Country',  item.country],
    ['City',     item.city],
    ['Posted',   item.created_at ? new Date(item.created_at).toLocaleDateString() : null],
    ['Views',    item.views],
  ].filter(([, v]) => v !== null && v !== undefined && v !== '');

  return (
    <div className="card" style={{ padding: 20, marginTop: 16 }}>
      <h3 style={{ marginBottom: 12 }}>Product Details</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} style={{ borderTop: '1px solid #f1f5f9' }}>
              <td style={{ padding: '8px 0', color: '#6b7280', width: '42%' }}>{k}</td>
              <td style={{ padding: '8px 0', fontWeight: 600, textAlign: 'right' }}>
                {String(v)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}