# Cremy Docs - Technical Milestone Document

**Version:** 1.0  
**Status:** Ready for Engineering  
**Last Updated:** April 2026

---

## Overview

This document provides extremely detailed technical specifications for building Cremy Docs.

**Development Approach:** Backend First - Minimal frontend only when necessary for testing.

---

## Milestone Order

### Phase 1: Infrastructure (M1.1 - M1.2)
- **M1.1:** Project Setup & Docker ✅
- **M1.2:** User Types & Credit System ✅

### Phase 2: Frontend (M2 - M5)
- **M2:** Frontend Core & Routing
- **M3:** Homepage Quick Actions & State Management
- **M4:** Document Generation Engine
- **M5:** Document Generation Page

### Phase 3: Rendering (M6 - M8)
- **M6:** Format Templates System
- **M7:** Document Preview & Rendering
- **M8:** Document Generation Features

### Phase 4: Tools (M9 - M11)
- **M9:** Voice-to-Document
- **M10:** Image Integration
- **M11:** File Conversion System (55 issues, 200 SEO pages)

### Phase 5: User Features (M12 - M14)
- **M12:** Pro User Dashboard
- **M13:** Data Storage & Persistence
- **M14:** Admin Panel

### Phase 6: Monetization (M15)
- **M15:** Payments & Subscriptions

### Phase 7: SEO (M16 - M18)
- **M16:** SEO & Public Pages
- **M17:** SEO Tool Pages
- **M18:** Edge Cases & Error Handling

### Phase 8: AI Agent (M19)
- **M19:** Intelligent Document Agent

---

## M1.1: Project Setup & Docker

### Project Setup (Docker + Backend Foundation)

**Approach:** Backend first, minimal frontend for testing only

**Tech Stack:**
- Backend: Next.js 14 API Routes with TypeScript
- Database: MongoDB
- Container: Docker + Docker Compose
- Frontend: Minimal HTML/JSON endpoints for testing

**Docker Setup Required:**
- `Dockerfile` - Next.js app container
- `docker-compose.yml` - MongoDB + Redis + App
- `.dockerignore` - Exclude node_modules, build files

**Directory Structure:**
```
/app
  /api              # API routes
  /(auth)           # Auth pages (login, register)
  /(dashboard)      # Protected dashboard
  /(public)         # Public pages
/components
  /ui               # Base UI components
  /document         # Document-specific components
  /converter        # Conversion tools
/lib
  /ai               # AI integration
  /auth             # Authentication utilities
  /db               # Database connections
  /utils            # Helper functions
```

## M1.2: User Types & Credit System

### User Types

1. **Anonymous User**
   - No account required
   - Gets 5 free credits (one-time, initial)
   - Can use ALL features as long as credits available
   - Rate limiting triggers when credits exhausted
   - Can download, view document history
   - Data stored in localStorage (default: OFF in settings)
   - Auto-deletes after 24h if credits < 10

2. **Registered Free User**
   - Email/Password OR Google OAuth signup
   - Email verification REQUIRED before account activated
   - Reward: 10 free credits (one-time after email verified)
   - No time-based rate limits
   - Storage option: Can enable localStorage or cloud storage
   - Dashboard upgrades with full features

3. **Pro Subscriber**
   - Monthly ($9/mo) or Yearly ($86/yr)
   - Monthly: 200 credits/month (valid for billing period only)
   - Yearly: 2400 credits (valid for 12 months)
   - Unlimited cloud storage
   - Full dashboard + analytics

### Credit System

**Credit Allocation:**
| User Type | Initial Credits | Renewal | Expiration |
|----------|----------------|---------|------------|
| Anonymous | 5 (one-time) | None | Never |
| Registered Free | 10 (one-time) | None | Never |
| Pro Monthly | 200/month | Monthly | Per billing period |
| Pro Yearly | 2400/year | Yearly | Per billing period |

**Credit Costs:**
| Action | Cost | Notes |
|--------|------|-------|
| Document Generation | 1 credit / 100 words | Core AI |
| AI Editing | 1 credit / 10 edits | |
| Translation | 1 credit / 50 words | Any language |
| Extract Text (OCR) | 1 credit / 50 words | PDF/Image to text |
| Change Style | 1 credit / 100 words | |
| Image Add | 1 credit / image | Max 5 per doc |
| Merge PDF | FREE | Traffic driver |
| Split PDF | FREE | Traffic driver |
| Compress PDF | FREE | Traffic driver |
| Basic Convert | FREE | Traffic driver |

### Referral Program

**Registered Users Only:**
- Refer to BUY credits: Referrer gets 10% of every purchase forever
- Refer to Pro: Referrer gets 10 credits (one-time)
- Referred user: No automatic reward (optional future feature)

### Pro Subscription

| Plan | Price | Credits | Validity |
|------|-------|---------|----------|
| Pro Monthly | $9/mo | 200/month | Per billing period |
| Pro Yearly | $86/yr | 2400 | Per 12 months |

**Pro Credits Difference:**
- Bought credits: Never expire
- Pro credits: Valid only for billing period, expire if unused

### Credit Packs

| Pack | Price | Cost per Credit |
|------|-------|-----------------|
| 100 credits | $10 | 10¢ |
| 500 credits | $40 | 8¢ |
| 1000 credits | $70 | 7¢ |

```typescript
// User Schema (MongoDB)
interface User {
  _id: ObjectId;
  email: string;
  passwordHash?: string; // Only if email/password
  googleId?: string;
  name: string;
  avatarUrl?: string;
  role: 'free' | 'pro';
  credits: number;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
}

// Anonymous User (localStorage only)
interface AnonymousUser {
  anonymousId: string; // UUID
  credits: number;
  createdAt: number; // timestamp
  documents: DocumentPreview[]; // stored locally
  autoDeleteAt: number; // 24h from creation if credits < 10
}
```

### Credit System

**Credit Costs (Admin Configurable):**
| Action | Cost | Configurable |
|--------|------|--------------|
| Document Generation | 1 credit per 100 words | Yes |
| AI Editing | 1 credit per 10 edit prompts | Yes |
| Translation | 1 credit per 50 words | Yes |
| Format/Template | Per-format custom price | Yes |
| File Conversion | FREE (always) | N/A |
| Summarization | 1 credit per 100 words | Yes |

**Credit Bundles:**
- 100 credits = $10 (1 credit = 10 cents)
---

## M2: Frontend Core & Routing

### App Structure

**Routes:**
```
/                           # Homepage (tool showcase) — app/(public)/page.tsx
/generate                   # Document generation — app/(dashboard)/generate/page.tsx
/preview                    # Document preview & editing — app/(dashboard)/preview/page.tsx
/convert                    # File conversion tool — app/convert/page.tsx
/convert/[slug]             # SEO conversion pages (200 paths) — app/convert/[slug]/page.tsx
/templates                  # Template gallery — app/(public)/templates/page.tsx
/templates/[category]       # Templates by category — app/(public)/templates/[category]/page.tsx
/templates/[category]/[id]  # Individual template — app/(public)/templates/[category]/[id]/page.tsx
/translate                  # Translation page — app/(dashboard)/translate/page.tsx
/voice                      # Voice-to-document — app/(dashboard)/voice/page.tsx
/extract-text               # Extract text OCR landing — app/extract-text/page.tsx
/extract-text-from-pdf      # Extract text tool — app/(dashboard)/extract-text-from-pdf/page.tsx
/merge-pdf                  # Merge PDFs — app/(dashboard)/merge-pdf/page.tsx
/split-pdf                  # Split PDF — app/(dashboard)/split-pdf/page.tsx
/compress-pdf               # Compress PDF — app/(dashboard)/compress-pdf/page.tsx
/edit-file                  # Edit file — app/(dashboard)/edit-file/page.tsx
/change-style               # Change document style — app/(dashboard)/change-style/page.tsx
/format                     # Format templates index — app/format/page.tsx
/format/[formatId]          # Individual format page — app/format/[formatId]/page.tsx
/auth/login                 # Login — app/(auth)/login/page.tsx
/auth/register              # Register — app/(auth)/register/page.tsx
/dashboard                  # User dashboard — app/(dashboard)/dashboard/page.tsx
/settings                   # User settings — app/(dashboard)/settings/page.tsx
/admin                      # Admin panel — app/admin/page.tsx
/pro                        # Pro upgrade — app/(public)/pro/page.tsx
/blog                       # Blog index — app/blog/page.tsx
/blog/[slug]                # Blog post — app/blog/[slug]/page.tsx
/about                      # About page — app/about/page.tsx
/features                   # Features page — app/features/page.tsx
/how-it-works               # How it works — app/how-it-works/page.tsx
/contact                    # Contact page — app/contact/page.tsx
/privacy                    # Privacy policy — app/privacy/page.tsx
/terms                      # Terms of service — app/terms/page.tsx
/buy-credits                # Buy credits — app/buy-credits/page.tsx
/account/subscription       # Subscription mgmt — app/account/subscription/page.tsx
/account/billing            # Payment history — app/account/billing/page.tsx
```

### Homepage Layout (Tool Showcase)

**Purpose:** Showcase all tools, quick actions, value proposition - NOT a tool page

**Structure:**
```
┌─────────────────────────────────────────┐
│  Logo (left)    [Login] [Sign Up]       │  ← Header
├─────────────────────────────────────────┤
│                                         │
│         Hero Section                     │
│    "Documents, done smoothly."          │
│    Value proposition + animated demo    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│     Quick Actions Grid                   │
│  ┌─────────────────────────────────┐   │
│  │  [📄 Generate]  [🔄 Convert]    │   │
│  │  [🌐 Translate] [🎤 Voice]      │   │
│  │  [📝 OCR]       [📑 Merge]     │   │
│  │  [✂️ Split]     [📦 Compress]  │   │
│  │  [🎨 Change Style]              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Explore Designs] [How it works]      │
│                                         │
├─────────────────────────────────────────┤
│  Features & Descriptions                 │
│  - Create professional documents         │
│  - Convert any file format              │
│  - Translate to any language            │
│  - Voice to document                   │
│  - Extract text from PDF/image              │
│  - Merge, split, compress PDFs          │
│  - Change document style                │
│  - AI-powered editing                   │
└─────────────────────────────────────────┘
```

### Document Generation Page

**Purpose:** Main document creation interface

**Layout:**
```
┌─────────────────────────────────────────┐
│  Home > Generate                        │  ← Breadcrumb
├─────────────────────────────────────────┤
│  Logo    [💰]    [Account ▼]           │  ← Fixed Top Bar (click 💰 to reveal credits)
├─────────────────────────────────────────┤
│                                         │
│  [Explore Styles ▼] [?]                │  ← Templates modal trigger
│                                         │
├─────────────────────────────────────────┤
│                                         │
│     Input Box (expandable textarea)     │
│     "Paste your document text here..." │
│     [Add Image 📷]                     │
│                                         │
│     [Clear] [Generate Document]        │
│                                         │
├─────────────────────────────────────────┤
│  Credit Estimate: ~X credits            │
└─────────────────────────────────────────┘
```

**Header Elements:**
- Fixed top bar: Logo (left), Credit balance (center), Account menu (right)
- Credit balance always visible at top

### Templates Modal Flow

**Step 1: Open Modal**
- Click "Explore Styles" dropdown button
- Modal shows categories: Business, Academic, Legal, Personal, Creative

**Step 2: Select Category**
- Click category → redirects to /templates/[category]

**Step 3: Template Page**
- /templates/[category] shows all templates in that category
- Image preview grid

**Step 4: Select Template**
- Click template → Preview modal appears
- Modal: Template preview + [Cancel] [Use Template]
- Click "Use Template" → redirects to /generate?template=[id]

### Preview/Edit Page

**Purpose:** Document preview and editing

**Layout:**
```
┌─────────────────────────────────────────┐
│  Home > Generate > Preview              │  ← Breadcrumb
├─────────────────────────────────────────┤
│  Logo    [💰]    [Account ▼]           │  ← Fixed Top Bar (click 💰 to reveal credits)
├─────────────────────────────────────────┤
│  [← Back] [Title] [Preview] [Edit]    │  ← Toolbar
│  [Undo] [Redo] [Download ▼]           │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│         Document Preview                │
│      (Rendered PDF-style view)          │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│  [Download PDF ▼]  [Start New Project] │
└─────────────────────────────────────────┘
```

**Actions:**
- Download: Opens format selector dropdown
- Start New Project: Redirects to /generate

### Post-Action Modal

**Trigger:** After user clicks Download

**Modal:**
```
┌─────────────────────────────────────────┐
│           ✅ Download Complete!          │
│                                         │
│     What would you like to do next?    │
│                                         │
│     [Start New Project]  [View Doc]    │
│                                         │
│     Auto-closes in 10 seconds           │
└─────────────────────────────────────────┘
```

**Behavior:**
- No automatic redirect
- User chooses what to do
- Modal auto-expires after 10 seconds
- If user doesn't respond, stays on preview page

### Navigation Structure

**Desktop:**
- Fixed top navigation bar
- Breadcrumb below nav (like File Explorer)
- Current page shown with underline
- Example: Home > Generate (underlined)

**Mobile:**
- Hamburger menu icon at right side
- Click opens slide-out modal from right
- Close by clicking outside modal
- Breadcrumb at top left of content area

### Credit Display

**Floating Badge:**
- Icon only (💰 or similar)
- Click to reveal balance in tooltip/podal
- Non-obtrusive, doesn't block content
- Shows on all pages in fixed position

---

## M3: Homepage Quick Actions

### Quick Actions Grid (User)

**Buttons on Homepage:**
```
┌─────────────────────────────────────────┐
│  ┌──────────────┐ ┌──────────────┐     │
│  │   📄        │ │    🔄       │     │
│  │   Generate  │ │   Convert   │     │
│  │    Doc      │ │    Files    │     │
│  └──────────────┘ └──────────────┘     │
│  ┌──────────────┐ ┌──────────────┐     │
│  │    🌐       │ │    🎤       │     │
│  │  Translate  │ │    Voice    │     │
│  │             │ │  to Document│     │
│  └──────────────┘ └──────────────┘     │
│  ┌──────────────┐ ┌──────────────┐     │
│  │    📝       │ │    📑       │     │
│  │Extract Text │ │  Merge PDF   │     │
│  └──────────────┘ └──────────────┘     │
│  ┌──────────────┐ ┌──────────────┐     │
│  │    ✂️       │ │    📦       │     │
│  │  Split PDF  │ │Compress PDF │     │
│  └──────────────┘ └──────────────┘     │
│  ┌──────────────┐                       │
│  │    🎨       │                       │
│  │Change Style  │                       │
│  └──────────────┘                       │
└─────────────────────────────────────────┘
```

### Quick Actions Grid (Admin Only)

**Additional buttons (admin visible, user NOT visible):**
```
┌─────────────────────────────────────────┐
│  ┌──────────────┐                       │
│  │    ✉️       │                       │
│  │  Mailcraft  │                       │
│  │  (Email Tool)                       │
│  └──────────────┘                       │
└─────────────────────────────────────────┘
```
┌─────────────────────────────────────────┐
│  ┌──────────────┐ ┌──────────────┐     │
│  │   📄        │ │    🔄       │     │
│  │   Generate  │ │   Convert   │     │
│  │    Doc      │ │    Files    │     │
│  └──────────────┘ └──────────────┘     │
│  ┌──────────────┐ ┌──────────────┐     │
│  │    🌐       │ │    🎤       │     │
│  │  Translate  │ │    Voice    │     │
│  │             │ │  to Document│     │
│  └──────────────┘ └──────────────┘     │
│  ┌──────────────┐ ┌──────────────┐     │
│  │    📝       │ │    📑       │     │
│  │Extract Text │ │  Merge PDF   │     │
│  └──────────────┘ └──────────────┘     │
│  ┌──────────────┐ ┌──────────────┐     │
│  │    ✂️       │ │    📦       │     │
│  │  Split PDF  │ │Compress PDF │     │
│  └──────────────┘ └──────────────┘     │
│  ┌──────────────┐                       │
│  │    🎨       │                       │
│  │Change Style  │                       │
│  └──────────────┘                       │
└─────────────────────────────────────────┘
```

**Click Actions:**
- Generate Doc → /generate
- Convert Files → /convert
- Translate → /translate
- Voice to Document → /voice
- Extract Text → /extract-text-from-pdf
- Merge PDF → /merge-pdf
- Split PDF → /split-pdf
- Compress PDF → /compress-pdf
- Change Style → /change-style
│                                         │
│         Format Templates Grid           │
│   (Video/preview of each format)        │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│     Input Box (expandable textarea)     │  ← Main input
│     [AI generates document]             │
│                                         │
└─────────────────────────────────────────┘
```

**Input Box Behavior:**
- Default: 2 rows, full width
- On focus: Expands to 6 rows height
- Max height: 300px with scroll
- Placeholder: "Describe what document you want..."
- Send button appears on typing
- WebSocket streaming for generation

### State Management

