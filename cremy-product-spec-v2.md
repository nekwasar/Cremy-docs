# Cremy Docs — Product Requirements Document (PRD)
**Product Name:** Cremy Docs  
**Domain:** cremy.co  
**Brand:** Cremy (parent brand — "Docs" is the first product under it)  
**Version:** 2.0  
**Status:** Ready for Engineering  

---

> **On the name:** The domain is cremy.co. The product is called **Cremy Docs** — clean, obvious, and instantly communicates what it does. "Cremy" is preserved as the parent brand for future products. Alternative names considered: *Cremy Folio* (premium feel), *Cremy Draft* (implies creation), *Cremy Paper* (doc metaphor). **Cremy Docs** wins — no ambiguity, strong SEO value, scalable brand architecture.

---

## 1. Product Overview

**Cremy Docs** is an AI-powered document platform where anyone can create, format, convert, and export professional documents in seconds — without needing to know how to design, write, or format anything. The entire product is built around one idea: you bring the information, Cremy handles everything else.

Cremy Docs does three things and does them exceptionally well:
1. **Create** — generate any professional document from a prompt or raw content dump
2. **Edit** — refine any part of a generated document by highlighting it and telling the AI what to change
3. **Convert** — change any document from one format to another (PDF → DOCX, DOCX → PDF, etc.)

No chat interfaces. No complex editors. Just clean, fast, AI-powered documents.

### Tagline
> *"Documents, done smoothly."*

### One-liner
> Cremy Docs turns a prompt — or a content dump — into a polished, professional PDF in under 30 seconds.

### The core loop
```
User picks a template OR dumps raw content →
Prompt template guides the best possible input →
AI generates a structured, formatted document →
User highlights any element to refine with AI →
Export as PDF (default) or convert to any format
```

---

## 2. Target Audience

**Everyone** — broad positioning. Key personas:

| Persona | Use Case | Frequency |
|---|---|---|
| Job seeker | Cover letters, resumes | High |
| Freelancer | Proposals, invoices, contracts | High |
| Student | Essays, reports, lesson plans | High |
| Startup founder | Pitch decks, business plans | Medium |
| HR professional | Job descriptions, offer letters | Medium |
| Marketing team | Briefs, newsletters, memos | High |
| Educator | Syllabi, lesson plans, rubrics | Medium |

---

## 3. Differentiators (Why Cremy Docs Wins)

| What aidocmaker does | What Cremy Docs does better |
|---|---|
| Plain text input box — users guess what to write | Curated prompt templates per doc type — best possible input, one click |
| Basic prompt → generic doc | Prompt template + structured input = high-quality, accurate output every time |
| Chat-based editing — feels like a chatbot | Highlight any element → floating AI command bar → surgical edits in place |
| No raw content support | Dump anything (notes, bullet points, a brain dump) → AI formats it into a polished doc |
| Format conversion is an afterthought | First-class file conversion tool — PDF ↔ DOCX ↔ PPTX ↔ XLSX and more |
| Clunky, dated UI | Clean, minimal — Notion/Linear aesthetic |
| Restrictive free tier | Generous rate limits — no watermarks, no paywalled exports |

---

## 4. Document Types (Launch Set — 35 Templates)

### Career
- Cover Letter
- Resume / CV
- LinkedIn Summary
- Resignation Letter
- Recommendation Letter
- Reference Letter

### Business
- Business Plan
- Business Proposal
- Project Proposal
- Executive Summary
- Meeting Agenda
- Meeting Notes / Minutes
- Business Memo
- Company Newsletter
- Press Release
- Job Description

### Legal & Finance
- Invoice
- Quote / Estimate
- Contract (General)
- NDA (Non-Disclosure Agreement)
- Service Agreement
- Budget Spreadsheet

### Academic
- Essay
- Research Report
- Lesson Plan
- Course Syllabus
- Study Guide
- Literature Review

### Marketing
- Marketing Brief
- Campaign Plan
- Brochure
- Flyer
- Social Media Content Plan

### Presentations
- Pitch Deck
- Company Presentation
- Project Status Deck

---

## 5. Core Features

