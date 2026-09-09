// Generic table. `columns` = [{ key, header, render? }], `rows` = array of objects.
// `onRowClick` is optional; `actions` renders a trailing cell per row.
export default function DataTable({ columns, rows, onRowClick, actions, keyField = 'id' }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--bg-sunken)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-medium text-[var(--text-muted)]"
              >
                {col.header}
              </th>
            ))}
            {actions && <th className="px-4 py-2.5" />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row[keyField]}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-b border-[var(--border)] last:border-0 ${
                onRowClick ? 'cursor-pointer hover:bg-[var(--bg-sunken)]' : ''
              }`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2.5 align-middle text-[var(--text)]">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
