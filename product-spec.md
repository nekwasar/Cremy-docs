# Cremy Docs — Product Requirements Document (PRD)

**Product Name:** Cremy Docs  
**Domain:** cremy.co  
**Brand:** Cremy (parent brand — "Docs" is the first product under it)  
**Version:** 3.0  
**Status:** Ready for Engineering  

---

> **On the name:** The domain is cremy.co. The product is called **Cremy Docs** — clean, obvious, and instantly communicates what it does. "Cremy" is preserved as the parent brand for future products.

---

## 1. Product Overview

**Cremy Docs** is the ultimate all-in-one document platform that does everything — generate, convert, translate, extract text, merge, split, compress, and style documents — in one place.

No subscriptions required. No watermarks. No tab switching. Just documents, done smoothly.

### Tagline
> *"Documents, done smoothly."*

### The Core Promise
```
Free for basic. AI-powered for perfect. 
You choose.
```

---

## 2. What Cremy Docs Does

### 2.1 The 9 Core Tools

| # | Tool | Description | Credits |
|---|------|-------------|---------|
| 1 | **Generate Doc** | Create professional documents from text | Paid |
| 2 | **Convert** | Convert between any file formats | FREE |
| 3 | **Translate** | Translate documents to any language | Paid |
| 4 | **Voice to Doc** | Convert voice/audio to document | Paid |
| 5 | **Extract Text** | OCR - extract text from PDF/images | Paid |
| 6 | **Merge PDF** | Combine multiple PDFs into one | FREE |
| 7 | **Split PDF** | Split PDF into separate pages | FREE |
| 8 | **Compress PDF** | Reduce PDF file size | FREE |
| 9 | **Change Style** | Redesign document with new style | Paid |

### 2.2 How Each Tool Works

**Generate Doc:**
- User enters text or uses Doc Structure dropdown
- Optional: Add images (describe where they go)
- Click Generate → AI creates document
- Preview → Edit (free click or AI) → Download

**Convert:**
- Upload any file
- Select target format
- Click Convert → Download
- FREE for all users

**Translate:**
- Select source language
- Select target language
- Upload file OR paste text
- Click Translate → Download

**Voice to Doc:**
- Record voice OR upload audio file
- AI transcribes and formats to document

**Extract Text (OCR):**
- Upload PDF or image
- AI extracts text using OCR
- Copy or download text

**Merge PDF:**
- Upload multiple PDF files
- Reorder by drag & drop
- Click Merge → Download

**Split PDF:**
- Upload PDF
- Select pages to extract OR extract all
- Download

**Compress PDF:**
- Upload PDF
- Select compression level (Low/Medium/High)
- Download compressed file

**Change Style:**
- Upload document
- Select new style from gallery
- AI applies new design
- Download

---

## 3. Target Audience

**Everyone** — broad positioning. Key personas:

| Persona | Use Case | Frequency |
|---|---|---|
| Job seeker | Resumes, cover letters | High |
| Freelancer | Proposals, invoices, contracts | High |
| Student | Essays, reports, assignments | High |
| Small business owner | Invoices, proposals, contracts | High |
| HR professional | Job descriptions, offer letters | Medium |
| Marketing team | Briefs, newsletters, presentations | High |
| Educator | Syllabi, lesson plans, rubrics | Medium |
| Anyone needing conversions | PDF tools, format changes | Very High |

---

## 4. Why Cremy Docs Wins

### 4.1 The All-In-One Advantage

| What others do | What Cremy Docs does |
|---|---|
| One tool | **9 tools in one platform** |
| Go to 5+ different sites | **Never leave Cremy Docs** |
| Remember 5 passwords | **One account (optional)** |

### 4.2 The Free Dominance

| What competitors do | What Cremy Docs does |
|---|---|
| Limited free conversions | **UNLIMITED free conversions** |
| Watermark free files | **No watermarks. Ever.** |
| Force account creation | **Use immediately, login when ready** |
| Expensive subscriptions | **Pay-as-you-go with credits** |

### 4.3 The Quality Edge

| What competitors do | What Cremy Docs does |
|---|---|
| Basic library conversions | **AI-enhanced option for perfect quality** |
| Lost formatting | **Layout preserved with AI** |
| One quality level | **Free (basic) + Paid (AI perfect)** |

---

## 5. Page Structure & Routes

### 5.1 Main Routes

```
/                           # Homepage (tool showcase)
/generate                   # Document generation
/preview                    # Document preview & editing
/convert                    # Main conversion tool
/templates                  # Template gallery
/templates/[category]       # Templates by category
/templates/[category]/[id] # Individual template
/translate                 # Translation page
/voice                      # Voice-to-document page
/extract-text-from-pdf     # OCR/Extract text page
/merge-pdf                  # Merge PDFs
/split-pdf                  # Split PDF
/compress-pdf               # Compress PDF
/change-style               # Change document style
```

