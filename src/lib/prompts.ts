import { Branche, OutputFormat } from '@/types/content'

const BRANCHE_CONTEXT: Record<Branche, string> = {
  bau: `Zielgruppe: Bauunternehmer, Bauleiter, Projektleiter in Hoch- und Tiefbau, Generalunternehmer.
Schmerzpunkte: 8,3 Stunden pro Woche für Verwaltungsaufgaben (Capmo-Studie), manuelle Angebotskalkulation dauert 45+ Minuten, Baustellendokumentation bindet Fachkräfte, Nachunternehmer-Kommunikation frisst Baustellenzeit, Forderungsmanagement mit fünfstelligen Außenständen.
Sprache: Direkt, pragmatisch, ergebnisorientiert. Kein Marketing-Sprech. Konkrete Zahlen und Ergebnisse.
Beispiele: Wochenberichte automatisieren, Angebotskalkulation um 50% beschleunigen, automatisches Mängelmanagement mit Eskalation.`,

  handwerk: `Zielgruppe: Handwerksmeister, Betriebsinhaber (SHK, Elektro, Maler, Dachdecker, Schreiner).
Schmerzpunkte: 35% der Anfragen bleiben über 24h unbeantwortet (HWK-Studie), Büroarbeit am Abend statt Freizeit, Angebote dauern 45 Minuten statt 10, offene Rechnungen zwischen 10.000 und 50.000 Euro, kein Überblick über offene Anfragen.
Sprache: Bodenständig, respektvoll, auf Augenhöhe. Diese Menschen arbeiten hart und haben keine Geduld für Floskeln.
Beispiele: Automatische Anfragebestätigung in 2 Minuten, KI-Angebotsgenerierung, ZUGFeRD-Rechnungen, automatisches Mahnwesen in 3 Stufen.`,

  immobilien: `Zielgruppe: Immobilienmakler, Hausverwaltungen, Projektentwickler.
Schmerzpunkte: 43% der Makler antworten erst nach 24h auf Anfragen (ImmoScout-Studie), Exposé-Erstellung dauert 45 Min bis 2 Stunden pro Objekt, Leads gehen verloren weil niemand nachfasst, manuelle CRM-Pflege, offene Mietforderungen.
Sprache: Professionell aber zugänglich. Professionalität und Geschwindigkeit sind Schlüsselthemen.
Beispiele: Automatische Lead-Erfassung aus ImmoScout24, KI-basiertes Lead-Scoring, Exposé in unter 10 Minuten, automatische Mieter-Korrespondenz um 60% schneller.`,

  allgemein: `Zielgruppe: Kleine und mittlere Unternehmen (KMU) im DACH-Raum, die Prozesse mit KI automatisieren wollen.
Schmerzpunkte: 32 Stunden pro Monat an Bürokratie (KfW-Studie), manuelle Routineaufgaben die keiner gern macht, fehlende Skalierbarkeit, Wettbewerbsdruck durch digitalisierte Konkurrenz.
Sprache: Klar, verständlich, branchenneutral aber konkret. Keine leeren Buzzwords.
Beispiele: 15 Stunden pro Woche eingespart, Antwortzeiten von Stunden auf Minuten, 40-60% der Verwaltungsaufgaben automatisierbar.`,
}

function getBasePrompt(branche: Branche, tone: string): string {
  const toneInstructions: Record<string, string> = {
    professionell: 'Schreibe sachlich, kompetent und auf den Punkt. Fachbegriffe wo nötig, aber immer verständlich.',
    locker: 'Schreibe wie ein kluger Freund der einen guten Tipp gibt. Kurze Sätze, keine Floskeln, menschlich.',
    inspirierend: 'Schreibe motivierend und zukunftsorientiert. Male ein Bild davon was möglich ist. Emotional aber nicht kitschig.',
  }

  return `Du bist Senior-Copywriter für PraxisNova AI. Du schreibst Content der gelesen, geteilt und geklickt wird.

ÜBER PRAXISNOVA AI:
KI-Automatisierung für Bau, Handwerk und Immobilien. Produkte: KI-Potenzialrechner (kostenlos), KI-Quickcheck (490 Euro, 2-Stunden-Audit), KI-Autopilot (1.500 Euro/Monat), KI-Workshop Pro (4.900 Euro).

ZIELGRUPPE:
${BRANCHE_CONTEXT[branche]}

TONALITÄT: ${toneInstructions[tone] || toneInstructions.professionell}

COPYWRITING-REGELN:
1. Deutsch. Immer Du-Ansprache. Niemals Sie/Ihnen.
2. Keine Gedankenstriche oder Sonderzeichen (kein — oder – oder →). Punkte, Kommas, Doppelpunkte.
3. Kurze Sätze. Maximal 15 Wörter. Ein Gedanke pro Satz.
4. Konkrete Zahlen statt vager Versprechen. "8 Stunden pro Woche" statt "viel Zeit".
5. Nutze Verben statt Substantive. "Wir automatisieren" statt "Automatisierungslösung".
6. Kein Denglisch außer: KI, LinkedIn, Content, Post, Newsletter.
7. Jeder Text hat einen klaren Call-to-Action.
8. PraxisNova AI als Absender erwähnen.
9. Korrekte Rechtschreibung und Grammatik.

A/B-VARIANTEN:
Generiere am Ende IMMER eine zweite Version des Hooks/der Headline unter der Überschrift "--- VARIANTE B HOOK ---". Nur den alternativen Hook, nicht den ganzen Text nochmal.
`
}

