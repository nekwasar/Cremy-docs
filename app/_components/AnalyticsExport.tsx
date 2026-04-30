'use client';

interface AnalyticsExportProps {
  onExportCSV: () => void;
  onExportPDF: () => void;
  onEmailReport: () => void;
}

export function AnalyticsExport({ onExportCSV, onExportPDF, onEmailReport }: AnalyticsExportProps) {
  return (
    <div>
      <button onClick={onExportCSV}>Export CSV</button>
      <button onClick={onExportPDF}>Export PDF</button>
      <button onClick={onEmailReport}>Email Report</button>
    </div>
  );
}