### 5.1 Document Generation
- User selects a template category and doc type OR chooses "Start from scratch"
- AI generates the full document with correct structure, headings, formatting, and professional content
- Live streaming preview — content appears as it generates (typewriter effect), section by section
- Output always renders as a visual PDF-style preview (what you see is what you get)
- User can regenerate the whole doc or a specific section with one click
- No fields the AI cannot fill confidently — if information is missing, AI makes a smart, clearly-marked placeholder

### 5.2 Smart Prompt Templates (Key Differentiator)
This is the feature that separates Cremy Docs from every competitor. Instead of a blank text box where users guess what to write, every document type has a set of curated, expert-crafted prompt templates.

**How it works:**
- Below the main input box, 3–5 prompt template cards are shown per document type
- Each card has a short label (e.g. *"Confident career changer"*, *"Entry-level applicant"*, *"Senior executive"*) and a one-line description
- User clicks a card → the full prompt template populates the input box instantly
- The template contains clearly marked fill-in sections: `[YOUR NAME]`, `[COMPANY NAME]`, `[YEARS OF EXPERIENCE]`
- User fills in only their specifics — the framing, tone instructions, and structure guidance are already written
- User hits Generate

**Why this matters:**
- Users get the best possible output because the prompt is already engineered for quality
- Users feel guided, not lost — especially first-time users
- Every generated doc is meaningfully better than what a user would produce with a blank box
- This is the UX moment that makes users say "wow" and tell others

**Example — Cover Letter prompt templates:**
- *"Applying with relevant experience"* — straightforward, confident, experience-matched
- *"Career changer"* — reframes past experience as transferable, addresses the pivot directly
- *"No experience / entry level"* — leads with enthusiasm, skills, and education
- *"Executive / senior role"* — authoritative, achievement-focused, concise
- *"Cold outreach / speculative application"* — not responding to a specific job posting

**Prompt template structure (internal):**
```
Write a [TONE] cover letter for [YOUR NAME] applying for the role of [JOB TITLE] 
at [COMPANY NAME]. 

Background: [PASTE YOUR EXPERIENCE / BIO HERE]

Key requirements from the job description: [PASTE JD OR KEY POINTS]

Instructions:
- Open with a strong hook, not "I am writing to apply for..."
- Keep under 300 words
- Highlight 2–3 specific achievements with numbers where possible
- Close with a confident, forward-looking call to action
- Tone: [Professional / Enthusiastic / Concise — user selects]
```

### 5.3 Contextual AI Editing (Highlight + Command)
There is no chat panel. There is no separate editor. The document preview IS the editing surface.

**How it works:**
- The generated document renders as a clean, PDF-style visual preview
- User hovers over any element — a paragraph, heading, table row, bullet list, or sentence — and it becomes subtly highlighted
- A small floating action bar appears near the highlighted element with an input field
- User types a natural language command directly in that bar:
  - *"Make this more confident"*
  - *"Shorten to 2 sentences"*
  - *"Add a bullet point about project management"*
  - *"Change the tone to formal"*
  - *"Remove this section"*
  - *"Rewrite this — I don't like it"*
- AI updates only that specific element — nothing else in the document changes
- The updated element highlights briefly in green to show what changed
- Undo button appears for 5 seconds if the user wants to revert
- No back-and-forth. No chat history. One command, one result.

**Why no traditional chat:**
- Chat creates cognitive load — users have to remember context, scroll up, re-read
- Cremy Docs is a document tool, not an assistant — interaction should feel like editing a Google Doc, not messaging a bot
- The highlight-and-command model is faster, more precise, and more intuitive for document editing

### 5.4 Raw Content Dump
Users do not need to start from a template. They can dump anything into Cremy Docs and ask it to turn it into a formatted, professional document.

**Supported dump types:**
- Bullet point notes → formatted report
- Rough paragraphs → polished business proposal
- Pasted email thread → structured meeting notes
- Numbered list of facts → professional executive summary
- Scraped data or copy-pasted text → formatted invoice or table
- Voice-to-text transcript → cleaned-up document