**Zustand Store:**
```typescript
interface AppState {
  // User
  user: User | null;
  isAuthenticated: boolean;
  credits: number;
  
  // Document
  currentDocument: Document | null;
  documentHistory: DocumentPreview[];
  
  // UI
  inputValue: string;
  isGenerating: boolean;
  streamingContent: string;
  
  // Settings
  tone: 'professional' | 'casual' | 'formal';
  language: string;
}
```

### Error Handling

**Error Types & UI:**

| Error Type | Message | Action |
|------------|---------|--------|
| 400 (Bad Request) | "Invalid input. Please check your text." | Inline error |
| 401 (Unauthorized) | Redirect to login | Auto-redirect |
| 429 (Rate Limit) | "Credit limit reached. Upgrade to continue." | Modal with plans |
| 500 (Server Error) | "Page load error. Don't worry, it's not your fault. Reload or try again later." | Modal error |
| AI Timeout | "Generation timed out. Try again." | Retry button |
| Network Error | "Connection lost. Reconnecting..." | Auto-retry 3x |

---

## M4: Document Generation Engine

### AI Integration

**Plug-and-Play Admin System:**
- Admin page to add/remove/view API keys
- Single key entry (user said simple admin, not multi-key)
- System uses configured model automatically
- User never selects model - it's automatic

**AI Flow:**
```
User Input (text)
    ↓
Check credits (deduct on start)
    ↓
WebSocket connection established
    ↓
Send to AI API with format context
    ↓
Stream response via WebSocket
    ↓
Frontend renders skeleton + fills progressively
    ↓
Complete: Show document preview
```

### WebSocket Implementation

**Connection:**
- Single WebSocket connection per document session
- Reconnect on disconnect (auto, 3 retries)
- Event types: `generation`, `edit`, `format`, `translate`, `summarize`

**Protocol:**
```typescript
// Client → Server
{ type: 'generate', payload: { text, format, tone, options } }
{ type: 'edit', payload: { documentId, elementId, instruction } }
{ type: 'format', payload: { text, formatId } }
{ type: 'translate', payload: { text, targetLang } }
{ type: 'summarize', payload: { text } }

// Server → Client
{ type: 'start' }
{ type: 'chunk', payload: 'text content...' }
{ type: 'complete', payload: { document: {...} } }
{ type: 'error', payload: { message, code } }
{ type: 'credit_update', payload: { remaining: number } }
```

### Streaming UX (Skeleton + Fill)

**Behavior:**
1. User clicks generate
2. Show document skeleton (placeholders for sections)
3. As AI streams, fill in sections progressively
4. Skeleton remains visible until content arrives

**Implementation:**
```typescript
// Document skeleton structure
interface DocumentSkeleton {
  title: { status: 'pending' | 'filled', content: string };
  sections: {
    id: string;
    heading: { status: 'pending' | 'filled', content: string };
    content: { status: 'pending' | 'filled', content: string };
  }[];
}
```

### Document Output

**Structure (from AI):**
```typescript
interface GeneratedDocument {
  id: string;
  title: string;
  format: string;
  sections: DocumentSection[];
  metadata: {
    wordCount: number;
    createdAt: Date;
    tone: string;
  };
}

interface DocumentSection {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'table' | 'image';
  content: string;
  metadata?: any;
}
```

---

## M5: Document Generation Page

### M3B.1 Page Structure

**URL:** `/generate`

**Layout:**
```
┌─────────────────────────────────────────┐
│  Home > Generate                         │  ← Breadcrumb
├─────────────────────────────────────────┤
│  Logo    [💰]    [Account ▼]           │  ← Fixed Top Bar (click 💰 to reveal credits)
├─────────────────────────────────────────┤
│                                         │
│  [Explore Styles ▼]                    │  ← Opens templates modal
│                                         │
├─────────────────────────────────────────┤
│                                         │
│     Input Box (expandable textarea)      │
│     "Paste your document text here..." │
│                                         │
│     [Add Image 📷]                      │
│     [Describe where image should go]    │
│                                         │
│     [Clear] [Generate Document]         │
│                                         │
├─────────────────────────────────────────┤
│  Credit Estimate: ~X credits            │
└─────────────────────────────────────────┘
```

**UI/UX Notes:**
- Doc Structure dropdown: Simple, non-blocking, default set to "Auto"
- "Explore Styles" button: Opens modal for template selection
- Voice to Doc: CTA button in page (not header)

### M3B.2 Doc Structure Dropdown

**Label:** "Doc Structure" or simple label

**Options:**
- Default: "Auto" (AI auto-detects)
- Business: Invoice, Contract, Proposal, Report, Memo
- Academic: Essay, Research Paper, Thesis, Study Guide
- Legal: NDA, Agreement, Affidavit
- Personal: Resume, Cover Letter, CV
- Creative: Story, Blog Post, Newsletter

**Behavior:**
- Default: "Auto" - AI detects structure from content
- User can select specific structure
- Can also specify in input text: "make this into an invoice"

### M3B.3 Explore Styles Modal

**Trigger:** Click "Explore Styles" button

**Modal:**
```
┌─────────────────────────────────────────┐
│     Select a Category                    │
│  ┌─────────────────────────────────┐   │
│  │  💼 Business                    │   │
│  │  🎓 Academic                    │   │
│  │  ⚖️  Legal                     │   │
│  │  👤 Personal                   │   │
│  │  ✨ Creative                   │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Click Action:** Click category → Redirects to /templates/[category]

### M3B.4 Image Addition

**Method:** Describe in input text

**Flow:**
```
User types in input:
"Paste image of logo at the top right corner"
    ↓
"[Add Image 📷]" button shows count
    ↓
User uploads image via file picker
    ↓
AI interprets placement from text description
```

**Alternative:**
- User can specify: "add [image] after paragraph 2"

### M3B.5 Templates Page (/templates/[category])

**URL:** `/templates/[category]`

**Structure:**
```
┌─────────────────────────────────────────┐
│  Home > Templates > [Category]          │  ← Breadcrumb
├─────────────────────────────────────────┤
│  Logo    [💰]    [Account ▼]           │  ← Fixed Top Bar (click 💰 to reveal credits)
├─────────────────────────────────────────┤
│                                         │
│  Template Grid (Image Previews)         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ [img]   │ │ [img]   │ │ [img]   │  │
│  │Template1│ │Template2│ │Template3│  │
│  └─────────┘ └─────────┘ └─────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

**Click Action:** Opens preview modal

### M3B.6 Template Preview Modal

**Trigger:** Click template from grid

**Modal:**
```
┌─────────────────────────────────────────┐
│  [Category] - Template Name             │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │      Large Preview Image         │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Cancel]            [Use Template]     │
└─────────────────────────────────────────┘
```

**Click "Use Template":**
- Redirects to /generate?template=[id]
- Template context pre-loaded

### M3B.7 Credit Estimation

**Always Visible:**
- Shows estimated credit cost before any action
- Updates as user types (word count)
- Format: "Estimated cost: ~X credits"

**Calculation:**
- 1 credit per 100 words
- Admin configurable
- 1 credit per image added

### M3B.7 Generation Flow

```
User enters text in input box
    ↓
Selects Doc Structure (optional)
    ↓
Adds images if needed (max 5, costs 1 credit each)
    ↓
Clicks "Generate Document"
    ↓
Show skeleton + fill progressive
    ↓
Complete: Show document preview
    ↓
User can edit (free preview edit or AI commands)
    ↓
User can regenerate from original input
    ↓
After download: Show save banner
```

### M3B.8 Regeneration

**Allowed:** Yes, users can regenerate from original input

**How it works:**
- Original input text is always preserved in session
- "Regenerate" button available in document preview
- Uses same input + any new modifications
- Costs credits again (based on word count)

**No Save Required:**
- Even if user didn't enable storage, they can regenerate
- As long as they haven't closed the browser tab
- Original input remains in memory

### M3B.9 Save Banner (Post-Download)

**Trigger:** ONLY after user downloads document

**NOT shown:**
- Not shown after just generating
- Not shown after just editing
- Only after download is completed

**Banner UI:**
```
┌─────────────────────────────────────────┐
│  🔒 Turn on storage to save your work   │
│  Your activities will be securely stored│
│                                         │
│  [Turn on Storage]  [Not Interested]    │
│            [Never show me this again]   │
└─────────────────────────────────────────┘
```

**Conditions:**
- Show for: Free users with 10+ credits (NOT Pro users - they already have storage)
- Pro users: Already have MongoDB storage, no banner needed

**User Options:**
1. **Turn on Storage:** Enables localStorage saving
2. **Not Interested:** Disables for current session only
3. **Never show me this again:** Permanent disable (can toggle back in settings)

**Settings Location:** User can enable/disable anytime in Settings

**Default Setting:** OFF (closed) for free users

---

## M6: Format Templates System

### Format Template Pages

**Concept:** No stored templates - each format has a presentation page showing what it looks like (video/GIF/demo), and a detailed prompt that generates it.

**Format Page URL:** `/format/[formatId]`

**Page Structure:**
```
┌─────────────────────────────────────────┐
│  Format Preview (Video/GIF/Demo)        │
│  ┌─────────────────────────────────┐    │
│  │   Animated preview of format    │    │
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│  Format Name: [Invoice]                 │
│  Description: [Professional invoice...] │
├─────────────────────────────────────────┤
│  Credit Cost: [X credits]               │
├─────────────────────────────────────────┤
│  [Use This Format] Button               │
├─────────────────────────────────────────┤
│  Input Box (expandable)                 │
│  [User enters their content]            │
│                                         │
│  [Generate Document]                    │
└─────────────────────────────────────────┘
```

### Format Categories

**Categories:**
1. **Business** - Invoice, Proposal, Contract, Report, Memo
2. **Academic** - Essay, Research Paper, Thesis, Summary
3. **Legal** - NDA, Agreement, Letter
4. **Personal** - Resume, Cover Letter, CV
5. **Creative** - Story, Blog Post, Newsletter

**Format Credit Costs (Admin Configurable):**
- Default: Same as word-based generation
- Complex formats (presentations): Higher cost

### Format Prompt System

Each format has a detailed prompt that the AI uses:
```typescript
interface FormatPrompt {
  id: string;
  name: string;
  description: string;
  creditCost: number;
  preview: {
    type: 'video' | 'gif' | 'interactive';
    url: string;
  };
  systemPrompt: string; // Detailed prompt for AI
  userPromptTemplate: string; // Template user input fills into
  outputSchema: JSONSchema; // Expected output format
}
```

---

## M7: Document Preview & Rendering

### Preview Renderer

**Implementation:** React components rendering structured JSON to HTML

**Quality:** High-quality rendering for best document appearance

**Components:**
```typescript
// Document Renderer
<DocumentRenderer document={document} />

// Section Components
<HeadingSection />
<ParagraphSection />
<ListSection />
<TableSection />
<ImageSection />
```

### View Mode vs Edit Mode

**Three Editing Options:**

1. **Preview Click Edit (Free):**
   - Default mode: document rendered as final output
   - Click any element to make ONLY that element editable
   - Other elements remain in preview mode
   - For tiny, simple edits
   - Text: Click to edit directly
   - Image: Click shows "Remove" and "Replace" buttons

2. **Make Content Editable (Free):**
   - Click "Make Content Editable" button in toolbar
   - ALL elements become editable
   - Full free-form editing
   - Click any text to edit inline
   - Click any image for Remove/Replace options

3. **AI Commands (Costs Credits):**
   - Use main input box to give AI commands
   - "Make this more confident"
   - "Add bullet point about X"
   - "Change tone to formal"
   - AI edits specified elements
   - More complex editing tasks

**Edit Interactions:**
```typescript
// Preview Mode - Click element to edit only that element
{ type: 'preview_edit', elementId: 'section-1' }
// Only this element becomes editable

// Edit Mode - Make all editable
{ type: 'set_editable', mode: true }
// All elements become editable

// Image - Always shows options
{ type: 'image_options' } → Shows: [Remove] [Replace]
// Click Replace → File picker opens
```

### New Content Highlighting

**Visual Feedback:**
- New AI-generated content: Light green background
- Fade out after 2 seconds
- Animation: Subtle scale (optional)

```css
.new-content {
  background-color: #d1fae5; /* light green */
  transition: background-color 2s ease-out;
}

.new-content.fade {
  background-color: transparent;
}
```

### Undo System

**All Methods Implemented:**

1. **Toolbar Button:** Persistent "Undo" button in document toolbar
   - Visible while document is open
   - Undoes last AI edit
   
2. **Keyboard Shortcut:** Ctrl+Z / Cmd+Z
   - Works for AI edits
   - History: Last 10 actions

3. **Toast Notification:** After each AI edit
   - Shows for 5 seconds
   - "Undo" button in toast

**Undo Scope:**
- AI edits only (not manual changes)
- Reverts element to previous state
- Updates credit if needed (refund for undo within 30s)

### Tool-Specific Preview Behaviors

**Note:** Each tool has unique preview behavior. All previews are shown in the preview section (except where noted).

#### Generate (from Text or Command)
- Skeleton of document loads first until fully loaded
- User sees quick preview (frontpage) of document
- Always: Preview + Download buttons under preview section

#### Edit Tool
- Editing done in preview page if any tool produces unexpected outcome
- Exception: OCR - NO preview available

#### Convert Tool
- Before and After preview (first page only)
- Shows "100% quality as promised" message
- User sees nothing changed in their file (conversion is lossless)
- Preview button opens new doc to be previewed

#### Translate Tool
- Before and After preview (first page of old + new document)
- Preview button opens new translated doc
- Download + Preview buttons under preview section

#### Voice Tool
- Shows only the document first page preview
- Download + Preview buttons under preview section
- New doc can be previewed in preview page

#### Extract (OCR)
- NO preview - just extracted text
- Copy button for text copy
- Try Again button next to Copy button
- Click Try Again: opens input for user to specify corrections/mistakes

#### Merge Tool
- **Agent ALWAYS asks which file first** to avoid errors
- User specifies order (e.g., "which file goes first?")
- Files arranged in specified order
- Preview + Download buttons under preview section

#### Split Tool
- **Agent asks what has to be split:**
  - "Page 1 to 3 separate from page 4 to 6?"
  - Or "pages 1,3,5 separate from pages 2,4,6?"
- Files arranged in specified order
- Preview + Download buttons under preview section

#### Compress Tool
- Shows PDF icon for two files (original + compressed)
- Shows file size for both: original size vs new size
- Download + Preview buttons under preview section

#### Change Style Tool
- Agent comes in **AFTER user selects style**
- Converts existing document to text first (all pages have doc-to-text tool)
- Recreates document in new selected style
- Preview + Download buttons under preview section

### Upload Dash Replacement

**On pages with agent:**
- Upload dash disappears
- Replaced with visual indicators for tools
- Shown at top of page

## M8: Document Generation Features

### Generation from Text Input

**Input Methods:**
1. **Direct Text:** User types in main input box
2. **Template Selection:** User selects format, then inputs text
3. **AI Auto-Detect:** User enters text, AI determines format

**Processing:**
```
User input (text)
    ↓
Count words → Calculate credits required
    ↓
Check user has enough credits
    ↓
Send to AI with format context (if selected)
    ↓
WebSocket streams response
    ↓
Render in preview
    ↓
Deduct credits
```

### AI Editing

**Credit Cost:** 1 credit per 10 edit prompts

**Edit Types:**
- "Make this more confident"
- "Shorten to 2 sentences"
- "Add bullet point about X"
- "Change tone to formal"
- "Remove this section"
- "Rewrite this"

**Scope:**
- Edit single element (not full document)
- AI understands context around element
- Only target element changes

**Feedback:**
- Green highlight on edited element (2s fade)
- Undo button appears

### Document Formatting

**Concept:** Formatting applies structure/styles to existing text or generated content

**Format Options:**
- Structure: Sections, headings, bullet points
- Style: Professional, creative, academic
- Layout: Margins, spacing, columns

**Credit Cost:** Admin configurable per format

### Translation

**Languages:** Top 10 (EN, ES, FR, DE, IT, PT, ZH, JA, KO, AR)

**Cost:** 1 credit per 50 translated words

**Process:**
```
User selects target language
    ↓
AI translates document content
    ↓
Maintains original formatting
    ↓
Returns translated document
```

### Summarization

**Options:**
- Shorter version (user selects length: brief/medium/detailed)
- Bullet-point summary

**Cost:** 1 credit per 100 words (original)

---

## M9: Voice-to-Document

### Voice Recording

**Audio Formats:** MP3, WAV, M4A (common formats)

**Recording Method:**
- In-app record button
- Browser records audio
- Upload pre-recorded file option

**Limits:**
- Maximum 2 minutes per recording
- English only (initial release)

**UI:**
```
┌─────────────────────────────────────────┐
│         🎤 Voice to Document            │
├─────────────────────────────────────────┤
│                                         │
│         [ 🎤 Hold to Record ]           │
│                                         │
│     Or [Upload Audio File]              │
│                                         │
├─────────────────────────────────────────┤
│  Language: English (fixed)              │
│  Duration: 0:00 / 2:00                  │
└─────────────────────────────────────────┘
```

