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
- **M11:** File Conversion System

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
/                           # Homepage (tool showcase, quick actions)
/generate                   # Document generation page
/preview                    # Document preview & editing page
/convert                    # File conversion tool (main)
/convert/[from]-[to]        # SEO conversion pages (200 paths)
/templates                  # Template gallery
/templates/[category]       # Templates by category
/templates/[category]/[id] # Individual template
/translate                 # Translation page
/voice                      # Voice-to-document page
/extract-text-from-pdf      # Extract text from PDF
/merge-pdf                  # Merge multiple PDFs
/split-pdf                  # Split PDF into pages
/compress-pdf               # Compress PDF file size
/edit-file                  # Edit file (remove pages, rotate, etc)
/change-style               # Change document style (full page)
/auth/login                 # Login modal/page
/auth/register              # Register modal/page
/dashboard                  # User dashboard (Pro)
/settings                   # User settings
/admin                      # Admin panel
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

### Quick Actions Grid

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

## M11: File Conversion System

### Conversion Philosophy

**Key Rule:** Conversions are COMPLETELY FREE for all users (no credits needed)

### Supported Conversions (Full Matrix)

**Word Processing:**
- DOC, DOCX, ODT, RTF, TXT ↔ each other + PDF

**Presentations:**
- PPT, PPTX, ODP ↔ PDF + each other

**Spreadsheets:**
- XLS, XLSX, ODS, CSV ↔ PDF + each other

**eBooks:**
- EPUB, MOBI, AZW ↔ PDF

**Markup/Web:**
- HTML, MD ↔ PDF, DOCX

### AI-Enhanced Conversion

**All conversions use AI for best quality** (user confirmed)

**Implementation:**
- AI analyzes source document structure
- Regenerates in target format with best formatting
- Preserves: headings, tables, images, layout

### Conversion Priority

Build in order: Full matrix (all formats)

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
npm run admin:create [email]
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

3. Admin enters password
   └── Creates admin account, sets role='admin'

4. Old admin removed (if exists)
   └── Previous admin set to 'user' role

5. Token marked as used
   └── Cannot be reused
```

**Token Properties:**
- Token: random string (32 chars)
- Email: provided in command
- CreatedAt: timestamp
- ExpiresAt: timestamp (24h default)
- UsedAt: null (until used)
- UsedBy: null (until used)

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

**System Settings:**
- Default AI model
- Max file upload size
- Rate limits
- Feature flags

### Admin UI

```typescript
// Routes
/admin              # Dashboard
/admin/api-keys     # API key management
/admin/pricing      # Credit pricing
/admin/settings     # System settings
/admin/analytics    # Usage analytics
```

---

## M15: Payments & Subscriptions

### Payment Processor

**Selected:** User wants less limiting than Stripe (had issues with international cards)

**Options to Consider:**
- Paddle (handles global tax/compliance)
- LemonSqueezy (developer-friendly, handles taxes)
- Stripe with alternatives configured

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
Payment processor checkout
    ↓
On success: Update user credits in DB
    ↓
Show confirmation + new balance
```

---

## M16: SEO & Public Pages

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

## Summary

Cremy Docs is an AI-powered document platform with:
- **Credit-based system**: Document generation costs credits, conversions are free
- **Format templates**: Video/demo previews with AI generation
- **No stored prompts**: All AI interactions via natural language
- **Pro features**: MongoDB storage, analytics, unlimited generation
- **Admin control**: Configurable pricing, API key management
- **WebSocket streaming**: Skeleton + fill progressive rendering

This milestone document provides the complete technical blueprint for building the platform.