'use client';

import { FormatPreview } from './FormatPreview';
import { FormatName } from './FormatName';
import { FormatDescription } from './FormatDescription';
import { FormatCreditCost } from './FormatCreditCost';
import { UseThisFormatButton } from './UseThisFormatButton';

interface FormatPageContentProps {
  format: {
    id: string;
    name: string;
    description: string;
    creditCost: number;
    previewUrl?: string;
  };
}

export function FormatPageContent({ format }: FormatPageContentProps) {
  return (
    <div>
      <FormatPreview formatName={format.name} previewUrl={format.previewUrl} />
      <FormatName name={format.name} />
      <FormatDescription description={format.description} />
      <FormatCreditCost creditCost={format.creditCost} />
      <UseThisFormatButton formatId={format.id} />
    </div>
  );
}