### Transcription Engine

**Implementation:** Self-hosted Whisper

**Process:**
```
Audio file
    ↓
Self-hosted Whisper API
    ↓
Transcribed text
    ↓
AI formats into document
    ↓
Render preview
```

### Post-Processing

- AI takes transcribed text
- Removes filler words
- Structures into proper document
- Applies formatting based on context

---

## M10: Image Integration

### Image Upload

**Formats:** PNG, JPG, JPEG, WEBP, GIF

**Limits:**
| User Type | Max Images | Cost |
|-----------|-----------|------|
| Free (< 10 credits) | 0 | N/A |
| Free (≥ 10 credits) | 5 | 1 credit per image |
| Pro | 5 | 1 credit per image |

**Upload:**
- File picker or drag-and-drop
- Max file size: 10MB per image
- Auto-compress if over 5MB

**When to Add:**
- During generation: User adds images in input box with text description
- After generation: In edit mode via Replace option

### Image Placement

**Method:** Describe placement in input text

**Flow:**
```
User types in input:
"Paste image of logo at the top right corner"
    ↓
User clicks "[Add Image 📷]" button
    ↓
File picker opens, user selects image
    ↓
Image uploaded with placement description
    ↓
AI interprets placement from description
    ↓
Image placed in generated document at described location
```

**Description Examples:**
- "add company logo at top left"
- "place chart after paragraph 3"
- "insert photo between section 2 and 3"
- "put signature at bottom right"

### Image Options

**On Click (in edit mode or preview edit):**
- **Remove:** Delete image from document (refunds credit)
- **Replace:** Open file picker to choose new image (costs 1 credit)

---

## M11: File Conversion System (55 Issues)

### Conversion Philosophy

**Key Rule:** Conversions are COMPLETELY FREE for all users (no credits needed)

### SEO Architecture (Enterprise-Grade)

M11 targets **200 unique SSG conversion pages**, each independently indexable by Google. Every page has:
- Unique 300+ word content (no boilerplate, zero thin-content penalty risk)
- Schema.org `SoftwareApplication` + `WebApplication` + `BreadcrumbList` JSON-LD
- Canonical URL enforcement with 301 redirects for trailing slash and case variants
- XML sitemap with `<lastmod>`, `<priority>`, and `<changefreq>` for all 200 URLs
- 7 category hub pages with internal linking + 5-8 contextual related links per page
- Core Web Vitals compliant (>90 Lighthouse Performance)
- Open Graph + Twitter Card social metadata

### Supported Conversion Matrix (200 Pairs)

| Category | Source Formats | Pairs |
|----------|---------------|-------|
| Word Processing | DOC, DOCX, ODT, RTF, TXT ↔ each other + PDF | 25 |
| Presentations | PPT, PPTX, ODP ↔ each other + PDF | 9 |
| Spreadsheets | XLS, XLSX, ODS, CSV ↔ each other + PDF | 16 |
| eBooks | EPUB, MOBI, AZW → PDF | 3 |
| Markup | HTML, MD → PDF, DOCX | 4 |
| Word → Presentation | 5 sources × 3 targets | 15 |
| Word → Spreadsheet | Selected cross-category pairs | 10 |
| Document → Markup | Selected cross-category pairs | 10 |
| Images | JPG, PNG, WEBP, TIFF ← PDF + selected targets | 15 |
| Image → Document | Images to Word, Spreadsheet, Presentation | 18 |
| PDF → Everything | PDF to all 24 other supported formats | 24 |
| Cross-Category Bidirectional | Additional reverse and edge-case pairs | 16 |
| **TOTAL** | | **200** |

All 200 pairs defined in `src/config/convert-pairs.ts` with unique slugs, priorities, and content templates.

### AI-Enhanced Conversion

**All conversions use AI for best quality** (user confirmed)

**Implementation:**
- AI analyzes source document structure
- Regenerates in target format with best formatting
- Preserves: headings, tables, images, layout
- Fallback to library-only if AI fails (Issue 033)

### Export Engines

**PDF Generation (AI + Library Hybrid):**
- AI outputs structured content
- Puppeteer renders HTML/CSS to PDF
- Quality: High (print-ready available)

**DOCX Export (AI + docx.js):**
- AI outputs structured JSON
- docx.js library generates DOCX file

**PPTX Export (AI + PptxGenJS):**
- AI outputs slide structure
- PptxGenJS generates presentation

**XLSX Export (AI + SheetJS):**
- AI outputs data structure
- SheetJS generates spreadsheet

### SEO Conversion Pages Architecture

**URL Pattern:** `/convert/[slug]` (e.g., `/convert/pdf-to-word`, `/convert/docx-to-pdf`)

**Key Features:**
- **SSG:** All 200 pages pre-generated at build time via `generateStaticParams`
- **Unique per page:** H1, title tag, meta description (150+ chars), 300+ words content
- **Structured Data:** `SoftwareApplication` + `BreadcrumbList` JSON-LD with `@type: "Offer", price: "0"`
- **Canonical:** `<link rel="canonical">` + 301 redirects for `/slug/` and case variants
- **Sitemap:** `app/sitemap.ts` with all 200 URLs, priorities, change frequencies
- **robots.txt:** All `/convert/*` paths allowed, sitemap referenced
- **Internal Links:** 7 category hubs + 5-8 related conversion links per page
- **Breadcrumbs:** Visual + LD+JSON on every page (Home > Convert > [Category] > [Title])
- **Social:** Open Graph + Twitter Card metadata on all pages
- **PageSpeed:** LCP ≤2.5s, FID ≤100ms, CLS ≤0.1, no external fonts, deferred scripts
- **Validation:** Pre-build script checks unique slugs, titles, descriptions across all 200 pairs
- **Monitoring:** GSC indexing + click tracking, broken link detection, weekly reports

---

## M12: Pro User Dashboard

### Dashboard Features

**For Free Users:**
- Credit balance display
- History (actions/activities, can disable logging)
- Upgrade prompt

**For Pro Users (enhanced):**
- All Free features PLUS:
- Saved documents in MongoDB
- Version history
- Folder organization
- Credit balance + usage analytics
- Templates (favorited, recent)

### Document Management

**Features:**
- View all saved documents
- Open, edit, regenerate
- Download in any format
- Delete documents
- Organize into folders

### Auto-Save

**Behavior:**
- Auto-save on every AI edit
- Location:
  - Free users: localStorage, 24h retention
  - Pro users: MongoDB, permanent

**localStorage for Free:**
- Data auto-deletes after 24h if credits < 10
- If credits ≥ 10, data persists in localStorage
- User can manually delete in settings

### Analytics (Pro)

**Displayed:**
- Documents generated (this month)
- Credits used (this month)
- Most used formats
- Activity timeline

---

## M13: Data Storage & Persistence

### Storage Strategy

**Anonymous Users (Free):**
```typescript
// localStorage
{
  anonymousId: string,
  credits: number,
  documents: {
    id: string,
    title: string,
    preview: string,
    createdAt: timestamp,
    autoDeleteAt: timestamp // 24h from creation
  }[],
  settings: {
    tone: string,
    language: string
  }
}
```

**Pro Users (MongoDB):**
```typescript
// Collections
users
documents
versions (document snapshots)
folders
analytics_events
```

### MongoDB Schema

```javascript
// Users Collection
{
  _id: ObjectId,
  email: String,
  passwordHash: String,
  googleId: String,
  name: String,
  avatarUrl: String,
  role: 'free' | 'pro',
  credits: Number,
  subscription: {
    stripeCustomerId: String,
    plan: 'monthly' | 'yearly',
    currentPeriodEnd: Date
  },
  createdAt: Date,
  updatedAt: Date
}

// Documents Collection
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  format: String,
  content: Object, // Structured document
  wordCount: Number,
  createdAt: Date,
  updatedAt: Date,
  folderId: ObjectId?
}

// Versions Collection
{
  _id: ObjectId,
  documentId: ObjectId,
  content: Object,
  createdAt: Date,
  trigger: 'generation' | 'edit' | 'manual'
}
```

---

## M14: Admin Panel

### Admin Creation (Token-Based)

**Single Admin Rule:** Only 1 admin exists at a time. Creating new admin removes old admin.

**Server Command:**
```bash
npm run admin:create
```
- Generates one-time token
- Creates invite link
- Token saved to database with expiry

**Admin Invite Flow:**
```
1. Server command executed
   └── Generates token, saves to DB, outputs link

2. Admin visits: https://app.com/admin/create?token=xxx
   └── Validates token, checks expiry, checks if used

3. Admin enters username + complex password
   └── Creates admin account, sets role='admin'

4. Old admin removed (if exists)
   └── Previous admin set to 'user' role

5. Token marked as used
   └── Cannot be reused
```

**Token Properties:**
- Token: random string (32 chars)
- createdAt: timestamp
- ExpiresAt: timestamp (24h default)
- UsedAt: null (until used)
- UsedBy: null (until used)

**Admin Login:**
- Username + Password only (no email)
- Password must be complex (min 12 chars, uppercase, lowercase, number, special char)

**Security:**
- Token single-use
- Token expires (24h)
- Old admin removed on new creation
- Role check on all admin routes

---

### Admin Features

**API Key Management:**
- Add single API key
- View current key (masked)
- Remove key
- Usage statistics display

**Pricing Configuration:**
- Credit cost per action (generation, edit, translate, summarize)
- Format-specific credit costs
- Credit bundle prices
- Pro subscription price

**System Settings (Dynamic):**

Free Credits:
- Anonymous: [configurable] credits (one-time) - default: 5
- Registered Free: [configurable] credits (one-time) - default: 10

Credit Costs (ALL configurable):
- Document Generation: 1 credit / [configurable] words - default: 100
- AI Editing: 1 credit / [configurable] edits - default: 10
- Translation: 1 credit / [configurable] words - default: 50
- Extract Text (OCR): 1 credit / [configurable] words - default: 50
- Change Style: 1 credit / [configurable] words - default: 100
- Image Add: 1 credit / [configurable] image - default: 1
- ALL can be changed to FREE

Pro Subscription:
- Monthly: $[configurable] - default: $9
- Yearly: $[configurable] - default: $86
- Credits/month: [configurable] - default: 200
- Yearly can auto-calculate or set manually
- Bonus credits: [configurable] - default: 0
- Bonus page: /bonuses (advertise current bonuses)

Credit Packs:
- Default: 100 credits ($10), 500 credits ($40)
- Admin can add CUSTOM packs
- Admin can set custom prices/sizes

Maintenance Mode:
- Toggle ON/OFF from admin
- Public sees maintenance template (admin can still access)
- Auto-clear after [configurable] days or manual

Registration Open:
- Toggle ON/OFF from admin
- Closed shows signup-closed template

Email System (Enterprise):
- Brevo integration for delivery + analytics

Campaigns:
- Single Send (one-time to segment)
- Scheduled (send at specific date/time)
- Automated (trigger-based workflows)
- Recurring (weekly digest, monthly newsletter)
- A/B Testing (send to test emails before full campaign)

Audience Segments:
- All registered users
- Free users only
- Pro users only
- Users inactive for [configurable] days
- Users who never purchased
- Users by country
- Custom segments

Automation Workflows:
- Welcome series (new user)
- Win-back (inactive users)
- Upsell (free → Pro)
- Feature announcement
- Credit expiry warning
- Custom workflows (admin-created)

Templates:
- Upload HTML templates
- Preview before use
- Personalization tags support
- Save reusable templates

Analytics (Brevo):
- Open rate, Click rate, Unsubscribe rate, Bounce rate
- Per-campaign history

Email Trigger System:
- Action → Trigger → Template/Send
- Example: User signup → Welcome email template → Automation sends

Email Tool (Admin only - 12th tool):
- Mailcraft page: https://app.com/mailcraft
- Only visible to admin role
- Features:
  - AI-powered email template creation
  - Fill templates with content
  - Preview emails (desktop, mobile)
  - Make suggestions/improvements
  - Create custom templates
  - Edit existing templates
  - Personalization tag insertion
  - HTML editor with AI assistant
- Route: GET /mailcraft

The 12 Tools:

| # | Tool | Description | Who Sees |
|---|------|-------------|---------|
| 1 | Generate from Text | Paste text → document | User |
| 2 | Generate from Command | AI creates from request | User |
| 3 | Edit | Modify document content | User |
| 4 | Convert | File format conversion | User |
| 5 | Translate | Translate to any language | User |
| 6 | Voice | Voice-to-document | User |
| 7 | Extract (OCR) | Text from PDF/image | User |
| 8 | Merge | Combine PDFs | User |
| 9 | Split | Separate PDF pages | User |
| 10 | Compress | Reduce PDF size | User |
| 11 | Change Style | AI restyle document | User |
| 12 | Mailcraft | AI email assistance | Admin ONLY |

### Admin UI

```typescript
// Routes
/admin              # Dashboard
/admin/api-keys     # API key management
/admin/pricing     # Credit pricing
/admin/settings   # System settings (all dynamic settings)
/admin/email      # Email campaigns + templates
/admin/analytics # Usage analytics + email analytics
/admin/maintenance # Maintenance mode toggle
/admin/bonuses   # Bonus advertising page
```

---

## M15: Payments & Subscriptions (34 Issues)

### Payment Processors

**Supported (Global + Local Coverage):**
- **Flutterwave** - African/local card payments, mobile money, bank transfers, international cards
- **Paystack** - Nigerian/local card payments, bank transfers, USSD, international cards
- **Stripe** - International card payments (US/Europe/global)
- **PayPal** - PayPal wallet payments (international)

**Region-Based Selection:**
- African users see Flutterwave/Paystack as primary options
- Nigerian users see Paystack as default (bank transfer, USSD, card)
- International users see Stripe/PayPal as primary options
- All processors accept international cards as fallback
- Admin configures active processors per region in M14 settings

**Admin Config:** In M14 settings, set which processors are active and default per region

### Pricing Models

| Plan | Price | Credits |
|------|-------|---------|
| Free | $0 | 10 (one-time) |
| Pro Monthly | $9/mo | 200/month |
| Pro Yearly | $86/yr | 2400/year (20% off) |
| Credit Pack | $10 | 100 credits |

### Checkout Flow

```
User clicks "Subscribe" or "Buy Credits"
    ↓
Select plan/pack
    ↓
Region auto-detected → appropriate payment methods shown
    ↓
Select payment: Flutterwave / Paystack / Stripe / PayPal
    ↓
Selected processor checkout
    ↓
Webhook received → verify signature → process event
    ↓
On success: Update user credits in DB
    ↓
Show confirmation + new balance
```

---

## M16: SEO & Public Pages (37 Issues)

### Landing Page

**Purpose:** Main entry point for users

**Elements:**
- Hero with value proposition
- Format template gallery (video previews)
- Main input box (bottom)
- Call-to-action: Create Account

### Format Pages (/format/[id])

**Purpose:** SEO landing pages for each format

**Content:**
- Format preview (video/GIF)
- Description
- Credit cost
- "Use This Format" button
- Input box to generate

### Conversion Tool (/convert)

**Purpose:** Free conversion tool for SEO traffic

**Features:**
- Drag-and-drop file upload
- Select target format
- Convert button
- Download result

### Blog System (Admin-Managed)

**Purpose:** Full blog platform with admin CRUD

**Database:** MongoDB `blog_posts` collection (slug, title, content, excerpt, seoTitle, seoDescription, status, publishedAt, scheduledAt)

**Admin Flow:**
1. `/admin/blog` — management table: list all posts, publish/unpublish toggle, delete
2. `/admin/blog/new` — create post: upload .md/.html/.ejs, paste content, or agent-generate → set slug/title/excerpt/SEO → preview → draft/publish/schedule

**Frontend:**
- `/blog` — lists published posts from DB
- `/blog/[slug]` — renders post content with SEO metadata per post

**Public Pages:**
- `/features` — all features listed with descriptions
- `/how-it-works` — 4-step guide
- `/about` — company info
- `/contact` — contact form
- `/privacy` — privacy policy
- `/terms` — terms of service
- All pages have unique SEO metadata, canonical URLs, OG+Twitter cards

### Translate Page (/translate)

**Purpose:** Translate documents to any supported language

**Layout:**
```
┌─────────────────────────────────────────┐
│  Home > Translate                        │  ← Breadcrumb
├─────────────────────────────────────────┤
│  Logo    [💰]    [Account ▼]           │  ← Fixed Top Bar
├─────────────────────────────────────────┤
│                                         │
│  Translate from:  Translate to:          │
│  [Spanish ▼]  →  [French ▼]            │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  📁 Upload File                  │   │
│  │  (PDF, DOCX, TXT)              │   │
│  └─────────────────────────────────┘   │
│                                         │
│        OR                               │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Paste text here...              │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  [Translate]                            │
│                                         │
├─────────────────────────────────────────┤
│  Credit Estimate: ~X credits            │
└─────────────────────────────────────────┘
```