### 5.2 SEO Pages (200+ pages)

**Conversion Pages:** `/convert/[from]-[to]`
- /convert/pdf-to-docx
- /convert/docx-to-pdf
- ... (200 paths)

**Extract Text Pages:** `/extract-text-from-pdf`, `/pdf-to-text`, `/image-to-text`, etc.

**PDF Tool Pages:** `/merge-pdf`, `/split-pdf`, `/compress-pdf`, etc.

---

## 6. User Interface

### 6.1 Homepage

```
┌─────────────────────────────────────────┐
│  Logo (left)    [Login] [Sign Up]      │  ← Header
├─────────────────────────────────────────┤
│         Hero Section                     │
│    "Documents, done smoothly."          │
│    Value proposition + animated demo     │
├─────────────────────────────────────────┤
│     Quick Actions Grid (9 tools)         │
│  [📄 Generate]  [🔄 Convert]           │
│  [🌐 Translate] [🎤 Voice]             │
│  [📝 Extract Text] [📑 Merge]          │
│  [✂️ Split]     [📦 Compress]          │
│  [🎨 Change Style]                      │
└─────────────────────────────────────────┘
```

### 6.2 Document Generation Page (/generate)

```
┌─────────────────────────────────────────┐
│  Home > Generate                        │  ← Breadcrumb
├─────────────────────────────────────────┤
│  Logo    [💰]    [Account ▼]          │  ← Fixed Top Bar (click 💰 to reveal credits)
├─────────────────────────────────────────┤
│  [Explore Styles ▼]                     │  ← Opens templates modal
├─────────────────────────────────────────┤
│  Doc Structure: [Auto ▼]                 │  ← Optional: select structure
├─────────────────────────────────────────┤
│  Input Box                              │
│  "Paste your document text here..."    │
│  [Add Image 📷]                        │
│  [Clear] [Generate]                   │
├─────────────────────────────────────────┤
│  Credit Estimate: ~X credits            │
└─────────────────────────────────────────┘
```

### 6.3 Preview/Edit Page (/preview)

```
┌─────────────────────────────────────────┐
│  Home > Generate > Preview              │  ← Breadcrumb
├─────────────────────────────────────────┤
│  Logo    [💰]    [Account ▼]          │  ← Fixed Top Bar
├─────────────────────────────────────────┤
│  [← Back] [Title] [Preview] [Edit]    │
│  [Undo] [Redo] [Download ▼]          │
├─────────────────────────────────────────┤
│         Document Preview                 │
│      (Rendered PDF-style view)          │
├─────────────────────────────────────────┤
│  [Download PDF ▼]  [Start New Project] │
└─────────────────────────────────────────┘
```

### 6.4 Post-Download Modal

```
┌─────────────────────────────────────────┐
│       ✅ Download Complete!              │
│                                         │
│  [Start New Project]  [View Doc]      │
│                                         │
│  Auto-closes in 10 seconds             │
└─────────────────────────────────────────┘
```

### 6.5 Navigation

**Desktop:**
- Top navigation bar
- Breadcrumb below (like File Explorer)
- Current page underlined

**Mobile:**
- Hamburger menu (right side)
- Slide-out modal
- Close by clicking outside
- Breadcrumb at top left

---

## 7. Key Features

### 7.1 Document Generation

- **Input:** Text in expandable textarea
- **Doc Structure:** Optional dropdown (Auto, Letter, Invoice, Contract, etc.)
- **Images:** Add up to 5 images, describe placement in text
- **Generation:** Skeleton + fill progressive streaming
- **Output:** PDF default, can convert to other formats

### 7.2 Templates (Explore Styles)

- Click "Explore Styles" → Modal with categories
- Select category → /templates/[category]
- Click template → Preview modal → "Use Template"
- Redirects to /generate?template=[id]

### 7.3 Editing

Three ways to edit:
1. **Preview Click Edit (Free):** Click element to edit only that part
2. **Make Content Editable (Free):** Click button to edit all
3. **AI Commands (Paid):** Use input box for complex changes

### 7.4 File Conversion

- **FREE:** Unlimited conversions for all users
- **Method:** Drag-and-drop, select format, download
- **Quality:** Standard library for free, AI-enhanced for credits

### 7.5 Translation

- Select source language (required)
- Select target language (required)
- Upload file OR paste text
- 1 credit per 50 words

### 7.6 Voice to Document

- Record in-app OR upload audio file
- English only initially
- Max 2 minutes
- Self-hosted Whisper for transcription

### 7.7 Extract Text (OCR)

- Upload PDF or image
- AI extracts text using OCR
- 1 credit per 50 words extracted

### 7.8 Merge/Split/Compress PDF