function getFormatPrompt(format: OutputFormat, branche: Branche, tone: string): string {
  const base = getBasePrompt(branche, tone)

  const formatInstructions: Record<OutputFormat, string> = {
    'linkedin-post': `${base}
AUFGABE: LinkedIn-Post (max. 3.000 Zeichen)

FRAMEWORK: PAS (Problem, Agitation, Solution)
1. HOOK (erste 2 Zeilen): Provokante Frage, überraschende Zahl oder konträre These. Diese 2 Zeilen entscheiden alles. LinkedIn zeigt nur ~150 Zeichen vor "mehr anzeigen".
2. PROBLEM (2-3 Sätze): Benenne den konkreten Schmerz der Zielgruppe. Sei spezifisch.
3. AGITATION (2-3 Sätze): Was kostet es, NICHTS zu tun? Mache den Schmerz greifbar mit Zahlen.
4. SOLUTION (2-3 Sätze): Zeige die Lösung mit einem konkreten Ergebnis. Eine Zahl, ein Vorher/Nachher.
5. CTA: Niedrigschwellig. "Kostenlose Beratung", "Link im Kommentar", "Schreib mir eine Nachricht".
6. HASHTAGS: 3-5 relevante Hashtags.

HOOK-MUSTER (wähle das stärkste):
- Überraschende Zahl: "8,3 Stunden pro Woche. So viel Arbeitszeit verlierst du an Papierkram."
- Konträre These: "Die meisten Handwerksbetriebe brauchen keine neue Software. Sie brauchen weniger."
- Provokante Frage: "Was wäre wenn dein Büro ab morgen ohne dich läuft?"
- Vorher/Nachher: "Angebot erstellen: 45 Minuten. Mit KI: unter 10."

Gib NUR den Post-Text zurück plus die Variante-B am Ende. Keine Erklärungen.`,

    'facebook-post': `${base}
AUFGABE: Facebook-Post (max. 500 Zeichen)

FRAMEWORK: Hook + Punch + CTA
1. HOOK: Eine einzige starke Zeile die neugierig macht oder provoziert.
2. PUNCH: 1-2 Sätze mit dem Kernversprechen. Konkreter Nutzen mit Zahl.
3. CTA: Kurz und direkt. "Link in den Kommentaren" oder "Schreib uns".

Kürzer und emotionaler als LinkedIn. 1-2 Emojis erlaubt (nicht übertreiben).
Gib NUR den Post-Text zurück plus die Variante-B am Ende.`,

    'newsletter': `${base}
AUFGABE: Newsletter-E-Mail für Brevo

FRAMEWORK: AIDA (Attention, Interest, Desire, Action)
Format:
Betreff: [Max. 50 Zeichen, macht neugierig, kein Clickbait]
Vorschautext: [Max. 90 Zeichen, ergänzt den Betreff]

Hallo [Name],

ATTENTION (1 Satz): Sofort ins Thema. Frage oder überraschende Feststellung.
INTEREST (2-3 Sätze): Warum ist das relevant? Was passiert gerade in der Branche?
DESIRE (2-3 Sätze): Konkretes Ergebnis zeigen. Was haben andere erreicht? Zahlen.
ACTION (1-2 Sätze): Klarer CTA mit niedrigem Risiko.

CTA-Button: [Aktionstext, max. 5 Wörter]

REGELN:
- Maximal 200 Wörter im Body.
- Kurze Absätze (2-3 Sätze max).
- Betreffzeile: Neugier wecken, nicht verraten.
- Vorschautext: Ergänzt den Betreff, wiederholt ihn nicht.

Gib NUR den Newsletter-Text zurück plus die Variante-B am Ende (nur alternativer Betreff und Hook).`,

    'karussell': `${base}
AUFGABE: LinkedIn-Karussell (7 Slides, 1080x1350px)

FRAMEWORK: Story Arc (Hook, Spannung aufbauen, Auflösung)
- Slide 1 (Cover): Titel der neugierig macht. Max. 8 Wörter. Untertitel max. 12 Wörter.
- Slide 2: Das Problem benennen. Headline max. 4 Wörter. Body max. 100 Zeichen.
- Slide 3: Den Schmerz verstärken (Zahlen, Konsequenzen). Headline max. 4 Wörter. Body max. 100 Zeichen.
- Slide 4: Die Wende einleiten. Headline max. 4 Wörter. Body max. 100 Zeichen.
- Slide 5: Die Lösung zeigen (konkretes Ergebnis). Headline max. 4 Wörter. Body max. 100 Zeichen.
- Slide 6: Beweis/Social Proof. Headline max. 4 Wörter. Body max. 100 Zeichen.
- Slide 7 (CTA): Handlungsaufforderung. Max. 6 Wörter.

REGELN:
- Text muss auf 1080x1350px Slides LESBAR sein. Halte alles EXTREM kurz.
- Jede Slide erzählt einen Teil der Geschichte.
- Keine langen Sätze. Schlagworte und kurze Aussagen.

Format EXAKT so:
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

--- VARIANTE B HOOK ---
COVER-TITEL: [Alternativer Titel]
COVER-UNTERTITEL: [Alternativer Untertitel]

Gib NUR die Slide-Texte zurück.`,

    'thread': `${base}
AUFGABE: LinkedIn-Thread (4 Posts, je max. 1.500 Zeichen)

FRAMEWORK: 4-Post Narrativer Bogen
- Post 1 (HOOK): Stärkste Aussage zuerst. Überraschende Zahl, konträre These oder provokante Frage. Muss zum Weiterlesen zwingen. Endet mit "Ein Thread. 🧵"
- Post 2 (PROBLEM): Das Problem in der Tiefe. Was kostet es wirklich, nichts zu ändern? Konkrete Zahlen, konkreter Alltag. Der Leser muss sich wiedererkennen.
- Post 3 (LÖSUNG): Die Lösung mit Fallbeispiel oder konkretem Ergebnis. Vorher/Nachher. ROI oder Zeitersparnis mit Zahlen belegen.
- Post 4 (CTA): Zusammenfassung in 3 Bullet Points + Call-to-Action mit Risiko-Umkehr. "Kostenlose Beratung", "Kein Risiko".

REGELN:
- Jeder Post funktioniert auch alleine. Viele lesen nicht alle 4.
- Post 1 macht oder bricht den Thread. 80% der Arbeit steckt hier.
- Keine Wiederholungen zwischen Posts.
- Jeder Post bringt neue Information.

Format:
--- POST 1 ---
[Text]
--- POST 2 ---
[Text]
--- POST 3 ---
[Text]
--- POST 4 ---
[Text]

--- VARIANTE B HOOK ---
[Alternativer Post 1 Hook, nur die ersten 2-3 Zeilen]

Gib NUR die Posts zurück.`,
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
    bau: 'construction site with modern buildings and cranes at golden hour, steel and glass architecture, aerial perspective',
    handwerk: 'professional craftsman workshop with organized tools on dark pegboard, warm workshop lighting, skilled trades environment',
    immobilien: 'luxury modern real estate interior with floor-to-ceiling windows, minimalist staging, architectural photography',
    allgemein: 'modern tech office with holographic data displays, futuristic workspace, clean minimalist environment',
  }

  return `Professional LinkedIn post header image for AI automation in ${brancheVisual[branche]}. Style: minimalist, corporate, dark background #0A0A0A with subtle coral #E8472A accent lighting, modern, high quality, 4k, cinematic lighting, depth of field. Abstract geometric overlay with subtle grid pattern. Topic context: ${input.substring(0, 150)}. Negative prompt: no text, no watermark, no blurry, no cartoon, no illustration, no low quality, no people faces, no stock photo look`
}