**Flow:**
```
1. User selects source language (required)
2. User selects target language (required)
3. User uploads file OR pastes text
4. Clicks Translate
5. Credit deducted
6. AI translates
7. Shows translated preview
8. User downloads
```

**Languages:**
- Dropdown shows all popular supported languages
- If user selects unsupported language → "Sorry, language not supported" error
- Languages: English, Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Korean, Arabic, Russian, Hindi, Dutch, Polish, Turkish, Vietnamese, Thai, Indonesian (and more)

**Credit Cost:** 1 credit per 50 words

**Supported Input Formats:** PDF, DOCX, TXT (file upload)

---

### Conversion Page

**Purpose:** Main conversion tool - user selects any file to convert to any compatible format

**Layout:**
```
┌─────────────────────────────────────────┐
│  Home > Convert                         │  ← Breadcrumb
├─────────────────────────────────────────┤
│  Logo    [💰]    [Account ▼]           │  ← Fixed Top Bar
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │     Drop file here              │   │
│  │     or click to upload          │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  Convert to:                             │
│  [Select Format ▼]                      │
│                                         │
│  [Convert]                               │
│                                         │
└─────────────────────────────────────────┘
```

**Behavior:**
- User uploads any file
- Selects target format from dropdown
- Clicks Convert
- File converts
- User downloads

**Note:** This is the MAIN conversion page

---

### SEO Conversion Pages (/convert/[from]-[to])

**Purpose:** Dedicated pages for SEO - one page per conversion type

**Examples:**
- /convert/pdf-to-docx
- /convert/docx-to-pdf
- /convert/jpg-to-png
- etc.

**Behavior:**
- Pre-selected: from=X, to=Y
- User just uploads and clicks convert
- Streamlined for specific conversion

**Total:** 200 SEO pages (see M16)

### Voice Page (/voice)

**Purpose:** Dedicated voice-to-document tool

---

### Extract Text Page

**Purpose:** Extract text from PDF or image

**Layout:**
```
┌─────────────────────────────────────────┐
│  Home > OCR                             │  ← Breadcrumb
├─────────────────────────────────────────┤
│  Logo    [💰]    [Account ▼]           │  ← Fixed Top Bar
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  📁 Upload PDF or Image          │   │
│  │  (PDF, JPG, PNG, WEBP)          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Extract Text]                        │
│                                         │
├─────────────────────────────────────────┤
│  Credit Estimate: ~X credits            │
└─────────────────────────────────────────┘
```

**Flow:**
```
1. User uploads PDF or image
2. Clicks Extract Text
3. Credit deducted
4. AI extracts text using OCR
5. Shows extracted text preview
6. User copies or downloads
```

**Credit Cost:** 1 credit per 50 words extracted

**Note:** Uses AI/OCR - required for image to text

---

### Merge PDF Page

**Purpose:** Combine multiple PDFs into one

**Layout:**
```
┌─────────────────────────────────────────┐
│  Home > Merge PDF                       │  ← Breadcrumb
├─────────────────────────────────────────┤
│  Logo    [💰]    [Account ▼]           │  ← Fixed Top Bar
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Drop multiple files here         │   │
│  │  [+ Add More Files]             │   │
│  │                                 │   │
│  │  📄 file1.pdf                   │   │
│  │  📄 file2.pdf                   │   │
│  │  📄 file3.pdf                   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Reorder by drag & drop]              │
│                                         │
│  [Merge PDFs]                          │
│                                         │
└─────────────────────────────────────────┘
```

**Credit Cost:** FREE (no credits needed)

**Note:** Uses library - 100% quality

---

### Split PDF Page

**Purpose:** Split PDF into separate pages

**Layout:**
```
┌─────────────────────────────────────────┐
│  Home > Split PDF                       │  ← Breadcrumb
├─────────────────────────────────────────┤
│  Logo    [💰]    [Account ▼]           │  ← Fixed Top Bar
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Upload PDF file                  │   │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  Split options:                         │
│  ○ Extract all pages as separate files  │
│  ○ Extract page range: [___] to [___]  │
│                                         │
│  [Split PDF]                           │
│                                         │
└─────────────────────────────────────────┘
```

**Credit Cost:** FREE (no credits needed)

**Note:** Uses library - 100% quality

---

### Compress PDF Page

**Purpose:** Reduce PDF file size

**Layout:**
```
┌─────────────────────────────────────────┐
│  Home > Compress PDF                   │  ← Breadcrumb
├─────────────────────────────────────────┤
│  Logo    [💰]    [Account ▼]           │  ← Fixed Top Bar
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Upload PDF file                  │   │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  Compression level:                     │
│  ○ Low (best quality)                  │
│  ○ Medium (balanced)                    │
│  ○ High (smallest size)                 │
│                                         │
│  [Compress PDF]                         │
│                                         │
└─────────────────────────────────────────┘
```

**Credit Cost:** FREE (no credits needed)

**Note:** Uses library - 100% quality

---

### Change Style Page

**Purpose:** Full page version of Explore Styles modal - change document design/style

**Layout:**
```
┌─────────────────────────────────────────┐
│  Home > Change Style                    │  ← Breadcrumb
├─────────────────────────────────────────┤
│  Logo    [💰]    [Account ▼]           │  ← Fixed Top Bar
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Upload document                  │   │
│  │  (PDF, DOCX)                    │   │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  Current Style: [Style Name]            │
│                                         │
│  Select new style:                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ [img]   │ │ [img]   │ │ [img]   │  │
│  │ Classic │ │ Modern  │ │ Minimal │  │
│  └─────────┘ └─────────┘ └─────────┘  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ [img]   │ │ [img]   │ │ [img]   │  │
│  │ Creative│ │Formal   │ │Casual   │  │
│  └─────────┘ └─────────┘ └─────────┘  │
│                                         │
│  [Apply Style]                          │
│                                         │
├─────────────────────────────────────────┤
│  Credit Estimate: ~X credits            │
└─────────────────────────────────────────┘
```

**Flow:**
```
1. User uploads document
2. Selects new style
3. Clicks Apply Style
4. AI analyzes document and applies new style
5. User downloads styled document
```

**Credit Cost:** 1 credit per 100 words

**Note:** This is the FULL PAGE version of Explore Styles modal

---

## M17: SEO Tool Pages

### Extract Text SEO Pages

| Page | Purpose |
|------|---------|
| /extract-text-from-pdf | Main extract text page |
| /pdf-to-text | Extract text from PDF |
| /image-to-text | Extract text from image |
| /jpg-to-text | Extract text from JPG |
| /png-to-text | Extract text from PNG |
| /scanned-pdf-to-text | Extract text from scanned PDF |

### PDF Tools SEO Pages

| Page | Purpose |
|------|---------|
| /merge-pdf | Merge multiple PDFs |
| /combine-pdf | Combine PDF files |
| /split-pdf | Split PDF into pages |
| /extract-pdf-pages | Extract specific pages |
| /compress-pdf | Compress PDF file size |
| /reduce-pdf-size | Reduce PDF size |

### Style SEO Pages

| Page | Purpose |
|------|---------|
| /change-style | Main style change page |
| /change-pdf-style | Change PDF design |
| /change-doc-style | Change document design |

---

### Core Priority Formats (10 formats = 100 paths)

All SEO pages follow URL structure: `/convert/[from]-[to]`

#### PDF (10 paths)
| URL | From | To |
|-----|------|-----|
| /convert/pdf-to-docx | PDF | DOCX |
| /convert/pdf-to-doc | PDF | DOC |
| /convert/pdf-to-jpg | PDF | JPG |
| /convert/pdf-to-png | PDF | PNG |
| /convert/pdf-to-xlsx | PDF | XLSX |
| /convert/pdf-to-csv | PDF | CSV |
| /convert/pdf-to-pptx | PDF | PPTX |
| /convert/pdf-to-txt | PDF | TXT |
| /convert/pdf-to-html | PDF | HTML |
| /convert/pdf-to-odt | PDF | ODT |

#### DOCX (10 paths)
| URL | From | To |
|-----|------|-----|
| /convert/docx-to-pdf | DOCX | PDF |
| /convert/docx-to-doc | DOCX | DOC |
| /convert/docx-to-jpg | DOCX | JPG |
| /convert/docx-to-png | DOCX | PNG |
| /convert/docx-to-xlsx | DOCX | XLSX |
| /convert/docx-to-csv | DOCX | CSV |
| /convert/docx-to-pptx | DOCX | PPTX |
| /convert/docx-to-txt | DOCX | TXT |
| /convert/docx-to-html | DOCX | HTML |
| /convert/docx-to-odt | DOCX | ODT |

#### DOC (10 paths)
| URL | From | To |
|-----|------|-----|
| /convert/doc-to-pdf | DOC | PDF |
| /convert/doc-to-docx | DOC | DOCX |
| /convert/doc-to-jpg | DOC | JPG |
| /convert/doc-to-png | DOC | PNG |
| /convert/doc-to-xlsx | DOC | XLSX |
| /convert/doc-to-csv | DOC | CSV |
| /convert/doc-to-pptx | DOC | PPTX |
| /convert/doc-to-txt | DOC | TXT |
| /convert/doc-to-html | DOC | HTML |
| /convert/doc-to-odt | DOC | ODT |

#### JPG (10 paths)
| URL | From | To |
|-----|------|-----|
| /convert/jpg-to-pdf | JPG | PDF |
| /convert/jpg-to-docx | JPG | DOCX |
| /convert/jpg-to-doc | JPG | DOC |
| /convert/jpg-to-png | JPG | PNG |
| /convert/jpg-to-xlsx | JPG | XLSX |
| /convert/jpg-to-csv | JPG | CSV |
| /convert/jpg-to-pptx | JPG | PPTX |
| /convert/jpg-to-txt | JPG | TXT |
| /convert/jpg-to-html | JPG | HTML |
| /convert/jpg-to-odt | JPG | ODT |

#### PNG (10 paths)
| URL | From | To |
|-----|------|-----|
| /convert/png-to-pdf | PNG | PDF |
| /convert/png-to-docx | PNG | DOCX |
| /convert/png-to-doc | PNG | DOC |
| /convert/png-to-jpg | PNG | JPG |
| /convert/png-to-xlsx | PNG | XLSX |
| /convert/png-to-csv | PNG | CSV |
| /convert/png-to-pptx | PNG | PPTX |
| /convert/png-to-txt | PNG | TXT |
| /convert/png-to-html | PNG | HTML |
| /convert/png-to-odt | PNG | ODT |

#### XLSX (10 paths)
| URL | From | To |
|-----|------|-----|
| /convert/xlsx-to-pdf | XLSX | PDF |
| /convert/xlsx-to-docx | XLSX | DOCX |
| /convert/xlsx-to-doc | XLSX | DOC |
| /convert/xlsx-to-jpg | XLSX | JPG |
| /convert/xlsx-to-png | XLSX | PNG |
| /convert/xlsx-to-csv | XLSX | CSV |
| /convert/xlsx-to-pptx | XLSX | PPTX |
| /convert/xlsx-to-txt | XLSX | TXT |
| /convert/xlsx-to-html | XLSX | HTML |
| /convert/xlsx-to-odt | XLSX | ODT |

#### CSV (10 paths)
| URL | From | To |
|-----|------|-----|
| /convert/csv-to-pdf | CSV | PDF |
| /convert/csv-to-docx | CSV | DOCX |
| /convert/csv-to-doc | CSV | DOC |
| /convert/csv-to-jpg | CSV | JPG |
| /convert/csv-to-png | CSV | PNG |
| /convert/csv-to-xlsx | CSV | XLSX |
| /convert/csv-to-pptx | CSV | PPTX |
| /convert/csv-to-txt | CSV | TXT |
| /convert/csv-to-html | CSV | HTML |
| /convert/csv-to-odt | CSV | ODT |

#### PPTX (10 paths)
| URL | From | To |
|-----|------|-----|
| /convert/pptx-to-pdf | PPTX | PDF |
| /convert/pptx-to-docx | PPTX | DOCX |
| /convert/pptx-to-doc | PPTX | DOC |
| /convert/pptx-to-jpg | PPTX | JPG |
| /convert/pptx-to-png | PPTX | PNG |
| /convert/pptx-to-xlsx | PPTX | XLSX |
| /convert/pptx-to-csv | PPTX | CSV |
| /convert/pptx-to-txt | PPTX | TXT |
| /convert/pptx-to-html | PPTX | HTML |
| /convert/pptx-to-odt | PPTX | ODT |

#### TXT (10 paths)
| URL | From | To |
|-----|------|-----|
| /convert/txt-to-pdf | TXT | PDF |
| /convert/txt-to-docx | TXT | DOCX |
| /convert/txt-to-doc | TXT | DOC |
| /convert/txt-to-jpg | TXT | JPG |
| /convert/txt-to-png | TXT | PNG |
| /convert/txt-to-xlsx | TXT | XLSX |
| /convert/txt-to-csv | TXT | CSV |
| /convert/txt-to-pptx | TXT | PPTX |
| /convert/txt-to-html | TXT | HTML |
| /convert/txt-to-odt | TXT | ODT |

#### HTML (10 paths)
| URL | From | To |
|-----|------|-----|
| /convert/html-to-pdf | HTML | PDF |
| /convert/html-to-docx | HTML | DOCX |
| /convert/html-to-doc | HTML | DOC |
| /convert/html-to-jpg | HTML | JPG |
| /convert/html-to-png | HTML | PNG |
| /convert/html-to-xlsx | HTML | XLSX |
| /convert/html-to-csv | HTML | CSV |
| /convert/html-to-pptx | HTML | PPTX |
| /convert/html-to-txt | HTML | TXT |
| /convert/html-to-odt | HTML | ODT |

---

### Medium Priority Formats (10 formats = 100 paths)

#### ODT (10 paths)
| URL | From | To |
|-----|------|-----|
| /convert/odt-to-pdf | ODT | PDF |
| /convert/odt-to-docx | ODT | DOCX |
| /convert/odt-to-doc | ODT | DOC |
| /convert/odt-to-jpg | ODT | JPG |
| /convert/odt-to-png | ODT | PNG |
| /convert/odt-to-xlsx | ODT | XLSX |
| /convert/odt-to-csv | ODT | CSV |
| /convert/odt-to-pptx | ODT | PPTX |
| /convert/odt-to-txt | ODT | TXT |
| /convert/odt-to-html | ODT | HTML |

#### RTF (10 paths)
| URL | From | To |
|-----|------|-----|
| /convert/rtf-to-pdf | RTF | PDF |
| /convert/rtf-to-docx | RTF | DOCX |
| /convert/rtf-to-doc | RTF | DOC |
| /convert/rtf-to-jpg | RTF | JPG |
| /convert/rtf-to-png | RTF | PNG |
| /convert/rtf-to-xlsx | RTF | XLSX |
| /convert/rtf-to-csv | RTF | CSV |
| /convert/rtf-to-pptx | RTF | PPTX |
| /convert/rtf-to-txt | RTF | TXT |
| /convert/rtf-to-html | RTF | HTML |

#### EPUB (10 paths)
| URL | From | To |
|-----|------|-----|
| /convert/epub-to-pdf | EPUB | PDF |
| /convert/epub-to-docx | EPUB | DOCX |
| /convert/epub-to-doc | EPUB | DOC |
| /convert/epub-to-jpg | EPUB | JPG |
| /convert/epub-to-png | EPUB | PNG |
| /convert/epub-to-xlsx | EPUB | XLSX |
| /convert/epub-to-csv | EPUB | CSV |
| /convert/epub-to-pptx | EPUB | PPTX |
| /convert/epub-to-txt | EPUB | TXT |
| /convert/epub-to-html | EPUB | HTML |

#### MOBI (10 paths)
| URL | From | To |
|-----|------|-----|
| /convert/mobi-to-pdf | MOBI | PDF |
| /convert/mobi-to-docx | MOBI | DOCX |
| /convert/mobi-to-doc | MOBI | DOC |
| /convert/mobi-to-jpg | MOBI | JPG |
| /convert/mobi-to-png | MOBI | PNG |
| /convert/mobi-to-xlsx | MOBI | XLSX |
| /convert/mobi-to-csv | MOBI | CSV |
| /convert/mobi-to-pptx | MOBI | PPTX |
| /convert/mobi-to-txt | MOBI | TXT |
| /convert/mobi-to-html | MOBI | HTML |

#### ODS (10 paths)
| URL | From | To |
|-----|------|-----|
| /convert/ods-to-pdf | ODS | PDF |
| /convert/ods-to-docx | ODS | DOCX |
| /convert/ods-to-doc | ODS | DOC |
| /convert/ods-to-jpg | ODS | JPG |
| /convert/ods-to-png | ODS | PNG |
| /convert/ods-to-xlsx | ODS | XLSX |
| /convert/ods-to-csv | ODS | CSV |
| /convert/ods-to-pptx | ODS | PPTX |
| /convert/ods-to-txt | ODS | TXT |
| /convert/ods-to-html | ODS | HTML |