- All completely FREE
- Use libraries (100% quality)
- No credits needed

### 7.9 Change Style

- Upload document
- Select new style from gallery
- AI redesigns document
- 1 credit per 100 words

---

## 8. Credit System

### 8.1 Credit Costs

| Action | Cost | Notes |
|--------|------|-------|
| Document Generation | 1 credit / 100 words | Core AI |
| AI Editing | 1 credit / 10 edits | Complex changes |
| Translation | 1 credit / 50 words | Any language |
| Extract Text (OCR) | 1 credit / 50 words | From images/PDFs |
| Change Style | 1 credit / 100 words | Document redesign |
| Add Image | 1 credit / image | Max 5 per doc |
| **Merge PDF** | **FREE** | Traffic driver |
| **Split PDF** | **FREE** | Traffic driver |
| **Compress PDF** | **FREE** | Traffic driver |
| **Basic Conversions** | **FREE** | Traffic driver |

### 8.2 Credit Bundles

| Bundle | Price | Cost per Credit |
|--------|-------|------------------|
| 100 credits | $10 | 10¢ |
| 500 credits | $40 | 8¢ |
| 1000 credits | $70 | 7¢ |

### 8.3 Free Credits

- New users: 10 credits (one-time)
- No recurring free credits

### 8.4 Pro Subscription

| Plan | Price | Credits/Month |
|------|-------|---------------|
| Pro Monthly | $9/mo | 200 credits |
| Pro Yearly | $86/yr | 2400 credits (20% off) |

---

## 9. Data & Storage

### 9.1 Anonymous Users (No Account)

- **Credits:** 10 free credits
- **Storage:** localStorage
- **Retention:** 24 hours if <10 credits, indefinite if ≥10 credits
- **Features:** Can use all tools

### 9.2 Registered Users

- **Credits:** Bought or Pro subscription
- **Storage:** MongoDB
- **Features:** Dashboard, saved documents, analytics

### 9.3 Save Banner

- Trigger: After download
- Show to: Free users with 10+ credits
- Options: "Turn on Storage", "Not Interested", "Never show again"
- Default: OFF (closed)

---

## 10. Authentication

- **Methods:** Email + Password, Google OAuth
- **Session:** JWT in httpOnly cookies, 7-day expiry
- **Password Reset:** Email verification code

---

## 11. SEO Strategy

### 11.1 Page Categories

| Category | Pages | Examples |
|----------|-------|----------|
| Core Tools | 9 | /generate, /convert, /translate |
| Conversion Matrix | 200+ | /convert/pdf-to-docx |
| Extract Text | 6+ | /extract-text-from-pdf, /pdf-to-text |
| PDF Tools | 6+ | /merge-pdf, /split-pdf |
| Style | 3+ | /change-style |

### 11.2 Target Keywords

- "free pdf converter" (100K+ searches)
- "free merge pdf" (50K+)
- "free compress pdf" (40K+)
- "free pdf to word" (80K+)
- "extract text from pdf" (high intent)

---

## 12. Success Metrics (First 12 Months)

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Organic Visitors | 10,000 | 50,000 | 200,000 |
| Registered Users | 5,000 | 25,000 | 100,000 |
| Paid Users | 200 | 1,000 | 5,000 |
| Monthly Revenue | $2,000 | $10,000 | $50,000 |
| Free Conversions | 50,000 | 300,000 | 1,000,000 |

---

## 13. The Competitive Edge

### Why Cremy Docs Wins

1. **Free Unlimited Conversions** — No competitor offers this
2. **All-In-One** — Never leave the platform
3. **No Watermarks** — Builds trust
4. **Pay-as-you-go** — No subscription required
5. **AI Quality Option** — Perfect when it matters
6. **Speed** — Target: <3 seconds
7. **250+ SEO Pages** — Dominate search

### The Formula

```
FREE TOOLS → TRAFFIC → CREDITS → REVENUE
     ↓           ↓          ↓
  SEO DOMINATION   USERS    MONEY
```

---

## 14. Technical Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| State | Zustand |
| Backend | Next.js API Routes |
| Database | MongoDB (Pro users) |
| Auth | Custom JWT + Google OAuth |
| AI | Plug-and-play (configurable in admin) |
| Streaming | WebSocket |
| File Storage | Local/S3 |
| Payments | Paddle or LemonSqueezy (global-friendly) |

---

## 15. Open Questions

1. **Payment processor:** Stripe has limitations with international cards. Paddle or LemonSqueezy recommended for global coverage.

2. **AI model:** Confirm provider (OpenAI/Anthropic/DeepSeek) and configure in admin panel.

3. **Voice languages:** Start with English only, expand based on demand.

---

*Document owned by Product Team*
*Version 3.0*
*Last Updated: April 2026*
