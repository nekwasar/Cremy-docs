'use client';

import Link from 'next/link';

interface TemplateInfo {
  id: string;
  name: string;
  category: string;
  isFavorited: boolean;
  lastUsed?: string;
}

interface TemplateFavoritesProps {
  favorites: TemplateInfo[];
  recents: TemplateInfo[];
  onToggleFavorite: (templateId: string) => void;
}

export function TemplateFavorites({ favorites, recents, onToggleFavorite }: TemplateFavoritesProps) {
  return (
    <div>
      <h3>Templates</h3>

      <div>
        <h4>Favorites ({favorites.length})</h4>
        {favorites.length === 0 ? (
          <p>No favorite templates yet</p>
        ) : (
          <ul>
            {favorites.map((t) => (
              <li key={t.id}>
                <Link href={`/templates/${t.category}/${t.id}`}>{t.name}</Link>
                <button onClick={() => onToggleFavorite(t.id)}>Unfavorite</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h4>Recently Used</h4>
        {recents.length === 0 ? (
          <p>No recently used templates</p>
        ) : (
          <ul>
            {recents.map((t) => (
              <li key={t.id}>
                <Link href={`/templates/${t.category}/${t.id}`}>{t.name}</Link>
                {t.lastUsed && <span>{new Date(t.lastUsed).toLocaleDateString()}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}