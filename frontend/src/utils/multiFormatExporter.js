const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const exportToExcel = (title, columns, rows, filename = 'export.xls') => {
  const tableHeaders = columns.map(col => `<th style="background-color:#1e293b;color:#ffffff;padding:8px 12px;border:1px solid #cbd5e1;font-weight:bold;text-align:left;">${col.header}</th>`).join('');
  const tableRows = rows.map((row, idx) => {
    const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    const cells = columns.map(col => {
      const val = row[col.key] !== undefined && row[col.key] !== null ? String(row[col.key]) : '';
      return `<td style="padding:6px 10px;border:1px solid #cbd5e1;mso-number-format:'\\@';">${val}</td>`;
    }).join('');
    return `<tr style="background-color:${bg};">${cells}</tr>`;
  }).join('');

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <!--[if gte mso 9]>
    <xml>
      <x:ExcelWorkbook>
        <x:ExcelWorksheets>
          <x:ExcelWorksheet>
            <x:Name>${title.slice(0, 30)}</x:Name>
            <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
          </x:ExcelWorksheet>
        </x:ExcelWorksheets>
      </x:ExcelWorkbook>
    </xml>
    <![endif]-->
    <style>
      body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; }
      table { border-collapse: collapse; width: 100%; }
      th, td { white-space: nowrap; }
    </style>
  </head>
  <body>
    <h2 style="font-family:Arial,sans-serif;color:#0f172a;margin-bottom:4px;">${title}</h2>
    <p style="font-size:10pt;color:#64748b;margin-top:0;margin-bottom:12px;">Generated on: ${new Date().toLocaleString()} | Total Records: ${rows.length}</p>
    <table>
      <thead><tr>${tableHeaders}</tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
  </body>
  </html>`;

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  triggerDownload(blob, filename.endsWith('.xls') ? filename : `${filename}.xls`);
};

export const exportToCsv = (columns, rows, filename = 'export.csv') => {
  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerRow = columns.map(col => escapeCsv(col.header)).join(',');
  const dataRows = rows.map(row => columns.map(col => escapeCsv(row[col.key])).join(','));
  const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
};

export const exportToWord = (title, columns, rows, filename = 'export.doc') => {
  const tableHeaders = columns.map(col => `<th style="background-color:#1e3a8a;color:#ffffff;padding:8px 10px;border:1px solid #94a3b8;font-size:10pt;">${col.header}</th>`).join('');
  const tableRows = rows.map((row, idx) => {
    const bg = idx % 2 === 0 ? '#ffffff' : '#f1f5f9';
    const cells = columns.map(col => {
      const val = row[col.key] !== undefined && row[col.key] !== null ? String(row[col.key]) : '';
      return `<td style="padding:6px 8px;border:1px solid #cbd5e1;font-size:9.5pt;">${val}</td>`;
    }).join('');
    return `<tr style="background-color:${bg};">${cells}</tr>`;
  }).join('');

  const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
      body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; margin: 24px; }
      h2 { color: #1e3a8a; margin-bottom: 4px; font-size: 16pt; }
      .meta { font-size: 9pt; color: #64748b; margin-bottom: 16px; }
      table { border-collapse: collapse; width: 100%; margin-top: 10px; }
      th, td { text-align: left; vertical-align: top; }
    </style>
  </head>
  <body>
    <h2>${title}</h2>
    <div class="meta">EliteEdu Academic Management System &bull; Exported on ${new Date().toLocaleString()} &bull; Total: ${rows.length} records</div>
    <table>
      <thead><tr>${tableHeaders}</tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
  </body>
  </html>`;

  const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
  triggerDownload(blob, filename.endsWith('.doc') ? filename : `${filename}.doc`);
};

export const exportToText = (title, columns, rows, filename = 'export.txt') => {
  const colWidths = columns.map(col => {
    const maxValLen = rows.reduce((max, r) => Math.max(max, String(r[col.key] || '').length), 0);
    return Math.max(col.header.length, Math.min(maxValLen, 35));
  });

  const divider = '+' + colWidths.map(w => '-'.repeat(w + 2)).join('+') + '+';
  const headerLine = '|' + columns.map((col, i) => ` ${col.header.padEnd(colWidths[i])} `).join('|') + '|';

  const dataLines = rows.map(row => {
    return '|' + columns.map((col, i) => {
      const raw = String(row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : '');
      const truncated = raw.length > colWidths[i] ? raw.slice(0, colWidths[i] - 1) + '…' : raw;
      return ` ${truncated.padEnd(colWidths[i])} `;
    }).join('|') + '|';
  });

  const banner = [
    '='.repeat(divider.length),
    `  ${title.toUpperCase()}`,
    `  Exported: ${new Date().toLocaleString()} | Total Records: ${rows.length}`,
    '='.repeat(divider.length),
    ''
  ].join('\r\n');

  const content = banner + [divider, headerLine, divider, ...dataLines, divider].join('\r\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  triggerDownload(blob, filename.endsWith('.txt') ? filename : `${filename}.txt`);
};

export const exportToJson = (title, datasetName, rows, filename = 'export.json') => {
  const payload = {
    system: 'EliteEdu Academic Management System',
    title,
    dataset: datasetName,
    exported_at: new Date().toISOString(),
    record_count: rows.length,
    data: rows
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  triggerDownload(blob, filename.endsWith('.json') ? filename : `${filename}.json`);
};