**How it works:**
- User selects "Format my content" from the creation menu
- Pastes raw content into a large input box
- Selects what they want it to become (or lets AI suggest)
- Adds any additional instructions (tone, length, audience)
- Clicks Generate → AI outputs a clean, structured PDF-ready document

### 5.5 File Conversion
A dedicated, first-class tool for converting documents between formats. Not an afterthought — a standalone feature prominently accessible from the dashboard and homepage.

**Supported conversions (launch):**
| From | To |
|---|---|
| PDF | DOCX, PPTX, XLSX, TXT |
| DOCX | PDF, TXT |
| PPTX | PDF |
| XLSX | PDF |
| TXT | PDF, DOCX |

**How it works:**
- User uploads any supported file (drag-and-drop or file picker)
- Selects target format
- Clicks Convert → file is processed server-side
- Download link appears within seconds
- No account required for basic conversion (rate-limited)
- Pro users get unlimited conversions + AI-enhanced conversion (e.g. PDF → DOCX that is actually editable, not just a scanned image)

**Notes:**
- No image files. No video files. Documents only.
- AI-enhanced conversion preserves structure, headings, tables, and formatting far better than traditional converters
- This feature alone is a high-intent SEO traffic driver ("pdf to word converter", "convert pdf to docx free")

### 5.6 Brand Kit
- Upload company logo (PNG/SVG)
- Set primary color, secondary color, accent color
- Set preferred font from a curated list of 20 professional fonts
- Brand kit auto-applies to: document header, footer, color accents, font family
- Preview updates live as brand settings change
- Multiple brand kits supported (Pro+) — useful for freelancers serving multiple clients
- All kits saved to user account and auto-applied on new document creation if set as default

### 5.7 Document Dashboard
- Grid/list view of all created and converted documents
- Search by title or doc type
- Filter by: document type, date created, format
- Sort by: newest, oldest, last edited
- Rename, duplicate, delete documents
- Document version history — snapshot saved on every generation and AI edit (Pro+)
- Folders for organization (Pro+)

### 5.8 Export & Download
All generated documents export as **PDF by default**. Other formats are available as a conversion from the export modal.

| Action | Free | Pro |
|---|---|---|
| Download as PDF | ✅ Unlimited (rate limited) | ✅ Unlimited |
| Convert to DOCX / PPTX / XLSX | ✅ Rate limited | ✅ Unlimited |
| Copy to clipboard (plain text) | ✅ | ✅ |
| Send to Google Drive | ❌ | ✅ |
| Watermark | ❌ Never | ❌ Never |

> **No watermarks — ever.** Growth is driven by rate limits that encourage upgrades, not by watermarking free users' documents. Watermarks damage trust and create a bad first impression.

### 5.9 Upload & Improve
- User uploads an existing document (PDF or DOCX)
- AI reads it and offers a set of one-click actions:
  - **Rewrite** — improve quality, clarity, and professionalism
  - **Reformat** — restructure into a Cremy template style
  - **Translate** — convert to another language (Pro+)
  - **Summarize** — generate an executive summary
  - **Extend** — add more content to a short document
- Output is a new document in the dashboard — original is preserved

---

## 6. User Flows

### Flow 1: New Document via Template (Core Flow)
```
1. Land on homepage or dashboard → click "New Document"
2. Browse template gallery by category OR use search
3. Select template (e.g. "Cover Letter")
4. Input screen appears:
   - Main input box (large, clean)
   - Below it: 4–5 prompt template cards for that doc type
   - Tone selector (Professional / Confident / Concise / Friendly)
   - Brand kit selector (if user has one saved)
5. User clicks a prompt template card → it populates the input box
6. User fills in their specifics: name, company, role, background
7. Click "Generate"
8. Streaming preview renders live — document builds section by section
9. Document appears fully formed as a PDF-style visual preview
10. User hovers over any element to highlight → floating command bar appears
11. User types edit command → AI updates that element in place
12. User clicks "Download PDF" → file downloads instantly
13. Optional: click "Convert" to get DOCX, PPTX, etc.
```

