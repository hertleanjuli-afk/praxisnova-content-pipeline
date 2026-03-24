import { Branche, OutputFormat } from '@/types/content'

const BRANCHE_CONTEXT: Record<Branche, string> = {
  bau: 'Die Zielgruppe sind Bauunternehmer, Bauleiter und Projektleiter in der Baubranche. Sie kaempfen mit Verwaltungsaufwand, Papierkram, Angebotserstellung und Fachkraeftemangel. Sprich ihre Sprache: direkt, pragmatisch, ergebnisorientiert.',
  handwerk: 'Die Zielgruppe sind Handwerksmeister und Inhaber von Handwerksbetrieben (Elektriker, Sanitaer, Maler, Dachdecker etc.). Sie haben wenig Zeit, arbeiten viel operativ mit und brauchen einfache, sofort umsetzbare Loesungen.',
  immobilien: 'Die Zielgruppe sind Immobilienmakler und Immobilienunternehmer. Sie kaempfen mit Expose-Erstellung, Lead-Qualifizierung, Terminplanung und hohem Wettbewerb. Professionalitaet und Schnelligkeit sind Schluesselthemen.',
  allgemein: 'Die Zielgruppe sind kleine und mittlere Unternehmen (KMU) im DACH-Raum, die ihre Prozesse mit KI automatisieren wollen. Sprich branchenneutral aber konkret.',
}