#### XML (10 paths)
| URL | From | To |
|-----|------|-----|
| /convert/xml-to-pdf | XML | PDF |
| /convert/xml-to-docx | XML | DOCX |
| /convert/xml-to-doc | XML | DOC |
| /convert/xml-to-jpg | XML | JPG |
| /convert/xml-to-png | XML | PNG |
| /convert/xml-to-xlsx | XML | XLSX |
| /convert/xml-to-csv | XML | CSV |
| /convert/xml-to-pptx | XML | PPTX |
| /convert/xml-to-txt | XML | TXT |
| /convert/xml-to-html | XML | HTML |

#### JSON (10 paths)
| URL | From | To |
|-----|------|-----|
| /convert/json-to-pdf | JSON | PDF |
| /convert/json-to-docx | JSON | DOCX |
| /convert/json-to-doc | JSON | DOC |
| /convert/json-to-jpg | JSON | JPG |
| /convert/json-to-png | JSON | PNG |
| /convert/json-to-xlsx | JSON | XLSX |
| /convert/json-to-csv | JSON | CSV |
| /convert/json-to-pptx | JSON | PPTX |
| /convert/json-to-txt | JSON | TXT |
| /convert/json-to-html | JSON | HTML |

#### WEBP (10 paths)
| URL | From | To |
|-----|------|-----|
| /convert/webp-to-pdf | WEBP | PDF |
| /convert/webp-to-docx | WEBP | DOCX |
| /convert/webp-to-doc | WEBP | DOC |
| /convert/webp-to-jpg | WEBP | JPG |
| /convert/webp-to-png | WEBP | PNG |
| /convert/webp-to-xlsx | WEBP | XLSX |
| /convert/webp-to-csv | WEBP | CSV |
| /convert/webp-to-pptx | WEBP | PPTX |
| /convert/webp-to-txt | WEBP | TXT |
| /convert/webp-to-html | WEBP | HTML |

#### TIFF (10 paths)
| URL | From | To |
|-----|------|-----|
| /convert/tiff-to-pdf | TIFF | PDF |
| /convert/tiff-to-docx | TIFF | DOCX |
| /convert/tiff-to-doc | TIFF | DOC |
| /convert/tiff-to-jpg | TIFF | JPG |
| /convert/tiff-to-png | TIFF | PNG |
| /convert/tiff-to-xlsx | TIFF | XLSX |
| /convert/tiff-to-csv | TIFF | CSV |
| /convert/tiff-to-pptx | TIFF | PPTX |
| /convert/tiff-to-txt | TIFF | TXT |
| /convert/tiff-to-html | TIFF | HTML |

#### Markdown (10 paths)
| URL | From | To |
|-----|------|-----|
| /convert/md-to-pdf | MD | PDF |
| /convert/md-to-docx | MD | DOCX |
| /convert/md-to-doc | MD | DOC |
| /convert/md-to-jpg | MD | JPG |
| /convert/md-to-png | MD | PNG |
| /convert/md-to-xlsx | MD | XLSX |
| /convert/md-to-csv | MD | CSV |
| /convert/md-to-pptx | MD | PPTX |
| /convert/md-to-txt | MD | TXT |
| /convert/md-to-html | MD | HTML |

---

### Total SEO Paths Summary

| Category | Formats | Total Paths |
|----------|---------|-------------|
| Core Priority | 10 | 100 paths |
| Medium Priority | 10 | 100 paths |
| **Total** | **20** | **200 paths** |

### Page Implementation Structure

Each conversion page (`/convert/[from]-[to]`) should have:

```tsx
// Structure for each SEO page
interface ConversionPageProps {
  fromFormat: string;  // e.g., 'pdf'
  toFormat: string;    // e.g., 'docx'
}

// Components per page:
- Hero: "[From] to [To] Converter - Free Online"
- Tool: Drag-drop upload zone
- Quality Toggle: "Free (Standard)" / "AI-Enhanced (Credits)"
- Features: "Free, fast, no registration"
- How it works: 3-step process with icons
- Related tools: Links to 5-10 related conversions
- FAQ: SEO-friendly content for the specific conversion
- Schema.org: Structured data for rich snippets
```

### Build Priority

| Phase | Paths | Description |
|-------|-------|-------------|
| Phase 1 | Core (100) | PDF, DOCX, DOC, JPG, PNG, XLSX, CSV, PPTX, TXT, HTML |
| Phase 2 | Medium (100) | ODT, RTF, EPUB, MOBI, ODS, XML, JSON, WEBP, TIFF, MD |

---

## M18: Edge Cases & Error Handling

### Credit Edge Cases

| Scenario | Handling |
|----------|----------|
| Credits reach 0 mid-generation | Complete current generation, block next |
| Credits reach 100% | Allow 1 more, then block, show upgrade modal |
| Pro subscription expires | Downgrade to free, keep data 30 days |
| Refund requested | Restore credits, cancel subscription |

### Generation Edge Cases

| Scenario | Handling |
|----------|----------|
| AI timeout (>60s) | Cancel, show retry button, refund credits |
| Partial response | Save what's generated, allow regeneration |
| Invalid input | Show inline error, don't deduct credits |
| Empty input | Disable generate button |

### File Conversion Edge Cases

| Scenario | Handling |
|----------|----------|
| File too large (>10MB) | Show error, suggest compression |
| Unsupported format | Show supported formats list |
| Conversion fails | Show error, offer retry |
| Corrupted file | "Unable to read file" error |

### Auth Edge Cases

| Scenario | Handling |
|----------|----------|
| JWT expired | Auto-refresh if possible, else redirect to login |
| Google OAuth fails | Show error, offer email alternative |
| Email already exists | "Account exists, login instead" |
| Password reset fails | "Try again or contact support" |

### Data Retention Edge Cases

| Scenario | Handling |
|----------|----------|
| localStorage full | Clear oldest documents, warn user |
| MongoDB connection fails | Show error, offer local export |
| Pro user goes to free | Migrate data to localStorage, delete MongoDB |

---

## Technical Implementation Checklist

### Phase 1: Core (M1-M4)
- [ ] Project setup + dependencies
- [ ] Authentication (email + Google)
- [ ] JWT session management
- [ ] Landing page layout
- [ ] Input box component
- [ ] WebSocket setup
- [ ] Basic document generation
- [ ] Format template pages

### Phase 2: Features (M5-M8)
- [ ] Document preview renderer
- [ ] View/Edit mode toggle
- [ ] AI editing
- [ ] Image upload + placement
- [ ] Voice recording + transcription
- [ ] Translation
- [ ] Summarization

### Phase 3: Conversion (M9)
- [ ] File upload
- [ ] PDF ↔ DOCX conversion
- [ ] PPTX conversion
- [ ] XLSX conversion
- [ ] Full format matrix

### Phase 4: Pro Features (M10-M12)
- [ ] Pro dashboard
- [ ] MongoDB integration
- [ ] Auto-save
- [ ] Version history
- [ ] Admin panel
- [ ] Analytics

### Phase 5: Payments (M13)
- [ ] Payment integration
- [ ] Credit purchase
- [ ] Subscription management
- [ ] Checkout flow

---

## APPENDIX A: Enterprise-Level Implementation Details

This appendix provides the complete enterprise-level fill-ins for all issues that were identified as missing implementation details.

---

### A.1: M1.1.004 - SSL Certificate Generation

**What's Defined:** SSL config exists in nginx.conf (lines 221-256), commented HTTPS server block

**What's Missing:** Automated certificate generation, renewal logic

**Implementation:**

```bash
# certbot-auto-renewal.sh
#!/bin/bash
# Auto-renewal certificate script
# Add to crontab: 0 0 * * * /path/to/certbot-auto-renewal.sh

# Use Let's Encrypt ACME challenge
certbot renew --non-interactive \
  --webroot -w /var/www/html \
  --deploy-hook "nginx -s reload"

# Certificate paths:
# /etc/nginx/ssl/cert.pem      # Server certificate
# /etc/nginx/ssl/key.pem       # Private key
# /etc/nginx/ssl/fullchain.pem # Full chain (cert + intermediates)
# /etc/nginx/ssl/chain.pem    # Certificate chain

# DH parameters for perfect forward secrecy:
# openssl dhparam -out /etc/nginx/ssl/dhparam.pem 4096
```

---

### A.2: M1.1.008 - Redis Authentication Config

**What's Defined:** Redis service in docker-compose.yml

**What's Missing:** Redis password authentication, session key structure

**Implementation:**

```yaml
# docker-compose.yml - redis service additions:
redis:
  image: redis:7-alpine
  command: redis-server --requirepass ${REDIS_PASSWORD} --maxmemory 512mb --maxmemory-policy allkeys-lru
  # requirepass: Redis password authentication
  # maxmemory: Memory limit
  # maxmemory-policy: Eviction policy when memory reached
```

```typescript
// Session key structure:
interface SessionKey {
  sid: string;      // session ID (UUID v4)
  uid: string;     // user ID
  exp: number;    // expiry timestamp (Unix)
  iat: number;    // issued at timestamp
  ip: string;      // IP address
  ua: string;      // user agent
}

// Format: "sess:{sid}:{uid}:{exp}"
// Example: "sess:a1b2c3d4:e5f6g7h8:1735689600"
// TTL: 7 days (604800 seconds)

// Redis session operations:
interface SessionStore {
  create(uid: string, ip: string, ua: string): Promise<SessionKey>;
  get(sid: string): Promise<SessionKey | null>;
  refresh(sid: string): Promise<SessionKey>;
  destroy(sid: string): Promise<void>;
  cleanup(): Promise<void>;  // Remove expired sessions
}
```

---

### A.3: M1.2.004 - JWT Refresh Token Rotation & Blacklisting

**What's Defined:** JWT service in src/services/jwt.ts

**What's Missing:** Token rotation logic, token blacklisting, refresh token reuse detection

**Implementation:**

```typescript
// Refresh token structure:
interface RefreshToken {
  jti: string;           // unique token ID (UUID v4)
  uid: string;          // user ID
  sub: string;          // subject (user email)
  exp: number;         // expiry timestamp
  iat: number;         // issued at timestamp
  rot: number;         // rotation count
  revoked: boolean;   // revoked flag
  replacedBy: string; // replaced by token ID
  family: string;     // token family for rotation chain
}

// Token rotation logic:
async function rotateRefreshToken(oldToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  const decoded = jwt.verify(oldToken, REFRESH_SECRET);
  
  // Check if token already revoked
  const isRevoked = await redis.get(`revoked:${decoded.jti}`);
  if (isRevoked) {
    throw new Error('Token revoked');
  }
  
  // Mark old token as replaced
  await redis.set(`revoked:${decoded.jti}`, '1', { EX: 86400 }); // Keep in blacklist for 24h
  
  // Generate new refresh token
  const newJti = uuidv4();
  const newToken = jwt.sign({
    sub: decoded.sub,
    uid: decoded.uid,
    jti: newJti,
    family: decoded.family || decoded.jti
  }, REFRESH_SECRET, { expiresIn: '7d' });
  
  // Store new token
  await storeRefreshToken(newJti, decoded.uid, decoded.sub);
  
  // Generate new access token
  const accessToken = jwt.sign({
    sub: decoded.sub,
    uid: decoded.uid,
  }, ACCESS_SECRET, { expiresIn: '15m' });
  
  return { accessToken, refreshToken: newToken };
}

// Token blacklisting (Redis):
// Key: "revoked:{jti}", Value: "1", TTL: 86400 (24 hours)
// Also store in MongoDB for persistence across restarts
interface TokenBlacklist {
  jti: string;
  revokedAt: Date;
  reason: 'rotation' | 'logout' | 'expired' | 'security';
}
```

---

### A.4: M1.2.006 - Google OAuth CSRF & Scope

**What's Defined:** Google OAuth route in app/api/auth/google/route.ts

**What's Missing:** OAuth state CSRF protection, scope details

**Implementation:**

```typescript
// OAuth state CSRF protection:
function generateOAuthState(userId: string): string {
  const state = {
    uid: userId,
    nonce: crypto.randomBytes(32).toString('hex'),
    exp: Date.now() + 600000, // 10 minute expiry
    redir: '/dashboard'       // redirect after auth
  };
  // Encrypt state for URL
  return Buffer.from(JSON.stringify(state)).toString('base64url');
}

function verifyOAuthState(state: string): { uid: string; nonce: string; redir: string } | null {
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString());
    if (decoded.exp < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

// Google OAuth scope:
const OAUTH_SCOPE = [
  'openid',           // Required: OpenID Connect
  'email',           // Required: Access email
  'profile',         // Required: Access name and photo
  // Optional scopes:
  // 'https://www.googleapis.com/auth/userinfo.email',
  // 'https://www.googleapis.com/auth/userinfo.profile',
].join(' ')

// OAuth parameters:
interface OAuthConfig {
  client_id: string;
  redirect_uri: string;
  response_type: 'code';
  scope: string;
  state: string;          // CSRF state
  access_type: 'offline';  // Get refresh token
  prompt: 'consent';       // Force consent for refresh token
}
```

---

### A.5: M1.2.010 - Rate Limiting Per Endpoint

**What's Defined:** Basic rate limiting in nginx.conf

**What's Missing:** Per-endpoint rate limiting algorithm, endpoint-specific limits

**Implementation:**

```typescript
// Rate limiting configuration:
interface RateLimitConfig {
  endpoint: string;
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;  // Max requests per window
  strategy: 'sliding' | 'fixed';
}

const RATE_LIMITS: RateLimitConfig[] = [
  // Auth endpoints - stricter
  { endpoint: '/api/auth/login', windowMs: 60000, maxRequests: 5, strategy: 'sliding' },
  { endpoint: '/api/auth/register', windowMs: 3600000, maxRequests: 3, strategy: 'sliding' },
  { endpoint: '/api/auth/forgot-password', windowMs: 86400000, maxRequests: 3, strategy: 'fixed' },
  // API endpoints - standard
  { endpoint: '/api/generate', windowMs: 60000, maxRequests: 10, strategy: 'sliding' },
  { endpoint: '/api/edit', windowMs: 60000, maxRequests: 20, strategy: 'sliding' },
  { endpoint: '/api/convert', windowMs: 60000, maxRequests: 10, strategy: 'sliding' },
  // Public endpoints - lenient
  { endpoint: '/api/translate', windowMs: 60000, maxRequests: 15, strategy: 'sliding' },
  { endpoint: '/api/voice', windowMs: 60000, maxRequests: 5, strategy: 'sliding' },
];

// Rate limiting algorithm (Redis):
// Key format: "ratelimit:{endpoint}:{ip}"
// Value: JSON array of timestamps
// Sliding window: Remove timestamps outside window, count remaining

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter: number;
}
```

---

### A.6: M1.3.010 - Socket.io Rooms/Namespaces Structure

**What's Defined:** WebSocket support in nginx.conf

**What's Missing:** Socket.io rooms, namespaces structure, event types

**Implementation:**

```typescript
// Socket.io namespaces:
const NAMESPACES = {
  '/generation': {
    // Document generation namespace
    rooms: ['generation:{sessionId}'],
    auth: true,
  },
  '/realtime': {
    // Real-time collaboration
    rooms: ['document:{docId}', 'user:{userId}'],
    auth: true,
  },
  '/admin': {
    // Admin events
    rooms: ['admin'],
    auth: true,
    role: 'admin',
  },
};

// Socket.io rooms:
const ROOMS = {
  // Generation rooms
  'generation:{sessionId}': {
    maxUsers: 1,
    autoLeave: true,
  },
  // Document rooms (for real-time)
  'document:{docId}': {
    maxUsers: 10,
    autoLeave: false,
  },
  // User rooms
  'user:{userId}': {
    maxUsers: 5,
    autoLeave: true,
  },
};

// Connection management:
interface SocketConnection {
  sid: string;           // socket ID
  uid: string;          // user ID
  namespace: string;
  room: string;
  connectedAt: number;
  lastHeartbeat: number;
}
```

---

### A.7: M1.3.011 - Event Types Enum & Reconnection Logic

**What's Defined:** WebSocket events mentioned in M4

**What's Missing:** Event types enum, reconnection logic

**Implementation:**

