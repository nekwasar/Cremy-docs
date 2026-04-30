'use client';

interface InvoiceDownloadProps {
  paymentId: string;
}

export function InvoiceDownload({ paymentId }: InvoiceDownloadProps) {
  const handleDownload = async () => {
    const res = await fetch(`/api/payments/invoice/${paymentId}`);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${paymentId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload}>
      Download Invoice
    </button>
  );
}