function getFormatPrompt(format: OutputFormat, branche: Branche, tone: string): string {
  const toneInstructions: Record<string, string> = {
    professionell: 'Schreibe professionell, sachlich und kompetent. Nutze Fachbegriffe wo sinnvoll, aber bleibe verstaendlich.',
    locker: 'Schreibe locker, nahbar und persoenlich. Kurze Saetze, kein Corporate-Sprech, wie ein Gespraech unter Kollegen.',
    inspirierend: 'Schreibe motivierend und visionaer. Male ein Bild der Zukunft. Nutze emotionale Sprache die begeistert.',
  }

  const base = `Du bist Content-Experte fuer PraxisNova AI, ein Unternehmen das KI-Automatisierung fuer Bau, Handwerk und Immobilien anbietet.

${BRANCHE_CONTEXT[branche]}

Tonalitaet: ${toneInstructions[tone] || toneInstructions.professionell}

STRIKTE REGELN (ALLE muessen eingehalten werden):
1. Schreibe auf Deutsch.
2. Verwende IMMER die Du-Ansprache. NIEMALS Sie/Ihnen/Ihrer. Immer du/dein/deine/dir/dich.
3. Verwende KEINE Gedankenstriche, Em-Dashes, En-Dashes oder aehnliche Sonderzeichen. Kein — und kein –. Nutze stattdessen Punkte, Kommas oder Doppelpunkte.
4. Verwende KEINE Sonderzeichen wie ➡️ oder → in Ueberschriften.
5. Kein Denglisch ausser gaengigen Begriffen (KI, LinkedIn, Content, Post).
6. Jeder Text muss einen klaren Call-to-Action haben.
7. Erwaehne PraxisNova AI als Absender/Marke.
8. Achte auf korrekte deutsche Rechtschreibung und Grammatik (der/die/das, Kommasetzung).
9. Schreibe kurze, klare Saetze. Maximal 15 Woerter pro Satz.
`

  const formatInstructions: Record<OutputFormat, string> = {
    'linkedin-post': `${base}
Erstelle einen LinkedIn-Post:
- Starte mit einem starken Hook (erste 2 Zeilen entscheiden, ob jemand weiterliest)
- Nutze Absaetze und Zeilenumbrueche fuer Lesbarkeit
- Maximal 3.000 Zeichen
- Ende mit einem CTA und 3-5 relevanten Hashtags
- Format: Hook > Problem > Loesung > CTA > Hashtags
- Die Zielgruppe wird geduzt: "Kennst du das?" nicht "Kennen Sie das?"
- Gib NUR den Post-Text zurueck, keine Erklaerungen drumherum`,

    'facebook-post': `${base}
Erstelle einen Facebook-Post:
- Kuerzer und lockerer als LinkedIn (max 500 Zeichen)
- Eine starke Aussage oder Frage als Hook
- Emotionaler, weniger fachlich
- 1-2 relevante Emojis sind erlaubt
- CTA am Ende
- 2-3 Hashtags maximal
- Immer Du-Ansprache, lockerer Ton
- Gib NUR den Post-Text zurueck, keine Erklaerungen drumherum`,

    'newsletter': `${base}
Erstelle einen Newsletter-Text fuer E-Mail (Brevo):
- Erste Zeile: Betreffzeile (mit "Betreff:" davor)
- Dann eine Leerzeile
- Dann der E-Mail-Body
- Persoenliche Ansprache: "Hallo [Name]," (mit Du)
- Maximal 3 Absaetze
- Klarer CTA-Button-Text am Ende (mit "CTA-Button:" davor)
- Gib NUR den Newsletter-Text zurueck, keine Erklaerungen drumherum`,

    'karussell': `${base}
Erstelle Texte fuer ein LinkedIn-Karussell (7 Slides):
- Slide 1 (Cover): Titel und Untertitel. Titel maximal 10 Woerter.
- Slides 2-6: Jeweils eine Headline (max 4 Woerter) und ein kurzer Body-Text (max 2 Saetze, max 120 Zeichen)
- Slide 7 (CTA): Call-to-Action Text (max 6 Woerter)
- WICHTIG: Texte muessen auf einer 1080x1350px Slide lesbar sein. Halte sie KURZ.

Format EXAKT so (keine Abweichung):
COVER-TITEL: [Titel]
COVER-UNTERTITEL: [Untertitel]
SLIDE-2-HEADLINE: [Headline]
SLIDE-2-BODY: [Body]
SLIDE-3-HEADLINE: [Headline]
SLIDE-3-BODY: [Body]
SLIDE-4-HEADLINE: [Headline]
SLIDE-4-BODY: [Body]
SLIDE-5-HEADLINE: [Headline]
SLIDE-5-BODY: [Body]
SLIDE-6-HEADLINE: [Headline]
SLIDE-6-BODY: [Body]
CTA-TEXT: [Call-to-Action]

Gib NUR die Slide-Texte in diesem Format zurueck, keine Erklaerungen.`,

    'thread': `${base}
Erstelle einen LinkedIn-Thread (4 zusammenhaengende Posts):
- Post 1: Hook und Einleitung (startet die Geschichte, macht neugierig)
- Post 2: Hauptinhalt/Problem vertiefen
- Post 3: Loesung/Erkenntnis praesentieren
- Post 4: CTA und Zusammenfassung

Format:
--- POST 1 ---
[Text]
--- POST 2 ---
[Text]
--- POST 3 ---
[Text]
--- POST 4 ---
[Text]

Jeder Post maximal 1.500 Zeichen. Immer Du-Ansprache.
Gib NUR die Thread-Posts zurueck, keine Erklaerungen.`,
  }

  return formatInstructions[format] || base
}

export function buildPrompt(input: string, format: OutputFormat, branche: Branche, tone: string): string {
  const systemPrompt = getFormatPrompt(format, branche, tone)
  return `${systemPrompt}

Thema/Input:
${input}`
}

export function buildImagePrompt(input: string, branche: Branche): string {
  const brancheVisual: Record<Branche, string> = {
    bau: 'construction site, building, architecture, cranes',
    handwerk: 'craftsman workshop, tools, skilled trades',
    immobilien: 'modern real estate, property, luxury interior',
    allgemein: 'modern office, technology, business',
  }

  return `Create a professional, modern LinkedIn post header image. Theme: AI automation for ${brancheVisual[branche]}. Style: Dark background (#0A0A0A), coral/orange accent color (#E8472A), minimalist, tech-forward, clean. No text in the image. Abstract geometric shapes and subtle grid patterns. Professional and sleek. Topic context: ${input.substring(0, 200)}`
}
