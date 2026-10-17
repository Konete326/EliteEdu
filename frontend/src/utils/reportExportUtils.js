export const copyTableData = (columns, rows, toast) => {
  const visibleCols = columns.filter((c) => c.visible);
  const headerLine = visibleCols.map((c) => c.label).join('\t');
  const dataLines = rows.map((r) => visibleCols.map((c) => String(r[c.key] ?? '')).join('\t'));
  const text = [headerLine, ...dataLines].join('\n');
  navigator.clipboard.writeText(text).then(() => {
    if (toast?.success) toast.success('Table copied to clipboard!');
  });
};

export const downloadCsv = (columns, rows, filename = 'report') => {
  const visibleCols = columns.filter((c) => c.visible);
  const headerLine = visibleCols.map((c) => `"${String(c.label).replace(/"/g, '""')}"`).join(',');
  const dataLines = rows.map((r) =>
    visibleCols.map((c) => `"${String(r[c.key] ?? '').replace(/"/g, '""')}"`).join(',')
  );
  const csvContent = '\uFEFF' + [headerLine, ...dataLines].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const downloadExcel = (columns, rows, filename = 'report') => {
  downloadCsv(columns, rows, filename);
};

export const triggerPrint = () => {
  window.print();
};
