import { Branche, OutputFormat } from '@/types/content'

const BRANCHE_CONTEXT: Record<Branche, string> = {
  bau: 'Die Zielgruppe sind Bauunternehmer, Bauleiter und Projektleiter in der Baubranche. Sie kämpfen mit Verwaltungsaufwand, Papierkram, Angebotserstellung und Fachkräftemangel. Laut KfW-Studie verbringen Bau-KMU 8,1% ihrer Arbeitszeit mit Bürokratie, das sind rund 8 Stunden pro Woche. Sprich ihre Sprache: direkt, pragmatisch, ergebnisorientiert. Nutze Beispiele wie Wochenberichte, Angebotserstellung und Baustellendokumentation.',
  handwerk: 'Die Zielgruppe sind Handwerksmeister und Inhaber von Handwerksbetrieben (Elektriker, Sanitär, Maler, Dachdecker etc.). Sie haben wenig Zeit, arbeiten viel operativ mit und brauchen einfache, sofort umsetzbare Lösungen. Typische Schmerzpunkte: Terminplanung, Kundenkommunikation, Rechnungsstellung. Betone Zeitersparnis und Einfachheit.',
  immobilien: 'Die Zielgruppe sind Immobilienmakler und Immobilienunternehmer. Sie kämpfen mit Exposé-Erstellung, Lead-Qualifizierung, Terminplanung und hohem Wettbewerb. Professionalität und Schnelligkeit sind Schlüsselthemen. Betone: Mehr Abschlüsse, weniger Verwaltung, schnellere Exposés.',
  allgemein: 'Die Zielgruppe sind kleine und mittlere Unternehmen (KMU) im DACH-Raum, die ihre Prozesse mit KI automatisieren wollen. Sprich branchenneutral aber konkret. Nutze universelle Schmerzpunkte: Zeitfresser, manuelle Prozesse, fehlende Skalierbarkeit.',
}

