# PraxisNova Content Pipeline

## Project Overview
Content generation and distribution pipeline for PraxisNova. Automates creation of marketing content, images, and promotional materials using AI (Google Gemini) for image generation and content composition. Manages content workflow from creation to publication.

## Tech Stack
- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Hosting**: Vercel
- **AI/Image Generation**: Google Gemini API
- **Content Storage**: Database/file system (check `.env.local`)
- **Publishing**: Multi-channel distribution

## Key Commands
```bash
npm run dev      # Start development server
npm run build    # Production build
npm start        # Run production build
npm run lint     # Run ESLint
```

## Skills
**Before starting ANY work, check `.claude/skills/` for auto-selected skills:**

**IMPORTANT: Before starting ANY task, scan .claude/skills/ and auto-select the most relevant skills. Always start with product-marketing-context to establish company context, then layer on task-specific skills.**

- `product-marketing-context` — establishes company/product context for all other skills
- `revops` — lead scoring, pipeline management, routing
- `sales-enablement` — pitch decks, objection handling, demo scripts
- `cold-email` — personalized outreach frameworks
- `pricing-strategy` — pricing models and optimization
- `email-sequence` — lifecycle, nurture, onboarding sequences
- `copywriting` — conversion-focused copy
- `copy-editing` — polish and refine content
- `social-content` — LinkedIn posts, carousels, engagement
- `content-strategy` — content planning and calendars
- `marketing-ideas` — brainstorm marketing campaigns
- `marketing-psychology` — persuasion and behavioral triggers
- `ad-creative` — ad copy and creative concepts
- `paid-ads` — paid advertising campaigns
- `launch-strategy` — product launches, PR, media outreach
- `seo-audit` — technical SEO analysis
- `ai-seo` — AI-optimized SEO strategies
- `programmatic-seo` — templated pages at scale
- `site-architecture` — information architecture
- `schema-markup` — structured data for search
- `page-cro` — landing page conversion optimization
- `signup-flow-cro` — registration flow optimization
- `form-cro` — form conversion optimization
- `onboarding-cro` — onboarding flow optimization
- `popup-cro` — popup conversion optimization
- `paywall-upgrade-cro` — upgrade flow optimization
- `customer-research` — customer interviews and insights
- `competitor-alternatives` — competitive analysis
- `ab-test-setup` — A/B testing frameworks
- `analytics-tracking` — measurement and tracking
- `lead-magnets` — lead generation assets
- `free-tool-strategy` — free tools for acquisition
- `referral-program` — referral system design
- `churn-prevention` — retention strategies
- `lead-research-assistant` — lead identification
- `artifacts-builder` — complex UI artifacts
- `brand-guidelines` — PraxisNova/PraxisAcademy brand colors and typography
- `competitive-ads-extractor` — competitor ad analysis
- `content-research-writer` — research-backed content

**To use a skill**: `Skill: content-research-writer` or `Skill: artifacts-builder`

## Key Features
- AI-powered content generation (text)
- Google Gemini image generation
- Content templates (blog posts, landing pages, email, social)
- Batch processing for bulk content creation
- Brand compliance checking
- Content scheduling and publication queues
- Multi-format export (Markdown, HTML, images)
- Analytics integration (track content performance)

## Integration Details
- **Google Gemini API**: Image generation, content enhancement, copywriting
- **Content Storage**: Configured in `.env.local`
- **Publishing Channels**: Direct integration or export to marketing platforms
- **Brand Guidelines**: Automated compliance checks

## Directory Structure
- `/src` - Next.js app, components, API routes
- `/public` - Static assets, templates
- `/.claude/skills/` - Available skills for this project

## Development Notes
- Gemini API credentials in `.env.local` (not tracked)
- Content templates stored in database or `/public`
- Batch job processing for large content volumes
- Rate limiting for API calls
- Content versioning and approval workflows
- Image generation parameters (size, style, quality)
- Output formats: JSON, Markdown, HTML, PNG/JPG