### Flow 2: Contextual AI Edit
```
1. Open any document in the visual preview
2. Hover over a paragraph, heading, or table
3. Element highlights subtly, floating command bar appears
4. User types: "Make this shorter and more direct"
5. AI rewrites only that element — rest of doc unchanged
6. Updated element flashes green briefly
7. Undo button visible for 5 seconds
8. User continues reviewing → hovers next element → repeats if needed
9. No scrolling chat. No context window management. No back-and-forth.
```

### Flow 3: Raw Content Dump
```
1. Click "Format My Content" from dashboard or homepage
2. Large input area appears — user pastes their raw content
3. AI suggests what document type it looks like (user can override)
4. User optionally adds instructions: "Make it formal", "Target a CFO audience"
5. Click "Generate"
6. AI structures and formats the content into a professional document
7. Streaming preview renders
8. User reviews → highlights any element to refine → downloads as PDF
```

### Flow 4: File Conversion
```
1. Click "Convert a File" from dashboard or homepage
2. Drag-and-drop or pick file (PDF, DOCX, PPTX, XLSX, TXT)
3. Select target format (e.g. PDF → DOCX)
4. Click "Convert"
5. Progress bar → download link appears
6. User downloads converted file
7. File also saved to dashboard for future access (if logged in)
```

### Flow 5: Upload & Improve
```
1. Click "Improve My Document" from dashboard
2. Upload PDF or DOCX
3. AI reads document → shows brief summary of what it found
4. User picks action: Rewrite / Reformat / Translate / Summarize / Extend
5. AI generates improved version
6. Visual preview renders → user reviews → highlights to refine
7. Download as PDF or convert to desired format
```

---

## 7. AI Architecture

### Models

| Task | Model | Provider | Why |
|---|---|---|---|
| Document generation (primary) | DeepSeek V4 Pro | DeepInfra | Powerful, cost-efficient ($1.74/$3.48 per 1M tokens), 1M context |
| Long-form / complex documents | Kimi 2.6 (K2) | Moonshot AI | 1M context window, strong structured output, excellent for long docs |
| Fast contextual edits (highlight + command) | DeepSeek V4 Pro (targeted prompt) | DeepInfra | Same model, smaller scoped prompt = fast and cheap |
| File reading / upload & improve | Kimi 2.6 | Moonshot AI | Long context handles full documents in one pass |

### Model Routing Logic
```
Short docs (cover letter, memo, invoice, resignation letter) → DeepSeek V4 Pro
Long docs (business plan, research report, course syllabus)  → Kimi 2.6
Contextual element edit (highlight + command)                → DeepSeek V4 Pro (scoped)
Upload & improve (reading full uploaded doc)                 → Kimi 2.6
Raw content formatting                                       → DeepSeek V4 Pro
File conversion (non-AI, format only)                        → Server-side library (no AI)
AI-enhanced file conversion (structure preservation)         → Kimi 2.6
```

### Prompt Architecture
Each of the 35 templates has a dedicated prompt system consisting of:
1. **System prompt** — defines the document's structure, required sections, formatting rules, and quality bar
2. **Prompt templates (5 per doc type)** — curated user-facing starters that map to different use cases; each encodes tone, framing, and structure guidance
3. **Output format instructions** — structured JSON with labeled sections (headline, intro, body sections, closing); this is what the frontend renders into the visual preview
4. **Brand context injection** — company name, primary color, font preference injected into system prompt for brand-aware formatting

### Streaming
- Server-Sent Events (SSE) from backend to frontend
- Document renders section by section as AI outputs them — heading appears, then paragraph streams in, then next section begins
- Frontend maps each JSON section to a visual component in the preview
- Streaming gives the impression of "watching the document write itself" — core to the wow factor

---

## 8. Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| UI components | shadcn/ui (customized) |
| Document preview renderer | Custom React component (renders structured JSON as PDF-style layout) |
| Highlight + command interaction | Custom overlay system (Floating UI library for positioning) |
| Animations | Framer Motion |
| Icons | Lucide React |
| State management | Zustand |
| Data fetching | TanStack Query |

### Backend
| Layer | Technology |
|---|---|
| API | Next.js API Routes (or separate Node/Express if team prefers) |
| Auth | Supabase Auth (email + Google OAuth) |
| Database | Supabase (PostgreSQL) |
| File storage | Supabase Storage (uploaded files, exported docs) |
| Job queue | Upstash QStash (async generation + conversion jobs) |
| Caching | Upstash Redis |