```typescript
// WebSocket event types:
// Client → Server
enum ClientEventType {
  GENERATE = 'generate',
  EDIT = 'edit',
  FORMAT = 'format',
  TRANSLATE = 'translate',
  SUMMARIZE = 'summarize',
  CANCEL = 'cancel',
  HEARTBEAT = 'heartbeat',
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',
}

// Server → Client
enum ServerEventType {
  START = 'start',
  CHUNK = 'chunk',
  COMPLETE = 'complete',
  ERROR = 'error',
  CREDIT_UPDATE = 'credit_update',
  PROGRESS = 'progress',
  HEARTBEAT_ACK = 'heartbeat_ack',
  USER_JOINED = 'user_joined',
  USER_LEFT = 'user_left',
}

// Event payload structures:
interface GenerateEvent {
  type: 'generate';
  payload: {
    text: string;
    format: string;
    tone: string;
    options: GenerateOptions;
  };
}

interface ChunkEvent {
  type: 'chunk';
  payload: {
    content: string;
    elementId: string;
    isFinal: boolean;
  };
}

// Reconnection logic:
interface ReconnectionConfig {
  maxRetries: number;         // 3 retries
  retryDelay: number;        // 1000ms initial
  maxRetryDelay: number;     // 30000ms max
  backoffMultiplier: number; // 2x
  onRetry: (attempt: number, delay: number) => void;
}

// Reconnection algorithm:
async function withReconnection<T>(
  fn: () => Promise<T>,
  config: ReconnectionConfig
): Promise<T> {
  let lastError: Error;
  let delay = config.retryDelay;
  
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < config.maxRetries) {
        config.onRetry(attempt + 1, delay);
        await sleep(delay);
        delay = Math.min(delay * config.backoffMultiplier, config.maxRetryDelay);
      }
    }
  }
  throw lastError;
}
```

---

### A.8: M4.001 & M4.005 - Generation API Route & Streaming

**What's Defined:** WebSocket protocol (lines 580-595)

**What's Missing:** API route structure, streaming implementation

**Implementation:**

```typescript
// API route structure:
// POST /api/generate
// Request:
interface GenerateRequest {
  text: string;
  format?: string;
  tone?: 'professional' | 'casual' | 'formal';
  structure?: 'auto' | 'business' | 'academic' | 'legal' | 'personal' | 'creative';
  options?: {
    wordCount?: number;
    includeImages?: boolean;
    style?: string;
  };
}

// Response (non-streaming for API):
interface GenerateResponse {
  document: GeneratedDocument;
  creditsUsed: number;
  creditsRemaining: number;
  processingTime: number;
}

// Streaming via WebSocket:
interface GenerationPayload {
  sessionId: string;
  text: string;
  format: string;
  tone: string;
  options: GenerateOptions;
}

// Streaming chunks:
interface ChunkPayload {
  type: 'start' | 'chunk' | 'complete' | 'error' | 'progress';
  data: {
    sessionId: string;
    content?: string;
    elementId?: string;
    isFinal?: boolean;
    progress?: number;
    error?: string;
    creditsUsed?: number;
  };
}

// WebSocket message protocol:
interface WSMessage {
  type: ClientEventType | ServerEventType;
  payload: any;
  timestamp: number;
  messageId: string;
}
```

---

### A.9: M4.009 - Language Detection Algorithm

**What's Defined:** Translate feature mentioned (lines 1155-1170)

**What's Missing:** Language detection algorithm

**Implementation:**

```typescript
// Language detection algorithm:
// Use langdetect library or cld3 for detection
// Primary: langdetect library
// Fallback: cld3 (CLD3 for more准确)

import langdetect from 'langdetect';
import cld3 from 'cld3';

interface LanguageDetection {
  language: string;      // ISO 639-1 code (e.g., 'en')
  languageName: string;   // Full name (e.g., 'English')
  confidence: number;    // 0-1 confidence score
  reliable: boolean;    // Is detection reliable
}

// Detection algorithm:
async function detectLanguage(text: string): Promise<LanguageDetection> {
  // Step 1: Use langdetect for initial detection
  const langdetectResult = langdetect.detect(text);
  if (!langdetectResult || langdetectResult.length === 0) {
    return { language: 'en', languageName: 'English', confidence: 0, reliable: false };
  }
  
  const primaryLang = langdetectResult[0].lang;
  const confidence = langdetectResult[0].prob;
  
  // Step 2: Use cld3 for verification
  const cld3Result = cld3.findLanguage(text);
  
  // Step 3: Compare results
  const languages = [
    { code: primaryLang, confidence: confidence },
    { code: cld3Result.language, confidence: cld3Result.probability },
  ];
  
  // Use weighted average
  const finalConfidence = (languages[0].confidence + languages[1].confidence) / 2;
  const language = finalConfidence > 0.7 ? primaryLang : 'en';
  
  return {
    language,
    languageName: getLanguageName(language), // Map code to name
    confidence: finalConfidence,
    reliable: finalConfidence > 0.7,
  };
}

// Supported languages:
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', supported: true },
  { code: 'es', name: 'Spanish', supported: true },
  { code: 'fr', name: 'French', supported: true },
  { code: 'de', name: 'German', supported: true },
  { code: 'it', name: 'Italian', supported: true },
  { code: 'pt', name: 'Portuguese', supported: true },
  { code: 'zh', name: 'Chinese', supported: true },
  { code: 'ja', name: 'Japanese', supported: true },
  { code: 'ko', name: 'Korean', supported: true },
  { code: 'ru', name: 'Russian', supported: true },
  { code: 'ar', name: 'Arabic', supported: true },
  { code: 'hi', name: 'Hindi', supported: true },
];
```

---

### A.10: M4.024 - Intent Detection Schema & M7.012

**What's Defined:** Intent analyzer mentioned in M19

**What's Missing:** Intent detection schema

**Implementation:**

```typescript
// Intent detection schema:
interface IntentAnalysis {
  intent: 'generate' | 'edit' | 'convert' | 'translate' | 'voice' | 'extract' | 'merge' | 'split' | 'compress' | 'style' | 'unknown';
  confidence: number;           // 0-1 confidence score
  entities: IntentEntity[];  // Extracted entities
  options: IntentOptions;     // Parsed options
  clarificationNeeded: boolean;
  clarificationOptions?: ClarificationOption[];
}

interface IntentEntity {
  type: 'format' | 'tone' | 'language' | 'structure' | 'wordCount' | 'action';
  value: string;
  confidence: number;
}

interface IntentOptions {
  format?: string;
  tone?: string;
  language?: string;
  structure?: string;
  wordCount?: number;
}

interface ClarificationOption {
  id: string;
  label: string;
  description: string;
  icon?: string;
}

// Intent detection algorithm:
async function analyzeIntent(text: string): Promise<IntentAnalysis> {
  const prompt = `
    Analyze this user message and extract the intent.
    
    Message: "${text}"
    
    Return JSON with:
    - intent: The primary intent (generate, edit, convert, translate, voice, extract, merge, split, compress, style)
    - confidence: 0-1 confidence score
    - entities: Extracted entities (format, tone, language, etc.)
    - options: Parsed options
    - clarificationNeeded: Whether clarification is needed
    - clarificationOptions: Array of options if clarification needed
    
    Intent keywords:
    - generate: "create", "make", "generate", "write"
    - edit: "edit", "change", "modify", "update", "fix"
    - convert: "convert", "change to", "transform"
    - translate: "translate", "in [language]"
    - voice: "voice", "dictate", "record"
    - extract: "extract", "pull text", "OCR"
    - merge: "merge", "combine", "join"
    - split: "split", "separate", "divide"
    - compress: "compress", "reduce", "smaller"
    - style: "style", "redesign", "change look"
  `;
  
  // Use LLM for intent detection
  const result = await llm.generate(prompt);
  return JSON.parse(result);
}

// Default confidence threshold:
const INTENT_CONFIDENCE_THRESHOLD = 0.7;
```

---

### A.11: M7.012 - AI Edit Streaming & API Route & M7.035 - Element ID Generation Strategy

**What's Defined:** Document structure defined (lines 622-640)

**What's Missing:** AI edit streaming, API route, element ID generation

**Implementation:**

```typescript
// AI Edit API route:
// POST /api/edit
interface EditRequest {
  documentId: string;
  elementId: string;
  instruction: string;
  mode: 'preview_edit' | 'set_editable';
}

interface EditResponse {
  document: GeneratedDocument;
  editedElementIds: string[];
  creditsUsed: number;
}

// AI Edit streaming:
interface EditChunkEvent {
  type: 'edit_start' | 'edit_chunk' | 'edit_complete' | 'edit_error';
  data: {
    elementId: string;
    originalContent: string;
    newContent: string;
    progress: number;
    editingreditsUsed?: number;
  };
}

// Element ID generation strategy:
// Use ULID (Universally Unique Lexicographically Sortable Identifier)
// ULID format: 01ARZ3NDEKTSV4RRFFQ69G7VKYV
// - Timestamp component (first 10 chars): Sortable by time
// - Random component (last 16 chars): Unique

// ULID structure:
interface ElementId {
  prefix: string;      // 'hdr', 'para', 'list', 'table', 'img'
  timestamp: string;   // 10 char base32 timestamp
  random: string;      // 16 char base32 random
  full: string;        // Full ULID: '{prefix}_{timestamp}{random}'
}

const ELEMENT_PREFIXES = {
  heading: 'hdr',
  paragraph: 'para',
  list: 'list',
  table: 'tbl',
  image: 'img',
};

// ID generation function:
function generateElementId(type: keyof typeof ELEMENT_PREFIXES): string {
  const prefix = ELEMENT_PREFIXES[type];
  const timestamp = ulid.slice(0, 10);
  const random = ulid.slice(10);
  return `${prefix}_${timestamp}${random}`;
}

// Example output:
// heading_01ARZ3NDEKTSV4RR
// para_01ARZ3NDEKTSV4RRFFQ69G7VKY
// table_01ARZ3NDEKTSV4RRFFQ69G7VKYV
```

---

### A.12: M8.001 & M8.004-005 - Edit API & Streaming

**What's Defined:** Edit types defined (lines 1127-1143)

**What's Missing:** Edit API endpoint structure, streaming

**Implementation:**

```typescript
// Edit API: /api/edit/route.ts
// POST /api/edit

// Request schema:
const editSchema = z.object({
  documentId: z.string().ulid(),
  elementId: z.string(),
  instruction: z.string().min(1).max(500),
  mode: z.enum(['preview_edit', 'set_editable']),
  options: z.object({
    preserveFormatting: z.boolean().default(true),
    tone: z.enum(['same', 'more_confident', 'more_casual', 'more_formal']).default('same'),
  }).optional(),
});

// Response (streaming via WebSocket):
// Connect to /generation namespace, room: document:{documentId}
// Send: { type: 'edit', payload: { elementId, instruction, options } }
// Receive: EditChunkEvent stream
```

---

### A.13: M8.013 - Summarization Options Structure

**What's Defined:** Options: brief/medium/detailed (line 1175)

**What's Missing:** Options structure

**Implementation:**

```typescript
// Summarization options:
enum SummarizationLength {
  BRIEF = 'brief',      // 20% of original
  MEDIUM = 'medium',    // 40% of original
  DETAILED = 'detailed', // 60% of original
}

interface SummarizationOptions {
  length: SummarizationLength;
  format: 'paragraph' | 'bullet' | 'outline';
  includeKeyPoints: boolean;  // Extract key points as bullets
  preserveTone: boolean;    // Keep original tone
}

interface SummarizationResult {
  summary: string;
  wordCount: number;
  originalWordCount: number;
  compressionRatio: number;
  keyPoints?: string[];
}

// Summarization prompt templates:
const SUMMARIZATION_PROMPTS = {
  brief: `Summarize the following text in 2-3 sentences, capturing the main points:`,
  medium: `Summarize the following text in a concise paragraph, covering the key information:`,
  detailed: `Create a detailed summary of the following text, preserving important details and examples:`,
  bullet: `Extract the key points from the following text as bullet points:`,
};
```

---

### A.14: M9.007-008 - Whisper API Endpoint & Streaming Transcription

**What's Defined:** Self-hosted Whisper mentioned (line 1215)

**What's Missing:** API endpoint structure, streaming transcription

**Implementation:**

```typescript
// Whisper API: /api/voice/transcribe
// POST /api/voice/transcribe

interface TranscribeRequest {
  audio: FormData;  // Audio file
  language?: string; // Optional language hint
  responseFormat: 'text' | 'json' | 'srt' | 'vtt';
}

interface TranscribeResponse {
  text: string;
  language: string;
  duration: number;
  segments?: TranscriptionSegment[];
}

interface TranscriptionSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  avg_logprob: number;
  no_speech_prob: number;
}

// Streaming transcription:
interface TranscribeStreamEvent {
  type: 'transcribe_start' | 'transcribe_chunk' | 'transcribe_complete' | 'transcribe_error';
  data: {
    text?: string;
    duration?: number;
    segments?: TranscriptionSegment[];
    progress?: number;
  };
}

// Audio format specifications:
// Supported: mp3, wav, m4a, webm, ogg
// Max duration: 2 minutes (120 seconds)
// Max file size: 10MB
// Sample rate: 16kHz (auto-resample if different)

// Processing pipeline:
// 1. Validate audio format and size
// 2. Convert to WAV if needed (ffmpeg)
// 3. Resample to 16kHz if needed
// 4. Send to Whisper API
// 5. Stream results back
```

---

### A.15: M9.016 - Recording Visual Feedback Animation System

**What's Defined:** UI mentioned (lines 1197-1211)

**What's Missing:** Animation specification

**Implementation:**

```typescript
// Recording feedback animations:
// 1. Idle state: Pulsing microphone icon
// 2. Recording state: Waveform visualization + red pulsing dot
// 3. Processing state: Spinning loader + "Processing..."

// Animation CSS:
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

@keyframes waveform {
  0% { height: 20%; }
  25% { height: 60%; }
  50% { height: 100%; }
  75% { height: 40%; }
  100% { height: 20%; }
}

@keyframes recording-dot {
  0%, 100% { background-color: #ef4444; }
  50% { background-color: #fca5a5; }
}

// Recording states:
type RecordingState = 'idle' | 'recording' | 'processing' | 'complete' | 'error';

interface RecordingFeedback {
  state: RecordingState;
  duration: number;         // Current duration in seconds
  waveformData: number[]; // Waveform amplitude data
  audioLevel: number;     // Current audio level (0-100)
}
```

---

### A.16: M10.007 - Image Placement Parsing Algorithm

**What's Defined:** Description examples (lines 1281-1285)

**What's Missing:** Parsing algorithm for placement

**Implementation:**

```typescript
// Image placement parsing algorithm:
interface ImagePlacement {
  position: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  reference?: string;    // e.g., "after paragraph 2"
  offset?: { x: number; y: number };
  alignment: 'left' | 'center' | 'right';
}

interface PlacementResult {
  placement: ImagePlacement;
  confidence: number;
  originalText: string;
}

// Parsing algorithm:
function parseImagePlacement(text: string): PlacementResult {
  const placementPatterns = {
    position: /(top|bottom|center)-(left|center|right)/i,
    reference: /after\s+(paragraph\s+\d+|section\s+\d+)/i,
    offset: /offset\s+(\d+)px\s+(x|-)\s+(\d+)px/i,
  };
  
  let position: ImagePlacement['position'] = 'center';
  
  // Match position
  const positionMatch = text.match(placementPatterns.position);
  if (positionMatch) {
    position = `${positionMatch[1].toLowerCase()}-${positionMatch[2].toLowerCase()}` as ImagePlacement['position'];
  }
  
  // Match reference
  let reference: string | undefined;
  const refMatch = text.match(placementPatterns.reference);
  if (refMatch) {
    reference = refMatch[0];
  }
  
  // Match offset
  let offset: { x: number; y: number } | undefined;
  const offsetMatch = text.match(placementPatterns.offset);
  if (offsetMatch) {
    offset = { x: parseInt(offsetMatch[1]), y: parseInt(offsetMatch[3]) };
  }
  
  return {
    placement: {
      position,
      reference,
      offset,
      alignment: position.includes('right') ? 'right' : position.includes('left') ? 'left' : 'center',
    },
    confidence: positionMatch ? 0.9 : reference ? 0.7 : 0.5,
    originalText: text,
  };
}

// AI placement interpretation prompt:
const PLACEMENT_PROMPT = `
Extract the image placement from this description: "{description}"

Return JSON:
{
  "position": "top-left|top-center|top-right|center-left|center|center-right|bottom-left|bottom-center|bottom-right",
  "reference": "after paragraph X" | null,
  "alignment": "left|center|right"
}
`;
```

---

### A.17: M10.019 - Image Storage DB Schema/API

**What's Defined:** Image described (lines 1252-1259)

**What's Missing:** Database schema, API endpoints

**Implementation:**

```typescript
// Image storage MongoDB schema:
interface ImageDocument {
  _id: ObjectId;
  userId: ObjectId;
  documentId: ObjectId | null;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  storageUrl: string;      // S3/GCS URL or local path
  thumbnailUrl: string;
  width: number;
  height: number;
  placement?: ImagePlacement;
  createdAt: Date;
  expiresAt: Date;        // For temporary storage
  status: 'processing' | 'ready' | 'deleted';
}

// Image API: /api/images
// - POST /api/images/upload
// - GET /api/images
// - GET /api/images/:id
// - DELETE /api/images/:id
// - POST /api/images/:id/place

interface ImageUploadResponse {
  imageId: string;
  uploadUrl: string;      // Pre-signed URL for direct upload
  expiresAt: number;
}

interface ImageListResponse {
  images: ImageDocument[];
  total: number;
  page: number;
  limit: number;
}

// Storage cleanup triggers:
// 1. On document generation complete: Keep for 24h
// 2. On document deletion: Delete immediately
// 3. On user logout: Delete temp images
// 4. Cron job: Delete images where expiresAt < now
// 5. On storage limit reached: Delete oldest first

// Cleanup API: /api/images/cleanup
interface CleanupRequest {
  mode: 'expired' | 'oldest' | 'all';
  limit?: number;
}
```

