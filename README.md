# PraxisNova AI – Content-Pipeline

Ein Thema rein, 5 Formate raus. KI-gesteuerte Content-Erstellung für LinkedIn, Facebook, Newsletter und mehr.

## Features

- **5 Ausgabeformate**: LinkedIn-Post, Facebook-Post, Newsletter, Karussell-Texte, LinkedIn-Thread
- **4 Branchen**: Bau, Handwerk, Immobilien, Allgemein/KMU
- **3 Tonalitäten**: Professionell, Locker, Inspirierend
- **KI-Bildgenerierung**: Pollinations.ai (kostenlos) mit Together.ai FLUX.1 Fallback
- **A/B-Varianten**: Automatische Hook-Alternativen für jeden Content
- **Zeichenlimit-Warnungen**: Pro Format mit Optimierungstipps
- **Copywriting-Frameworks**: PAS (LinkedIn), AIDA (Newsletter), Story Arc (Karussell)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript / Tailwind CSS
- Gemini 2.5 Flash (Textgenerierung)
- Pollinations.ai (Bildgenerierung, kostenlos)
- Together.ai FLUX.1-schnell (Bild-Fallback, optional)

## Setup

```bash
npm install
cp .env.example .env.local   # Werte ausfüllen
npm run dev                   # http://localhost:3000
```

## Umgebungsvariablen

| Variable | Beschreibung | Pflicht |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API Key (Textgenerierung) | Nein (kann in UI eingegeben werden) |
| `TOGETHER_API_KEY` | Together.ai Key (Bild-Fallback) | Nein |

## Projektstruktur

```
src/
  app/
    page.tsx                    – UI (Input + Output Cards)
    api/generate/route.ts       – Text-Generierung (Gemini)
    api/generate-image/route.ts – Bild-Generierung (Pollinations/Together)
  components/
    OutputCard.tsx              – Ergebnis-Karte mit Copy, Regenerate, A/B
  lib/
    gemini.ts                   – Gemini API + Pollinations + Together.ai
    prompts.ts                  – Alle Content-Prompts (PAS, AIDA, Story Arc)
  types/
    content.ts                  – TypeScript Types + Format-Labels
```

## Brand-Farben

| Element | Hex |
|---------|-----|
| Hintergrund | #0A0A0A |
| Akzent (Coral) | #E8472A |
| Karten | #111111 |