### AI & Integrations
| Layer | Technology |
|---|---|
| DeepSeek V4 Pro | DeepInfra API (OpenAI-compatible endpoint) |
| Kimi 2.6 | Moonshot AI API |
| Streaming | Server-Sent Events (SSE) |
| PDF generation | Puppeteer (server-side, headless Chrome renders HTML → PDF) |
| DOCX conversion | LibreOffice (server-side, headless) + docx npm package |
| PPTX generation | pptxgenjs |
| XLSX generation | SheetJS (xlsx) |
| Google Drive export | Google Drive API v3 |
| File parsing (upload) | pdf-parse (PDF text extraction), mammoth (DOCX text extraction) |

### Payments & Analytics
| Layer | Technology |
|---|---|
| Payments | Stripe (subscriptions) |
| Analytics | PostHog (product analytics + feature flags) |
| Error tracking | Sentry |
| Email | Resend |
| Deploy | Vercel |

---

## 9. Database Schema (Core Tables)

```sql
-- Users (extends Supabase auth.users)
users
  id uuid PK
  email text
  name text
  avatar_url text
  plan text DEFAULT 'free'           -- free | pro | business
  docs_used_this_month int DEFAULT 0
  conversions_used_this_month int DEFAULT 0
  edits_used_this_month int DEFAULT 0
  reset_date date                    -- monthly reset date for rate limits
  created_at timestamp

-- Brand Kits
brand_kits
  id uuid PK
  user_id uuid FK → users
  name text
  logo_url text
  primary_color text
  secondary_color text
  accent_color text
  font text
  is_default boolean
  created_at timestamp

-- Documents
documents
  id uuid PK
  user_id uuid FK → users
  title text
  doc_type text                      -- 'cover_letter' | 'resume' | 'invoice' | etc.
  source text                        -- 'template' | 'raw_dump' | 'upload_improve'
  content jsonb                      -- structured doc as labeled sections (rendered by preview)
  raw_markdown text                  -- full doc as markdown (fallback / export source)
  brand_kit_id uuid FK → brand_kits (nullable)
  prompt_template_used text          -- which prompt template card the user clicked
  user_input jsonb                   -- the filled-in prompt input saved for regeneration
  status text                        -- 'generating' | 'ready' | 'error'
  folder_id uuid FK → folders (nullable)
  created_at timestamp
  updated_at timestamp

-- Document Versions (snapshot on every generation + accepted AI edit)
document_versions
  id uuid PK
  document_id uuid FK → documents
  content jsonb
  raw_markdown text
  trigger text                       -- 'generation' | 'ai_edit' | 'manual'
  created_at timestamp

-- Contextual Edit Log (highlight + command history per document)
edit_log
  id uuid PK
  document_id uuid FK → documents
  element_id text                    -- which section/element was targeted
  element_before text                -- content before the edit
  element_after text                 -- content after the edit
  command text                       -- what the user typed
  accepted boolean                   -- did user keep or undo
  created_at timestamp

-- Folders
folders
  id uuid PK
  user_id uuid FK → users
  name text
  created_at timestamp

-- Exports & Downloads
exports
  id uuid PK
  document_id uuid FK → documents (nullable — null for standalone conversions)
  source_format text                 -- 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'txt'
  target_format text
  file_url text
  file_size_kb int
  created_at timestamp

-- File Conversions (standalone — no document created)
conversions
  id uuid PK
  user_id uuid FK → users (nullable — allow logged-out, rate-limited)
  original_file_url text
  original_format text
  converted_file_url text
  target_format text
  ai_enhanced boolean DEFAULT false
  created_at timestamp

-- Usage / Rate Limit Tracking
usage_logs
  id uuid PK
  user_id uuid FK → users
  action text                        -- 'generate' | 'ai_edit' | 'convert' | 'upload_improve' | 'export'
  doc_type text
  model_used text
  tokens_used int
  created_at timestamp
```

---

## 10. Pricing & Monetization