function getFormatPrompt(format: OutputFormat, branche: Branche, tone: string): string {
  const toneInstructions: Record<string, string> = {
    professionell: 'Schreibe professionell, sachlich und kompetent. Nutze Fachbegriffe wo sinnvoll, aber bleibe verständlich.',
    locker: 'Schreibe locker, nahbar und persönlich. Kurze Sätze, kein Corporate-Sprech, wie ein Gespräch unter Kollegen.',
    inspirierend: 'Schreibe motivierend und visionär. Male ein Bild der Zukunft. Nutze emotionale Sprache die begeistert.',
  }

  const base = `Du bist Content-Experte für PraxisNova AI, ein Unternehmen das KI-Automatisierung für Bau, Handwerk und Immobilien anbietet.

${BRANCHE_CONTEXT[branche]}

Tonalität: ${toneInstructions[tone] || toneInstructions.professionell}

HORMOZI-FRAMEWORK (Wertgleichung beachten):
- Zeige das Traumergebnis konkret: Was erreicht die Zielgruppe? (z.B. "8 Stunden pro Woche gespart", basierend auf KfW-Studie)
- Ergebnis-Wahrscheinlichkeit erhöhen: Nutze konkrete Zahlen, Fallbeispiele, Ergebnisse anderer Kunden.
- Zeitaufwand minimieren: Betone Schnelligkeit ("In 30 Minuten eingerichtet", "Ab Tag 1 Ergebnisse").
- Aufwand minimieren: Betone Einfachheit ("Keine IT-Kenntnisse nötig", "Wir richten alles ein").
- Risiko-Umkehr einbauen: "Kostenlose Erstberatung", "Kein Risiko", "Erst testen, dann entscheiden".
- Konkrete Zahlen statt vager Versprechen: "8 Stunden pro Woche" statt "viel Zeit". Referenzwerte: KMU verlieren durchschnittlich 32 Stunden/Monat an Bürokratie (KfW-Studie), Baubranche sogar 8,1% der Arbeitszeit.

STRIKTE REGELN (ALLE müssen eingehalten werden):
1. Schreibe auf Deutsch.
2. Verwende IMMER die Du-Ansprache. NIEMALS Sie/Ihnen/Ihrer. Immer du/dein/deine/dir/dich.
3. Verwende KEINE Gedankenstriche, Em-Dashes, En-Dashes oder ähnliche Sonderzeichen. Kein — und kein –. Nutze stattdessen Punkte, Kommas oder Doppelpunkte.
4. Verwende KEINE Sonderzeichen wie ➡️ oder → in Überschriften.
5. Kein Denglisch außer gängigen Begriffen (KI, LinkedIn, Content, Post).
6. Jeder Text muss einen klaren Call-to-Action haben.
7. Erwähne PraxisNova AI als Absender/Marke.
8. Achte auf korrekte deutsche Rechtschreibung und Grammatik (der/die/das, Kommasetzung).
9. Schreibe kurze, klare Sätze. Maximal 15 Wörter pro Satz.
10. Nutze die Problem-Agitation-Lösung Struktur: Problem benennen, Schmerz verstärken, dann Lösung zeigen.
`

  const formatInstructions: Record<OutputFormat, string> = {
    'linkedin-post': `${base}
Erstelle einen LinkedIn-Post:
- Starte mit einem starken Hook (erste 2 Zeilen entscheiden, ob jemand weiterliest)
- Hook-Typen: provokante Frage, überraschende Zahl, konträre Meinung, persönliche Geschichte
- Nutze Absätze und Zeilenumbrüche für Lesbarkeit
- Maximal 3.000 Zeichen
- Struktur: Hook > Problem benennen > Schmerz verstärken (was kostet es, NICHT zu handeln?) > Lösung mit konkretem Ergebnis > CTA mit Risiko-Umkehr > Hashtags
- Baue mindestens eine konkrete Zahl ein (Zeitersparnis, Kostenersparnis, Prozent)
- CTA mit niedrigem Risiko: "Kostenlose Beratung", "Unverbindlich testen"
- 3-5 relevante Hashtags
- Die Zielgruppe wird geduzt: "Kennst du das?" nicht "Kennen Sie das?"
- Gib NUR den Post-Text zurück, keine Erklärungen drumherum`,

    'facebook-post': `${base}
Erstelle einen Facebook-Post:
- Kürzer und lockerer als LinkedIn (max 500 Zeichen)
- Eine starke Aussage oder Frage als Hook
- Emotionaler, weniger fachlich
- 1-2 relevante Emojis sind erlaubt
- CTA am Ende
- 2-3 Hashtags maximal
- Immer Du-Ansprache, lockerer Ton
- Gib NUR den Post-Text zurück, keine Erklärungen drumherum`,

    'newsletter': `${base}
Erstelle einen Newsletter-Text für E-Mail (Brevo):
- Erste Zeile: Betreffzeile (mit "Betreff:" davor). Betreff muss neugierig machen, max. 50 Zeichen.
- Dann eine Leerzeile
- Dann der E-Mail-Body
- Persönliche Ansprache: "Hallo [Name]," (mit Du)
- Absatz 1: Problem ansprechen, Empathie zeigen ("Kennst du das?")
- Absatz 2: Lösung präsentieren mit konkretem Ergebnis (Zahlen, Zeitersparnis)
- Absatz 3: Risiko-Umkehr und CTA ("Kostenlos", "Unverbindlich", "In 15 Minuten")
- Klarer CTA-Button-Text am Ende (mit "CTA-Button:" davor)
- Gib NUR den Newsletter-Text zurück, keine Erklärungen drumherum`,

    'karussell': `${base}
Erstelle Texte für ein LinkedIn-Karussell (7 Slides):
- Slide 1 (Cover): Titel und Untertitel. Titel maximal 10 Wörter.
- Slides 2-6: Jeweils eine Headline (max 4 Wörter) und ein kurzer Body-Text (max 2 Sätze, max 120 Zeichen)
- Slide 7 (CTA): Call-to-Action Text (max 6 Wörter)
- WICHTIG: Texte müssen auf einer 1080x1350px Slide lesbar sein. Halte sie KURZ.

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

Gib NUR die Slide-Texte in diesem Format zurück, keine Erklärungen.`,

    'thread': `${base}
Erstelle einen LinkedIn-Thread (4 zusammenhängende Posts):
- Post 1: Starker Hook mit überraschender Zahl oder konträrer Aussage. Macht neugierig.
- Post 2: Problem vertiefen. Was kostet es, NICHT zu handeln? Konkreter Schmerz mit Zahlen.
- Post 3: Lösung präsentieren mit Fallbeispiel oder konkretem Ergebnis (Zeitersparnis, ROI).
- Post 4: CTA mit Risiko-Umkehr ("Kostenlose Beratung", "Kein Risiko") und Zusammenfassung.

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
Gib NUR die Thread-Posts zurück, keine Erklärungen.`,
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