---

### A.18: M10.026 - Alt Text Generation AI Call Structure

**What's Defined:** Feature mentioned

**What's Missing:** AI call structure

**Implementation:**

```typescript
// Alt text generation:
// POST /api/images/:id/alt-text

interface AltTextRequest {
  imageId: string;
  context?: string;  // Optional document context
}

interface AltTextResponse {
  altText: string;
  confidence: number;
  keywords: string[];
}

// AI prompt for alt text:
const ALT_TEXT_PROMPT = `
Analyze this image and generate descriptive alt text for accessibility.

Context: {context}

Requirements:
1. Describe the main subject and action
2. Include relevant details (colors, objects, people)
3. Keep it concise (under 125 characters)
4. Avoid redundancy ("image of...")

Return JSON:
{
  "altText": "A person typing on a laptop at a desk",
  "keywords": ["person", "laptop", "desk", "typing", "technology"],
  "confidence": 0.9
}
`;
```

---

### A.19: M11.010 - Conversion API Request/Response Schema

**What's Defined:** Feature described (lines 1295-1349)

**What's Missing:** Request/response schema

**Implementation:**

```typescript
// Conversion API: /api/convert
// POST /api/convert

interface ConvertRequest {
  file: File;                          // Uploaded file
  fromFormat: string;                 // Source format (e.g., 'pdf')
  toFormat: string;                  // Target format (e.g., 'docx')
  quality: 'standard' | 'high';     // Conversion quality
  options?: {
    preserveLayout: boolean;        // Default: true
    ocrEnabled: boolean;             // Default: true for scanned
    preserveImages: boolean;         // Default: true
  };
}

interface ConvertResponse {
  taskId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  result?: {
    outputUrl: string;
    originalSize: number;
    convertedSize: number;
    pages: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

// Webhook notification:
interface ConvertWebhook {
  event: 'convert.completed' | 'convert.failed';
  taskId: string;
  result: ConvertResponse['result'];
  timestamp: number;
}
```

---

### A.20: M11.019 - Format Validation Function for 200 Paths

**What's Defined:** Dynamic route described (lines 1844-1859)

**What's Missing:** Validation function

**Implementation:**

```typescript
// Format conversion matrix:
const CONVERSION_MATRIX: Record<string, string[]> = {
  // PDF conversions (10)
  pdf: ['docx', 'doc', 'jpg', 'png', 'xlsx', 'csv', 'pptx', 'txt', 'html', 'odt'],
  // DOCX conversions (10)
  docx: ['pdf', 'doc', 'jpg', 'png', 'xlsx', 'csv', 'pptx', 'txt', 'html', 'odt'],
  // Continue for all 20 formats...
};

// Validation function:
function validateConversionPath(fromFormat: string, toFormat: string): { valid: boolean; error?: string } {
  const from = fromFormat.toLowerCase();
  const to = toFormat.toLowerCase();
  
  // Check if source format exists
  if (!CONVERSION_MATRIX[from]) {
    return { valid: false, error: `Unsupported source format: ${fromFormat}` };
  }
  
  // Check if target format is supported for source
  if (!CONVERSION_MATRIX[from].includes(to)) {
    return { 
      valid: false, 
      error: `Cannot convert from ${fromFormat} to ${toFormat}. Supported conversions: ${CONVERSION_MATRIX[from].join(', ')}` 
    };
  }
  
  return { valid: true };
}

// All valid format pairs (200 total):
const VALID_CONVERSION_PAIRS = [
  // 10 x 10 core formats = 100
  // 10 x 10 medium priority = 100
  // Total: 200 unique paths
];

// Get all valid pairs:
function getAllValidPairs(): Array<{ from: string; to: string; url: string }> {
  const pairs: Array<{ from: string; to: string; url: string }> = [];
  
  for (const from of Object.keys(CONVERSION_MATRIX)) {
    for (const to of CONVERSION_MATRIX[from]) {
      pairs.push({ from, to, url: `/convert/${from}-to-${to}` });
    }
  }
  
  return pairs;
}
```

---

### A.21: M11.021 - Conversion Quality Verification Approach

**What's Defined:** Mentioned in M11

**What's Missing:** Verification algorithm

**Implementation:**

```typescript
// Quality verification algorithm:
interface QualityMetrics {
  elementsPreserved: number;    // Headings, tables, images
  elementsTotal: number;
  formattingScore: number;       // 0-100
  layoutScore: number;           // 0-100
  overallScore: number;           // 0-100
}

interface QualityVerification {
  originalDocument: DocumentMetadata;
  convertedDocument: DocumentMetadata;
  metrics: QualityMetrics;
  issues: QualityIssue[];
}

interface QualityIssue {
  type: 'missing_element' | 'formatting_loss' | 'layout_shift' | 'content_loss';
  severity: 'low' | 'medium' | 'high';
  description: string;
  location?: string;
}

// Verification algorithm:
async function verifyConversionQuality(
  originalUrl: string,
  convertedUrl: string
): Promise<QualityVerification> {
  // 1. Parse original document
  const original = await parseDocument(originalUrl);
  
  // 2. Parse converted document
  const converted = await parseDocument(convertedUrl);
  
  // 3. Compare elements
  const elementsPreserved = compareElements(original, converted);
  
  // 4. Calculate formatting score
  const formattingScore = compareFormatting(original, converted);
  
  // 5. Calculate layout score
  const layoutScore = compareLayout(original, converted);
  
  // 6. Identify issues
  const issues = identifyIssues(original, converted);
  
  return {
    originalDocument: original.metadata,
    convertedDocument: converted.metadata,
    metrics: {
      elementsPreserved,
      elementsTotal: original.elements.length,
      formattingScore,
      layoutScore,
      overallScore: (formattingScore + layoutScore) / 2,
    },
    issues,
  };
}

// Quality thresholds:
// Pass: overallScore >= 80
// Warning: overallScore >= 60 && < 80
// Fail: overallScore < 60
```

---

### A.22: M11.033 - Fallback Trigger Criteria

**What's Defined:** Fallback described

**What's Missing:** Trigger criteria

**Implementation:**

```typescript
// Fallback trigger criteria:
interface FallbackCriteria {
  aiConversionFailed: boolean;      // AI service returned error
  timeoutExceeded: boolean;        // Processing > 120 seconds
  qualityScoreBelow: number;       // Quality score < 50 (default)
  networkError: boolean;            // Network failure
  retryCountExceeded: number;     // Retries > 3 (default)
}

interface FallbackConfig {
  maxRetries: number;              // Default: 3
  timeoutMs: number;               // Default: 120000 (120s)
  minQualityScore: number;        // Default: 50
  fallbackOnError: boolean;       // Default: true
}

// Check and trigger fallback:
async function shouldTriggerFallback(
  error: Error,
  attempt: number,
  qualityScore?: number
): Promise<{ shouldFallback: boolean; reason: string }> {
  const config: FallbackConfig = {
    maxRetries: 3,
    timeoutMs: 120000,
    minQualityScore: 50,
    fallbackOnError: true,
  };
  
  // Check retry count
  if (attempt >= config.maxRetries) {
    return { shouldFallback: true, reason: 'max_retries_exceeded' };
  }
  
  // Check quality score
  if (qualityScore !== undefined && qualityScore < config.minQualityScore) {
    return { shouldFallback: true, reason: 'quality_score_below_threshold' };
  }
  
  // Check error type
  const errorTypes = {
    AI_SERVICE_ERROR: true,
    TIMEOUT: true,
    NETWORK_ERROR: true,
    PARSE_ERROR: true,
  };
  
  if (errorTypes[error.name] && config.fallbackOnError) {
    return { shouldFallback: true, reason: error.name };
  }
  
  return { shouldFallback: false, reason: '' };
}
```

---

### A.23: M11.035-037 - Parser/Formatter/Metadata Approaches

**What's Defined:** Mentioned in M11

**What's Missing:** Implementation approaches

**Implementation:**

```typescript
// A.23.1: Input Parser (Convert Input Parser)
interface InputParser {
  parse(file: Buffer, format: string): Promise<ParsedDocument>;
}

interface ParsedDocument {
  text: string;
  elements: DocumentElement[];
  metadata: DocumentMetadata;
  errors: ParseError[];
}

// Parser implementations:
const PARSERS: Record<string, InputParser> = {
  pdf: pdfParser,         // pdf-parse library
  docx: docxParser,       // mammoth library
  xlsx: xlsxParser,       // xlsx library
  pptx: pptxParser,       // pptxjs
  image: imageParser,    // sharp + tesseract
  // ... etc
};

// A.23.2: Output Formatter (Convert Output Formatter)
interface OutputFormatter {
  format(document: ParsedDocument, targetFormat: string): Promise<Buffer>;
}

interface FormattingOptions {
  pageSize: 'letter' | 'a4' | 'legal';
  margins: { top: number; right: number; bottom: number; left: number };
  header?: string;
  footer?: string;
  pageNumbers: boolean;
}

const FORMATTERS: Record<string, OutputFormatter> = {
  pdf: pdfFormatter,       // puppeteer/pdfkit
  docx: docxFormatter,    // docx library
  xlsx: xlsxFormatter,    // xlsx library
  // ... etc
};

// A.23.3: Metadata Preservation
interface MetadataPreservation {
  extract(source: ParsedDocument): DocumentMetadata;
  apply(target: ParsedDocument, metadata: DocumentMetadata): ParsedDocument;
}

interface DocumentMetadata {
  title: string;
  author: string;
  subject: string;
  keywords: string[];
  createdDate: Date;
  modifiedDate: Date;
  pageCount: number;
  customProperties: Record<string, string>;
}

// Preservation rules:
// 1. Title: Extract from first heading or filename
// 2. Author: Document properties or user
// 3. Keywords: Extract from content
// 4. Dates: Preserve original creation date
// 5. Custom: Map to target format properties
```

---

### A.24: M12.007-011 - Document CRUD API Endpoints

**What's Defined:** Dashboard features (lines 1352-1377)

**What's Missing:** API endpoints

**Implementation:**

```typescript
// M12.007: Document Management View - GET /api/documents
interface GetDocumentsRequest {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  folderId?: string;
  search?: string;
}

interface GetDocumentsResponse {
  documents: Document[];
  total: number;
  page: number;
  limit: number;
}

// M12.008: Document Open - GET /api/documents/:id
interface GetDocumentResponse {
  document: Document;
  versions: DocumentVersion[];
}

// M12.009: Document Edit - PUT /api/documents/:id
interface UpdateDocumentRequest {
  title?: string;
  content?: object;
  folderId?: string;
}

// M12.010: Document Regenerate - POST /api/documents/:id/regenerate
interface RegenerateRequest {
  originalText: string;
  format?: string;
}

// M12.011: Document Download - GET /api/documents/:id/download
interface DownloadRequest {
  format: 'pdf' | 'docx' | 'txt' | 'html';
}

// M12.012: Document Delete - DELETE /api/documents/:id
interface DeleteDocumentRequest {
  permanently?: boolean; // false = soft delete
}
```

---

### A.25: M12.018-020 - Version Storage Schema, Restore API, Diff Algorithm

**What's Defined:** Version history mentioned

**What's Missing:** Schema, restore API, diff algorithm

**Implementation:**

```typescript
// M12.018: Version storage MongoDB schema:
interface DocumentVersion {
  _id: ObjectId;
  documentId: ObjectId;
  versionNumber: number;
  content: object;
  createdAt: Date;
  trigger: 'generation' | 'edit' | 'manual' | 'regenerate';
  createdBy: ObjectId;
  changeDescription?: string;
}

// Version restore API: POST /api/documents/:id/versions/:versionId/restore
interface RestoreVersionRequest {
  targetVersionId: string;
  createNewVersion: boolean; // Create new version before restore
}

interface RestoreVersionResponse {
  document: Document;
  restoredVersion: number;
}

// M12.020: Version diff algorithm:
interface VersionDiff {
  added: DiffElement[];
  removed: DiffElement[];
  modified: DiffChange[];
}

interface DiffElement {
  id: string;
  type: string;
  content: string;
}

interface DiffChange {
  id: string;
  before: string;
  after: string;
  type: 'content' | 'format' | 'position';
}

// Diff algorithm using diff library:
function diffVersions(versionA: Document, versionB: Document): VersionDiff {
  const diff = require('diff');
  
  // Compare JSON content
  const changes = diff.diffJson(versionA.content, versionB.content);
  
  const result: VersionDiff = {
    added: [],
    removed: [],
    modified: [],
  };
  
  changes.forEach((change: any) => {
    if (change.added) {
      result.added.push({ id: generateElementId('paragraph'), content: change.value });
    } else if (change.removed) {
      result.removed.push({ id: generateElementId('paragraph'), content: change.value });
    } else {
      result.modified.push({
        id: generateElementId('paragraph'),
        before: change.value[0],
        after: change.value[1],
        type: 'content',
      });
    }
  });
  
  return result;
}
```

---

### A.26: M12.021-025 - Analytics Aggregation Approach

**What's Defined:** Analytics mentioned

**What's Missing:** Aggregation approach

**Implementation:**

```typescript
// Analytics aggregation approach:
// M12.021: Usage Analytics (Pro)

// Daily aggregation (run at 00:00 UTC):
async function aggregateDailyAnalytics(date: Date): Promise<void> {
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));
  
  // Aggregate by user
  const userStats = await AnalyticsEvent.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      }
    },
    {
      $group: {
        _id: '$userId',
        documentsGenerated: { $sum: { $cond: [{ $eq: ['$eventType', 'generate'], 1, 0] } },
        creditsUsed: { $sum: '$credits' },
        actions: { $sum: 1 }
      }
    }
  ]);
  
  // Store daily summary
  await DailyAnalytics.create({
    date: startOfDay,
    userStats,
    totalDocuments: userStats.reduce((sum, u) => sum + u.documentsGenerated, 0),
    totalCredits: userStats.reduce((sum, u) => sum + u.creditsUsed, 0),
  });
}

// M12.022-025: Various analytics queries:
// - Get by date range: /api/analytics?from=...&to=...
// - Get by user: /api/analytics/user/:userId
// - Get by format: /api/analytics/formats
// - Get by tool: /api/analytics/tools

interface AnalyticsQuery {
  from?: Date;
  to?: Date;
  groupBy?: 'day' | 'week' | 'month';
  userId?: string;
  eventType?: string;
}
```

---

### A.27: M12.029-030 - Auto-Save API & Expiry Mechanism

**What's Defined:** Auto-save behavior (lines 1378-1389)

**What's Missing:** Auto-save API, expiry mechanism

**Implementation:**

```typescript
// M12.029: Auto-save (Pro) - API endpoint
// POST /api/documents/:id/autosave

interface AutoSaveRequest {
  content: object;
  trigger: 'ai-edit' | 'manual' | 'timeout';
}

interface AutoSaveResponse {
  savedAt: Date;
  versionId: string;
  nextAutoSaveAt: Date;
}

// Auto-save service:
const autoSaveService = {
  // Trigger: On every AI edit
  onAiEdit: debounce(async (documentId: string, content: object) => {
    await saveVersion(documentId, content, 'auto-save');
  }, 2000),
  
  // Trigger: Every 30 seconds while editing
  onTimeout: async (documentId: string) => {
    await saveVersion(documentId, getCurrentContent(), 'timeout');
  },
  
  // Interval: 30000ms
  interval: 30000,
};

// M12.030: Auto-save (Free) - localStorage expiry
// localStorage key structure:
interface LocalStorageDocument {
  id: string;
  title: string;
  preview: string;
  content: object;
  createdAt: number;
  autoDeleteAt: number;
}

// Expiry check algorithm:
// Run on app start and every hour
function checkAndDeleteExpiredDocuments(): void {
  const now = Date.now();
  const docs = JSON.parse(localStorage.getItem('cremy_docs') || '[]');
  
  const active = docs.filter((doc: LocalStorageDocument) => {
    // Delete if: credits < 10 AND autoDeleteAt < now
    if (getCredits() < 10 && doc.autoDeleteAt < now) {
      return false; // Delete
    }
    return true; // Keep
  });
  
  localStorage.setItem('cremy_docs', JSON.stringify(active));
}
```

---

### A.28: M12.032 - Search Index

**What's Defined:** Feature mentioned

**What's Missing:** Search implementation

**Implementation:**