### Rate Limit Philosophy
No watermarks. No locked export formats. Rate limits are the only friction — generous enough that free users love the product, tight enough that power users upgrade.

### Tiers

| Feature | Free | Pro ($12/mo) | Business ($29/mo) |
|---|---|---|---|
| Documents / month | 10 | 150 | Unlimited |
| Contextual AI edits / month | 30 | Unlimited | Unlimited |
| File conversions / month | 5 | 100 | Unlimited |
| AI-enhanced conversion | ❌ | ✅ | ✅ |
| Upload & improve | ❌ | ✅ | ✅ |
| Export formats | PDF + convert (rate limited) | All formats, unlimited | All formats, unlimited |
| Brand kits | 1 | 5 | Unlimited |
| Google Drive export | ❌ | ✅ | ✅ |
| Version history | ❌ | Last 10 versions | Unlimited |
| Folders | ❌ | ✅ | ✅ |
| Team members | ❌ | ❌ | 5 seats |
| AI model quality | Standard | Premium | Premium |
| Priority generation | ❌ | ✅ | ✅ |
| Watermark | ❌ Never | ❌ Never | ❌ Never |
| .edu email | Free Pro | — | — |

### Growth Levers
- **Rate limits** → free users hit the ceiling naturally and upgrade organically
- **Referral program** → share link, both get +5 docs that month
- **Free .edu tier** → student adoption → future paid conversion post-graduation
- **File conversion as a free tool** → massive SEO traffic magnet, converts to registered users

---

## 11. UI/UX Design Direction

### Aesthetic: Clean Minimal (Notion × Linear)
- **Background:** Off-white `#FAFAF9` or pure white `#FFFFFF`
- **Text:** Near-black `#1A1A1A`
- **Accent:** Single brand color (suggest: `#5B4FE8` — a refined indigo)
- **Borders:** Subtle `#E5E5E5`
- **Shadows:** Soft, barely-there (not card-heavy)

