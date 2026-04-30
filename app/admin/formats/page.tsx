'use client';

import { useState, useEffect } from 'react';
import { FORMATS, FormatConfig } from '@/config/formats';
import { FORMAT_PROMPTS } from '@/config/format-prompts';

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
    <div>
      <h1>Format Administration</h1>

      <button onClick={handleAdd}>Add Format</button>

      <table>
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
              <td>{format.name}</td>
              <td>{format.category}</td>
              <td>{format.creditCost}</td>
              <td>
                <button
                  onClick={() => setViewingPrompt(format.id)}
                >
                  View Prompt
                </button>
              </td>
              <td>
                <button onClick={() => handleEdit(format)}>Edit</button>
                <button onClick={() => handleDelete(format.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingFormat && (
        <div>
          <h2>Edit Format</h2>
          <div>
            <label>Name</label>
            <input
              value={editingFormat.name}
              onChange={(e) =>
                setEditingFormat({ ...editingFormat, name: e.target.value })
              }
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              value={editingFormat.description}
              onChange={(e) =>
                setEditingFormat({
                  ...editingFormat,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label>Category</label>
            <select
              value={editingFormat.category}
              onChange={(e) =>
                setEditingFormat({
                  ...editingFormat,
                  category: e.target.value,
                })
              }
            >
              <option value="business">Business</option>
              <option value="academic">Academic</option>
              <option value="legal">Legal</option>
              <option value="personal">Personal</option>
              <option value="creative">Creative</option>
            </select>
          </div>
          <div>
            <label>Credit Cost</label>
            <input
              type="number"
              value={editingFormat.creditCost}
              onChange={(e) =>
                setEditingFormat({
                  ...editingFormat,
                  creditCost: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>
          <div>
            <label>Preview URL</label>
            <input
              value={editingFormat.previewUrl || ''}
              onChange={(e) =>
                setEditingFormat({
                  ...editingFormat,
                  previewUrl: e.target.value,
                })
              }
              placeholder="Video, GIF, or image URL"
            />
          </div>
          <div>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditingFormat(null)}>Cancel</button>
          </div>
        </div>
      )}

      {viewingPrompt && (
        <div>
          <h2>Prompt: {FORMATS.find((f) => f.id === viewingPrompt)?.name}</h2>
          <div>
            <h3>System Prompt</h3>
            <pre>
              {FORMAT_PROMPTS[viewingPrompt]?.systemPrompt || 'No prompt configured'}
            </pre>
          </div>
          <div>
            <h3>User Template</h3>
            <pre>
              {FORMAT_PROMPTS[viewingPrompt]?.userPromptTemplate || 'No template configured'}
            </pre>
          </div>
          <div>
            <h3>Output Schema</h3>
            <pre>
              {JSON.stringify(FORMAT_PROMPTS[viewingPrompt]?.outputSchema || {}, null, 2)}
            </pre>
          </div>
          <button onClick={() => setViewingPrompt(null)}>Close</button>
        </div>
      )}
    </div>
  );
}