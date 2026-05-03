'use client';

import { useState } from 'react';
import { FORMATS, FormatConfig } from '@/config/formats';
import { FORMAT_PROMPTS } from '@/config/format-prompts';
import { AdminSidebar } from '../../_components/AdminSidebar';
import c from '@/styles/components/Card.module.css';
import b from '@/styles/components/Button.module.css';
import i from '@/styles/components/Input.module.css';
import t from '@/styles/components/Table.module.css';

export default function AdminFormatsPage() {
  const [formats, setFormats] = useState<FormatConfig[]>(FORMATS);
  const [editingFormat, setEditingFormat] = useState<FormatConfig | null>(null);
  const [viewingPrompt, setViewingPrompt] = useState<string | null>(null);

  const handleEdit = (format: FormatConfig) => {
    setEditingFormat({ ...format });
  };

  const handleSave = () => {
    if (!editingFormat) return;
    setFormats((prev) =>
      prev.map((f) => (f.id === editingFormat.id ? editingFormat : f))
    );
    setEditingFormat(null);
  };

  const handleAdd = () => {
    const newFormat: FormatConfig = {
      id: `new-${Date.now()}`,
      name: 'New Format',
      description: 'Description',
      category: 'business',
      creditCost: 1,
    };
    setFormats((prev) => [...prev, newFormat]);
    setEditingFormat(newFormat);
  };

  const handleDelete = (id: string) => {
    setFormats((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div style={{display:'flex'}}>
      <AdminSidebar />
      <div style={{maxWidth:'var(--container-xl)',margin:'0 auto',padding:'var(--space-8) var(--space-6)',flex:1}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'var(--space-6)'}}>
          <h1 style={{fontSize:'var(--text-2xl)',fontWeight:'var(--weight-bold)',margin:0}}>Format Administration</h1>
          <button className={`${b.btn} ${b.soft}`} onClick={handleAdd}>Add Format</button>
        </div>

        <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
          <table className={`${t.table} ${t.soft}`}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Credits</th>
                <th>Prompt</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {formats.map((format) => (
                <tr key={format.id}>
                  <td style={{fontWeight:'var(--weight-medium)'}}>{format.name}</td>
                  <td>{format.category}</td>
                  <td>{format.creditCost}</td>
                  <td>
                    <button className={`${b.btn} ${b.minimal}`} onClick={() => setViewingPrompt(format.id)}>View Prompt</button>
                  </td>
                  <td>
                    <div style={{display:'flex',gap:'var(--space-2)'}}>
                      <button className={`${b.btn} ${b.minimal}`} onClick={() => handleEdit(format)}>Edit</button>
                      <button className={`${b.btn} ${b.minimal}`} onClick={() => handleDelete(format.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingFormat && (
          <div className={`${c.card} ${c.soft}`} style={{marginBottom:'var(--space-6)'}}>
            <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Edit Format</h2>
            <div className={i.group}>
              <label className={i.label}>Name</label>
              <input className={`${i.input} ${i.soft}`} value={editingFormat.name} onChange={(e) => setEditingFormat({ ...editingFormat, name: e.target.value })} />
            </div>
            <div className={i.group}>
              <label className={i.label}>Description</label>
              <textarea className={`${i.input} ${i.soft} ${i.textarea}`} value={editingFormat.description} onChange={(e) => setEditingFormat({ ...editingFormat, description: e.target.value })} />
            </div>
            <div className={i.group}>
              <label className={i.label}>Category</label>
              <select className={`${i.input} ${i.soft}`} value={editingFormat.category} onChange={(e) => setEditingFormat({ ...editingFormat, category: e.target.value })}>
                <option value="business">Business</option>
                <option value="academic">Academic</option>
                <option value="legal">Legal</option>
                <option value="personal">Personal</option>
                <option value="creative">Creative</option>
              </select>
            </div>
            <div className={i.group}>
              <label className={i.label}>Credit Cost</label>
              <input className={`${i.input} ${i.soft}`} type="number" value={editingFormat.creditCost} onChange={(e) => setEditingFormat({ ...editingFormat, creditCost: parseInt(e.target.value) || 1 })} />
            </div>
            <div className={i.group}>
              <label className={i.label}>Preview URL</label>
              <input className={`${i.input} ${i.soft}`} value={editingFormat.previewUrl || ''} onChange={(e) => setEditingFormat({ ...editingFormat, previewUrl: e.target.value })} placeholder="Video, GIF, or image URL" />
            </div>
            <div style={{display:'flex',gap:'var(--space-3)'}}>
              <button className={`${b.btn} ${b.soft}`} onClick={handleSave}>Save</button>
              <button className={`${b.btn} ${b.raw}`} onClick={() => setEditingFormat(null)}>Cancel</button>
            </div>
          </div>
        )}

        {viewingPrompt && (
          <div className={`${c.card} ${c.soft}`}>
            <h2 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)'}}>Prompt: {FORMATS.find((f) => f.id === viewingPrompt)?.name}</h2>
            <div style={{marginBottom:'var(--space-4)'}}>
              <h3 style={{fontSize:'var(--text-sm)',fontWeight:'var(--weight-medium)',color:'var(--color-text-secondary)',marginBottom:'var(--space-2)'}}>System Prompt</h3>
              <pre style={{background:'var(--color-input-bg)',padding:'var(--space-3)',borderRadius:'var(--radius-xs)',fontFamily:'var(--font-mono)',fontSize:'var(--text-xs)',overflowX:'auto',whiteSpace:'pre-wrap'}}>
                {FORMAT_PROMPTS[viewingPrompt]?.systemPrompt || 'No prompt configured'}
              </pre>
            </div>
            <div style={{marginBottom:'var(--space-4)'}}>
              <h3 style={{fontSize:'var(--text-sm)',fontWeight:'var(--weight-medium)',color:'var(--color-text-secondary)',marginBottom:'var(--space-2)'}}>User Template</h3>
              <pre style={{background:'var(--color-input-bg)',padding:'var(--space-3)',borderRadius:'var(--radius-xs)',fontFamily:'var(--font-mono)',fontSize:'var(--text-xs)',overflowX:'auto',whiteSpace:'pre-wrap'}}>
                {FORMAT_PROMPTS[viewingPrompt]?.userPromptTemplate || 'No template configured'}
              </pre>
            </div>
            <div style={{marginBottom:'var(--space-4)'}}>
              <h3 style={{fontSize:'var(--text-sm)',fontWeight:'var(--weight-medium)',color:'var(--color-text-secondary)',marginBottom:'var(--space-2)'}}>Output Schema</h3>
              <pre style={{background:'var(--color-input-bg)',padding:'var(--space-3)',borderRadius:'var(--radius-xs)',fontFamily:'var(--font-mono)',fontSize:'var(--text-xs)',overflowX:'auto',whiteSpace:'pre-wrap'}}>
                {JSON.stringify(FORMAT_PROMPTS[viewingPrompt]?.outputSchema || {}, null, 2)}
              </pre>
            </div>
            <button className={`${b.btn} ${b.raw}`} onClick={() => setViewingPrompt(null)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