### Typography
- **Display:** Geist (Vercel's font — modern, clean)
- **Body:** Inter
- **Document preview:** Georgia or Lora (makes the generated doc feel real and printed)

### Key UI Principles
1. **No clutter** — one action at a time, progressive disclosure
2. **Document always center** — UI wraps around the document, not the other way
3. **Editing is invisible until needed** — hover to reveal the highlight and command bar; at rest, the doc looks like a finished PDF
4. **Prompt templates below the fold** — input box is the hero; templates appear naturally below it without overwhelming the screen
5. **Instant feedback everywhere** — streaming text, skeleton loaders, green flash on accepted edits, progress bars on conversions
6. **Mobile-aware** — dashboard, prompt templates, and raw dump work on mobile; the preview + edit surface is desktop-first

### Key Screens
1. **Homepage** — hero with live animated demo, three feature pillars (Create / Edit / Convert), template gallery preview, social proof strip
2. **Dashboard** — document grid with type badges, conversion history tab, quick actions: "New Doc", "Format My Content", "Convert a File"
3. **Template Gallery** — category tabs, searchable, each card shows doc type name + a thumbnail of what the output looks like
4. **Input Screen** — large clean input box at top, prompt template cards below (3–5 per doc type with labels and descriptions), tone selector, brand kit picker, Generate button
5. **Document Preview (Editor Surface)** — full PDF-style visual preview center-screen; hover any element to reveal highlight + floating command bar; toolbar at top: Regenerate, Download PDF, Convert, Brand Kit
6. **Conversion Tool** — drag-and-drop upload zone, format selector, Convert button, progress bar, download link; minimal, no distractions
7. **Brand Kit Settings** — logo upload, color pickers (with hex input), font selector from curated list, live preview of a sample document with brand applied
8. **Pricing Page** — clean 3-column layout, monthly/annual toggle (annual = 2 months free), feature comparison table
9. **Export / Convert Modal** — format options grid (PDF highlighted as default), "Convert to another format" option, Download button

---

## 12. Build Phases

### Phase 1 — Core (Weeks 1–4)
- [ ] Auth (email + Google OAuth)
- [ ] Template gallery (10 most popular doc types)
- [ ] Input screen with prompt template cards (3 templates per doc type for the 10 launch types)
- [ ] AI generation (DeepSeek V4 Pro) with SSE streaming
- [ ] PDF-style visual document preview renderer
- [ ] PDF export (Puppeteer)
- [ ] Free user dashboard (doc grid, basic actions)
- [ ] Rate limit enforcement for free tier

### Phase 2 — Editing & Conversion (Weeks 5–8)
- [ ] Highlight + command contextual AI editing (floating command bar)
- [ ] Edit log (undo, version snapshot on accepted edits)
- [ ] Raw content dump flow ("Format My Content")
- [ ] File conversion tool (PDF ↔ DOCX ↔ PPTX ↔ XLSX)
- [ ] AI-enhanced conversion (Kimi 2.6)
- [ ] All 35 templates + prompt templates for each
- [ ] Upload & improve flow
- [ ] DOCX / PPTX / XLSX export

### Phase 3 — Brand & Monetization (Weeks 9–10)
- [ ] Brand kit (logo, colors, fonts, live preview)
- [ ] Stripe subscription integration (Free / Pro / Business)
- [ ] Monthly usage tracking + rate limit enforcement per plan
- [ ] Pricing page with plan toggle
- [ ] Document version history (Pro)
- [ ] Folders (Pro)

### Phase 4 — Growth (Weeks 11–12)
- [ ] Google Drive export (Pro)
- [ ] Referral program (share link → +5 docs for both)
- [ ] .edu free Pro tier
- [ ] Team seats (Business plan)
- [ ] SEO landing pages per doc type and conversion tool (50+ pages)
- [ ] PostHog analytics + funnel tracking (where do users drop off?)

---

## 13. SEO Strategy (Critical Growth Channel)

aidocmaker.com generates over $72K/month in SEO traffic value. The strategy is replicable. Cremy Docs targets the same high-intent keywords with dedicated landing pages — one per template and one per conversion tool:

```
cremy.co/cover-letter-generator
cremy.co/resume-maker
cremy.co/invoice-generator
cremy.co/business-plan-generator
cremy.co/ai-essay-writer
cremy.co/pdf-to-word-converter
cremy.co/word-to-pdf-converter
cremy.co/pdf-to-powerpoint
cremy.co/powerpoint-to-pdf
cremy.co/free-nda-generator
... (one per template + one per conversion pair)
```

Each page:
- Targets a single high-intent keyword
- Has a live, embedded demo (not a screenshot — a working tool)
- Unique, quality copy — not duplicate boilerplate
- Internal links to the full app and related tools

Target: **60+ indexed pages at launch** → meaningful organic traffic within 60–90 days.

The file conversion pages are especially powerful — "pdf to word converter free" gets millions of searches monthly and converts extremely well because the user intent is instant and transactional.

---

## 14. Success Metrics (First 90 Days)

| Metric | Target |
|---|---|
| Registered users | 5,000 |
| Documents generated | 50,000 |
| File conversions | 20,000 |
| Free → Pro conversion rate | 4–6% |
| Monthly Recurring Revenue | $5,000+ |
| Avg session time | 8+ minutes |
| Day-7 retention | 25%+ |
| Prompt template usage rate | 60%+ of all generations |

---

## 15. Open Questions for Team

1. **Logged-out conversions** — allow file conversions without an account (rate limited by IP)? Strong for SEO/growth but requires bot protection (Cloudflare Turnstile).
2. **Real-time collaboration** — co-editing on same doc? Complex infrastructure — push to Phase 4+.
3. **Mobile app** — native iOS/Android or PWA first? Recommend PWA for launch, native post-traction.
4. **White-label** — allow businesses to embed Cremy Docs under their brand? Strong future B2B revenue stream — design API with this in mind from Phase 1.
5. **API access** — expose generation and conversion as a developer API? Natural Business plan perk — plan the schema to support it.
6. **Prompt template contributions** — allow power users to save and share their own prompt templates? Community-driven moat over time.
7. **AI translation** — translate full document to another language as a one-click action? High demand, relatively simple to implement — Phase 2 candidate.

---

*Document owned by Product. Version 2.0. Last updated: April 2026.*