```typescript
// Document search index:
// Use MongoDB text index for search

// Search index creation:
await Document.createIndex({ title: 'text', content: 'text' });

// Search API: GET /api/documents/search
interface SearchRequest {
  q: string;              // Search query
  type?: 'all' | 'title' | 'content';
  limit?: number;
  page?: number;
}

interface SearchResult {
  documents: Document[];
  total: number;
  page: number;
  highlighted: Record<string, string[]>; // Highlighted matches
}

// Search algorithm:
async function searchDocuments(query: SearchRequest): Promise<SearchResult> {
  const { q, type = 'all', limit = 20, page = 1 } = query;
  
  const searchQuery = type === 'all' 
    ? { $text: { $search: q } }
    : { [type]: { $text: { $search: q } } };
  
  const results = await Document.find(searchQuery)
    .sort({ score: { $meta: 'textScore' } })
    .skip((page - 1) * limit)
    .limit(limit);
  
  return {
    documents: results,
    total: results.length,
    page,
    highlighted: results.reduce((acc, doc) => {
      acc[doc._id] = highlightMatches(doc, q);
      return acc;
    }, {}),
  };
}
```

---

### A.29: M13.002 - Error Handling Specifics

**What's Defined:** localStorage mentioned

**What's Missing:** Specific error handling

**Implementation:**

```typescript
// LocalStorage error handling:
interface LocalStorageError {
  code: 'QUOTA_EXCEEDED' | 'NOT_SUPPORTED' | 'SYNTAX_ERROR' | 'SECURITY_ERROR';
  message: string;
  recovered: boolean;
}

// Error handling:
function handleLocalStorageError(error: Error): LocalStorageError {
  const errorMessages = {
    'QuotaExceededError': 'LocalStorage quota exceeded',
    'SecurityError': 'LocalStorage not available',
    'SyntaxError': 'Invalid data in localStorage',
  };
  
  const code = error.name as LocalStorageError['code'];
  
  // Recovery strategies:
  const recoveryStrategies = {
    QUOTA_EXCEEDED: async () => {
      // Clear oldest documents
      const docs = getLocalStorageDocuments();
      if (docs.length > 0) {
        docs.sort((a, b) => a.createdAt - b.createdAt);
        await deleteLocalStorageDocument(docs[0].id);
        return true;
      }
      return false;
    },
    NOT_SUPPORTED: async () => {
      // Use sessionStorage as fallback
      return true;
    },
    SYNTAX_ERROR: async () => {
      // Clear corrupted data
      localStorage.removeItem('cremy_docs');
      return true;
    },
    SECURITY_ERROR: async () => {
      // Disable localStorage
      return false;
    },
  };
  
  const recovered = await recoveryStrategies[code]();
  
  return {
    code,
    message: errorMessages[code],
    recovered,
  };
}
```

---

### A.30: M13.027 - Conflict Resolution Logic

**What's Defined:** Mentioned in M13

**What's Missing:** Conflict resolution logic

**Implementation:**

```typescript
// Conflict resolution logic:
// Used when syncing localStorage to MongoDB on upgrade

interface StorageConflict {
  key: string;
  localValue: any;
  mongoValue: any;
  resolution: 'local' | 'mongo' | 'merge';
}

// Resolution strategies:
const CONFLICT_STRATEGIES = {
  // For documents: Keep newest
  documents: (local: any, mongo: any) => {
    if (local.updatedAt > mongo.updatedAt) return local;
    return mongo;
  },
  
  // For settings: Merge (local overrides)
  settings: (local: any, mongo: any) => ({
    ...mongo,
    ...local,
  }),
  
  // For credits: Keep highest
  credits: (local: number, mongo: number) => Math.max(local, mongo),
};

// Conflict detection algorithm:
async function detectConflicts(localData: any, mongoData: any): Promise<StorageConflict[]> {
  const conflicts: StorageConflict[] = [];
  
  // Compare each key
  for (const key of Object.keys(localData)) {
    const local = localData[key];
    const mongo = mongoData[key];
    
    // Skip if equal
    if (JSON.stringify(local) === JSON.stringify(mongo)) continue;
    
    // Determine conflict type
    const strategy = getStrategy(key);
    const preferredValue = strategy(local, mongo);
    
    conflicts.push({
      key,
      localValue: local,
      mongoValue: mongo,
      resolution: preferredValue === local ? 'local' : 'mongo',
    });
  }
  
  return conflicts;
}
```

---

### A.31: M13.030 - Encryption Algorithm Specification

**What's Defined:** "Use environment key" mentioned

**What's Missing:** Algorithm specification (AES-256-GCM), IV handling

**Implementation:**

```typescript
// Encryption specification:
// Algorithm: AES-256-GCM
// Key derivation: PBKDF2 with SHA-256
// IV: Random 12 bytes per encryption
// Auth tag: 16 bytes

import crypto from 'crypto';

interface EncryptionConfig {
  algorithm: 'aes-256-gcm';
  keyLength: 32;        // 256 bits
  ivLength: 12;         // 96 bits (recommended)
  authTagLength: 16;    // 128 bits
  pbkdf2: {
    iterations: 100000;
    digest: 'sha256';
  };
}

// Encryption:
function encrypt(plaintext: string, key: string): string {
  const iv = crypto.randomBytes(12); // 12 bytes
  const keyBuffer = crypto.scryptSync(key, 'salt', 32); // Derive key
  
  const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Format: iv:encrypted:authTag (all hex)
  return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
}

// Decryption:
function decrypt(ciphertext: string, key: string): string {
  const [ivHex, encrypted, authTagHex] = ciphertext.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const keyBuffer = crypto.scryptSync(key, 'salt', 32);
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

---

### A.32: M14.004 - Admin Create Validation Spec & API Route

**What's Defined:** Admin creation flow (lines 1496-1529)

**What's Missing:** Validation spec, API route

**Implementation:**

```typescript
// Admin validation specification:
const adminValidationSchema = {
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and dashes'),
  
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
};

// Admin API route: POST /api/admin/create
interface AdminCreateRequest {
  token: string;          // Invite token
  username: string;
  password: string;
  confirmPassword: string;
}

interface AdminCreateResponse {
  success: boolean;
  userId?: string;
  message: string;
}

// API route implementation:
export async function POST(request: Request) {
  const body = await request.json();
  
  // Validate input
  const validated = adminValidationSchema.parse(body);
  
  // Validate password match
  if (validated.password !== validated.confirmPassword) {
    return Response.json({ error: 'Passwords do not match' }, { status: 400 });
  }
  
  // Validate token
  const tokenValid = await validateAdminToken(validated.token);
  if (!tokenValid) {
    return Response.json({ error: 'Invalid or expired token' }, { status: 400 });
  }
  
  // Create admin
  const user = await createAdmin(validated.username, validated.password);
  
  // Mark token as used
  await markTokenAsUsed(validated.token);
  
  return Response.json({ success: true, userId: user._id });
}
```

---

### A.33: M14.007 - Old Admin Data Migration

**What's Defined:** Old admin removed (line 1507)

**What's Missing:** Data migration for old admin's documents

**Implementation:**

```typescript
// Old admin data migration:
async function migrateOldAdminData(oldAdminId: string, newAdminId: string): Promise<void> {
  // 1. Transfer ownership of documents
  await Document.updateMany(
    { userId: oldAdminId },
    { userId: newAdminId }
  );
  
  // 2. Transfer ownership of folders
  await Folder.updateMany(
    { userId: oldAdminId },
    { userId: newAdminId }
  );
  
  // 3. Transfer analytics events
  await AnalyticsEvent.updateMany(
    { userId: oldAdminId },
    { userId: newAdminId }
  );
  
  // 4. Transfer templates
  await Template.updateMany(
    { userId: oldAdminId },
    { userId: newAdminId }
  );
  
  // 5. Transfer settings
  await UserSettings.updateMany(
    { userId: oldAdminId },
    { userId: newAdminId }
  );
  
  // 6. Log migration
  await AuditLog.create({
    action: 'admin_migration',
    oldAdminId,
    newAdminId,
    timestamp: new Date(),
  });
}
```

---

### A.34: M14.061-067 - Brevo Webhook Handlers

**What's Defined:** Email system described

**What's Missing:** Webhook handlers for Brevo

**Implementation:**

```typescript
// Brevo webhook handlers:
// POST /api/webhooks/brevo

interface BrevoWebhook {
  event: string;
  timestamp: number;
  data: BrevoEventData;
}

type BrevoEventData = 
  | SentEventData 
  | OpenedEventData 
  | ClickedEventData 
  | BouncedEventData 
  | UnsubscribedEventData;

// Handle sent event:
async function handleSent(data: SentEventData): Promise<void> {
  await AnalyticsEvent.create({
    eventType: 'email_sent',
    metadata: {
      campaignId: data.campaign_id,
      messageId: data.message_id,
      recipient: data.email,
    },
  });
}

// Handle opened event:
async function handleOpened(data: OpenedEventData): Promise<void> {
  await AnalyticsEvent.create({
    eventType: 'email_opened',
    metadata: {
      campaignId: data.campaign_id,
      messageId: data.message_id,
      recipient: data.email,
      openedAt: new Date(data.timestamp * 1000),
    },
  });
}

// Handle clicked event:
async function handleClicked(data: ClickedEventData): Promise<void> {
  await AnalyticsEvent.create({
    eventType: 'email_clicked',
    metadata: {
      campaignId: data.campaign_id,
      messageId: data.message_id,
      recipient: data.email,
      url: data.url,
    },
  });
}

// Handle bounced event:
async function handleBounced(data: BouncedEventData): Promise<void> {
  await AnalyticsEvent.create({
    eventType: 'email_bounced',
    metadata: {
      campaignId: data.campaign_id,
      messageId: data.message_id,
      recipient: data.email,
      bounceType: data.bounce_type,
    },
  });
}

// Handle unsubscribed event:
async function handleUnsubscribed(data: UnsubscribedEventData): Promise<void> {
  await UserSettings.updateOne(
    { email: data.email },
    { emailUnsubscribe: true }
  );
}

// Webhook verification:
// Brevo sends webhook with signature in headers
// Verify signature using Brevo API key
```

---

### A.35: M15.001 & M15.009 - Payment Key Storage & Processor Method

**What's Defined:** Flutterwave/Paystack/Stripe/PayPal for global + local coverage

**What's Missing:** Key storage approach, processor method specification

**Implementation:**

```typescript
// M15.001: Key storage approach:
// Use environment variables for keys
// Store in database: encrypted

interface PaymentConfig {
  flutterwave: {
    publicKey: string;
    secretKey: string;       // Encrypted in DB
    encryptionKey: string;   // Encrypted in DB
    environment: 'sandbox' | 'production';
  };
  paystack: {
    publicKey: string;
    secretKey: string;       // Encrypted in DB
    environment: 'sandbox' | 'production';
  };
  stripe: {
    publishableKey: string;
    secretKey: string;        // Encrypted in DB
    webhookSecret: string;
  };
  paypal: {
    clientId: string;
    clientSecret: string;    // Encrypted in DB
    environment: 'sandbox' | 'production';
  };
}

// M15.009: Processor checkout method:
async function createCheckout(userId: string, packId: string, processor: 'paddle' | 'stripe' | 'paypal'): Promise<{ url: string }> {
  const config = getPaymentConfig();
  
  switch (processor) {
    case 'stripe':
      return createStripeCheckout(userId, packId, config.stripe);
    case 'paddle':
      return createPaddleCheckout(userId, packId, config.paddle);
    case 'paypal':
      return createPayPalCheckout(userId, packId, config.paypal);
    default:
      throw new Error('Unsupported processor');
  }
}

// Stripe checkout:
async function createStripeCheckout(userId: string, packId: string, config: StripeConfig): Promise<{ url: string }> {
  const pack = await getCreditPack(packId);
  const user = await getUser(userId);
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: pack.name },
        unit_amount: pack.price * 100,
      },
      quantity: pack.credits,
    }],
    mode: 'payment',
    success_url: `${process.env.APP_URL}/buy-credits/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.APP_URL}/buy-credits/cancel`,
    metadata: { userId, packId },
  });
  
  return { url: session.url };
}

// Similar for Paddle and PayPal
```

---

### A.36: M16.001 - SEO Specific Titles & Descriptions

**What's Defined:** SEO mentioned

**What's Missing:** Specific titles/descriptions

**Implementation:**

```typescript
// SEO titles and descriptions for landing page:
const LandingPageSEO = {
  title: 'Cremy Docs - AI-Powered Document Generation Platform',
  description: 'Create professional documents in seconds. Use AI to generate, edit, translate, and convert documents. Free credits available.',
  keywords: ['document generation', 'AI writing', 'document converter', 'PDF tools', 'AI assistant'],
  
  // Meta tags:
  ogTitle: 'Create Documents with AI | Cremy Docs',
  ogDescription: 'Generate, edit, and convert documents in seconds with AI-powered tools.',
  ogImage: '/images/og-image.png',
  
  // Structured data:
  schema: {
    '@type': 'WebApplication',
    'name': 'Cremy Docs',
    'applicationCategory': 'ProductivityApplication',
    'operatingSystem': 'Web',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
    },
  },
};

// Format pages:
const FormatPageSEO: Record<string, { title: string; description: string }> = {
  invoice: {
    title: 'Create Invoice | Professional Invoice Generator',
    description: 'Generate professional invoices in seconds. Customizable templates, automatic calculations.',
  },
  contract: {
    title: 'Create Contract | Legal Document Generator',
    description: 'Generate legally-binding contracts with AI. Professional templates.',
  },
  // ... add for each format
};
```

---

### A.37: M16.007 - Schema.org Type Specification

**What's Defined:** Schema.org mentioned

**What's Missing:** Schema type (CreativeWork)

**Implementation:**

```typescript
// Schema.org type for format pages:
const getFormatPageSchema = (format: Format) => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  'name': `${format.name} Generator | Cremy Docs`,
  'description': format.description,
  'url': `/format/${format.id}`,
  'applicationCategory': 'ProductivityApplication',
  'operatingSystem': 'Web',
  'offers': {
    '@type': 'Offer',
    'price': '0',
    'priceCurrency': 'USD',
  },
  'creator': {
    '@type': 'Organization',
    'name': 'Cremy Docs',
    'url': 'https://cremy-docs.com',
  },
  'browserRequirements': 'Requires JavaScript',
  'softwareRequirements': 'Modern web browser',
});

// For conversion pages:
const getConversionPageSchema = (from: string, to: string) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  'name': `Convert ${from.toUpperCase()} to ${to.toUpperCase()} | Cremy Docs`,
  'description': `Free online tool to convert ${from.toUpperCase()} files to ${to.toUpperCase()}. Fast, secure, AI-powered.`,
  'url': `/convert/${from}-to-${to}`,
  'applicationCategory': 'UtilityApplication',
  'operatingSystem': 'Web',
  'offers': {
    '@type': 'Offer',
    'price': '0',
    'priceCurrency': 'USD',
  },
});
```

---

### A.38: M19.001 - Agent API Route Structure & M19.002 Confidence Threshold

**What's Defined:** Agent mentioned (lines 53-139)

**What's Missing:** API route, confidence threshold

**Implementation:**

```typescript
// M19.001: Agent API route: POST /api/agent
interface AgentRequest {
  message: string;
  context?: {
    documentId?: string;
    page?: string;
  };
  sessionId?: string;
}

interface AgentResponse {
  response: string;
  intent: IntentAnalysis;
  action?: {
    type: string;
    params: any;
  };
  sessionId: string;
}

// Agent confidence threshold:
const INTENT_CONFIDENCE_THRESHOLD = 0.7; // 70% minimum confidence

// Confidence scoring:
function calculateIntentConfidence(detectedIntent: string, alternatives: string[]): number {
  if (alternatives.length === 0) return 1.0;
  
  // Base confidence on top intent
  const baseConfidence = 0.7;
  
  // Reduce confidence if many alternatives
  const alternativePenalty = Math.min(alternatives.length * 0.05, 0.3);
  
  // Calculate final confidence
  return baseConfidence - alternativePenalty;
}

// Intent clarification:
// If confidence < 0.7, ask user for clarification
```

---

### A.39: M19.030-033 - Mailcraft AI Prompt Structure

**What's Defined:** Mailcraft mentioned

**What's Missing:** AI prompt structure

**Implementation:**

```typescript
// Mailcraft AI prompt structures:

// Generate template prompt:
const GENERATE_TEMPLATE_PROMPT = `
You are an email template expert. Create a professional email template.

Requirements:
- Subject: {subject}
- Category: {category} (welcome, promotional, announcement, newsletter, transactional)
- Tone: {tone} (professional, casual, friendly)
- Include personalization tags: {name}, {credits}, {pro_expiry}

Structure:
1. Subject line
2. Greeting
3. Main content (2-3 short paragraphs)
4. Call to action
5. Signature

Create in HTML format with inline styles.
`;

// Edit template prompt:
const EDIT_TEMPLATE_PROMPT = `
Edit the following email template.

Current template:
{template}

Editing instructions:
{instructions}

Return the edited template in HTML format with inline styles.
`;

// Preview prompt:
const PREVIEW_TEMPLATE_PROMPT = `
Show how this email template would look.

Template:
{template}

Variables:
{name} = "John"
{credits} = "100"
{pro_expiry} = "January 15, 2025"

Render the complete email showing where each variable would appear.
`;
```

---

## END OF APPENDIX A