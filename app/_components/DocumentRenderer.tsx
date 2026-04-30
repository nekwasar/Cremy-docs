'use client';

import { useState, useCallback } from 'react';
import { generateElementId } from '@/lib/element-id';
import { parseDocument, ParsedSection } from '@/lib/document-parse';
import { HeadingSection } from './sections/HeadingSection';
import { ParagraphSection } from './sections/ParagraphSection';
import { ListSection } from './sections/ListSection';
import { TableSection } from './sections/TableSection';
import { ImageSection } from './sections/ImageSection';

interface DocumentRendererProps {
  content: string;
  editable?: boolean;
  fullEditMode?: boolean;
  onContentChange?: (content: string) => void;
  newElementIds?: Set<string>;
}

export function DocumentRenderer({
  content,
  editable = false,
  fullEditMode = false,
  onContentChange,
  newElementIds,
}: DocumentRendererProps) {
  const [sections, setSections] = useState<ParsedSection[]>(() => {
    const parsed = parseDocument(content);
    return parsed.map((s) => ({ ...s, id: s.id || generateElementId(s.type) }));
  });

  const [clickedEditableId, setClickedEditableId] = useState<string | null>(null);

  const updateSectionContent = useCallback(
    (index: number, newContent: any) => {
      const updated = [...sections];
      updated[index] = { ...updated[index], content: newContent };
      setSections(updated);

      if (onContentChange) {
        const fullContent = updated
          .map((s) => {
            switch (s.type) {
              case 'heading':
                return `${'#'.repeat((s.content as any).level || 1)} ${(s.content as any).text}`;
              case 'paragraph':
                return (s.content as any).text;
              case 'list': {
                const items = (s.content as any).items as string[];
                return items.map((item, i) => (s.content as any).ordered ? `${i + 1}. ${item}` : `- ${item}`).join('\n');
              }
              case 'table': {
                const h = (s.content as any).headers as string[];
                const r = (s.content as any).rows as string[][];
                return ['|' + h.join('|') + '|', ...r.map((row) => '|' + row.join('|') + '|')].join('\n');
              }
              case 'image':
                return `![${(s.content as any).alt}](${(s.content as any).src})`;
              default:
                return '';
            }
          })
          .join('\n\n');
        onContentChange(fullContent);
      }
    },
    [sections, onContentChange]
  );

  const removeSection = useCallback(
    (index: number) => {
      const updated = sections.filter((_, i) => i !== index);
      setSections(updated);

      if (onContentChange) {
        const fullContent = updated.map((s) => s.content.text || s.content.alt || '').join('\n\n');
        onContentChange(fullContent);
      }
    },
    [sections, onContentChange]
  );

  const handleSectionClick = (id: string) => {
    if (editable && !fullEditMode) {
      setClickedEditableId(id);
    }
  };

  return (
    <div>
      {sections.map((section, index) => {
        const isEditable = fullEditMode || (editable && clickedEditableId === section.id);
        const isNew = newElementIds?.has(section.id) || false;

        const sectionElement = (() => {
          switch (section.type) {
            case 'heading':
              return (
                <HeadingSection
                  content={section.content}
                  editable={isEditable}
                  onChange={(text) => updateSectionContent(index, { ...section.content, text })}
                  elementId={section.id}
                  isNew={isNew}
                />
              );
            case 'paragraph':
              return (
                <ParagraphSection
                  content={section.content}
                  editable={isEditable}
                  onChange={(text) => updateSectionContent(index, { text })}
                  elementId={section.id}
                  isNew={isNew}
                />
              );
            case 'list':
              return (
                <ListSection
                  content={section.content}
                  editable={isEditable}
                  onChange={(items) => updateSectionContent(index, { ...section.content, items })}
                  elementId={section.id}
                  isNew={isNew}
                />
              );
            case 'table':
              return (
                <TableSection
                  content={section.content}
                  editable={isEditable}
                  onChange={(headers, rows) => updateSectionContent(index, { headers, rows })}
                  elementId={section.id}
                  isNew={isNew}
                />
              );
            case 'image':
              return (
                <ImageSection
                  content={section.content}
                  editable={isEditable}
                  onChange={(src, alt) => updateSectionContent(index, { src, alt })}
                  onRemove={() => removeSection(index)}
                  elementId={section.id}
                  isNew={isNew}
                />
              );
            default:
              return <p>Unknown section type: {section.type}</p>;
          }
        })();

        return (
          <div key={section.id} onClick={() => handleSectionClick(section.id)}>
            {sectionElement}
          </div>
        );
      })}
    </div>
  );
}