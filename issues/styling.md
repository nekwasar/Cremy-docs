# Styling System — Enterprise Specification

## Architecture: 5 Layers

```
styles/
├── themes/           # Layer 0: Theme switching via CSS custom properties
│   ├── light.css
│   └── dark.css
├── tokens/           # Layer 1: Source of truth (declares all custom props)
│   ├── colors.css
│   ├── typography.css
│   ├── spacing.css
│   └── radii-shadows.css
├── base/             # Layer 2: Foundation
│   ├── reset.css
│   ├── global.css
│   └── animations.css
├── utilities/        # Layer 3: One-off reusable helpers
│   ├── layout.css
│   ├── typography.css
│   └── visual.css
├── components/       # Layer 4: Component-scoped CSS Modules
└── pages/            # Layer 5: Page-specific overrides
```

Import order: tokens → themes → base → utilities → components (self-import) → pages (self-import)

## 4 Meta-Themes

| Theme | Radius | Border | Shadow | Typography | Spacing | Animation |
|-------|--------|--------|--------|------------|---------|-----------|
| Raw Geometry | 0px | 1-2px solid | none | Sans uppercase accents | Asymmetric | Instant/linear |
| Editorial Dark | 2px | 1px solid | none | Mono primary | Comfortable | Subtle fades |
| **Soft Geometry** (default) | 6-12px | 1px solid | none | Sans medium | Generous even | Smooth ease |
| Minimal Hyper | 2-4px | 0.5px solid | none | Sans compact | Tight micro | Instant |

## 25 Components With All 4 Variant Definitions

See the implementation in `styles/components/`. Each component has:
- Base styles (shared across all themes)
- `[data-theme="raw-geometry"]` overrides
- `[data-theme="editorial-dark"]` overrides
- `[data-theme="soft-geometry"]` overrides (default, no override needed)
- `[data-theme="minimal-hyper"]` overrides

## Theme Switching

```tsx
<html data-theme="soft-geometry">  <!-- changes all 25 components instantly -->
```

Admin-created themes stored in MongoDB, injected as `<style>` tag at SSR.

## Color System

### Palette

| Role | Light | Dark | Token |
|------|-------|------|-------|
| Primary | `#2563eb` (royal blue) | `#3b82f6` (bright blue) | `--color-primary` |
| Primary hover | `#1d4ed8` | `#60a5fa` | `--color-primary-hover` |
| Primary active | `#1e40af` | `#2563eb` | `--color-primary-active` |
| Primary muted | `#dbeafe` | `#1e293b` | `--color-primary-muted` |
| Accent | `#ea580c` (red-orange) | `#f97316` (bright orange) | `--color-accent` |
| Accent hover | `#c2410c` | `#fb923c` | `--color-accent-hover` |
| Accent muted | `#fff7ed` | `#1f130b` | `--color-accent-muted` |
| Background | `#ffffff` (pure white) | `#000000` (pure black) | `--color-bg` |
| Background secondary | `#f8fafc` | `#0a0a0a` | `--color-bg-secondary` |
| Background tertiary | `#f1f5f9` | `#141414` | `--color-bg-tertiary` |
| Surface | `#ffffff` | `#0f0f0f` | `--color-surface` |
| Surface hover | `#f8fafc` | `#1a1a1a` | `--color-surface-hover` |
| Text | `#0f172a` (near-black) | `#f1f5f9` (near-white) | `--color-text` |
| Text secondary | `#475569` | `#94a3b8` | `--color-text-secondary` |
| Text muted | `#94a3b8` | `#64748b` | `--color-text-muted` |
| Text inverse | `#ffffff` | `#000000` | `--color-text-inverse` |
| Border | `#e2e8f0` | `#262626` | `--color-border` |
| Border light | `#f1f5f9` | `#1a1a1a` | `--color-border-light` |
| Border hover | `#cbd5e1` | `#404040` | `--color-border-hover` |
| Error | `#dc2626` | `#ef4444` | `--color-error` |
| Success | `#16a34a` | `#22c55e` | `--color-success` |
| Warning | `#ca8a04` | `#eab308` | `--color-warning` |
| Overlay | `rgba(15,23,42,0.5)` | `rgba(0,0,0,0.7)` | `--color-overlay` |

### How Themes Work

- `tokens/colors.css` declares all 27 custom properties with `initial` — no values
- `themes/light.css` fills them via `:root` — no attribute needed, this is the default
- `themes/dark.css` fills them via `[data-theme="dark"]` — activated by setting attribute on `<html>`
- All 25 component CSS modules reference `var(--color-primary)`, `var(--color-bg)`, etc.
- Switching `<html data-theme="dark">` instantly recolors every component — zero code changes

### Switching at Runtime

```tsx
// Read user preference from store/DB
const theme = useSettingsStore(s => s.theme); // "light" | "dark"

// Apply to document
document.documentElement.setAttribute('data-theme', theme);
```
