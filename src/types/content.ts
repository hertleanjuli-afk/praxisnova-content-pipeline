export type OutputFormat = 'linkedin-post' | 'facebook-post' | 'newsletter' | 'karussell' | 'thread'

export type Branche = 'bau' | 'handwerk' | 'immobilien' | 'allgemein'

export interface GenerateRequest {
  input: string
  branche: Branche
  formats: OutputFormat[]
  tone: 'professionell' | 'locker' | 'inspirierend'
}

export interface GeneratedContent {
  format: OutputFormat
  title: string
  content: string
  charCount: number
  hashtags?: string[]
}

export interface GenerateResponse {
  results: GeneratedContent[]
  imageUrl?: string
}

export const FORMAT_LABELS: Record<OutputFormat, string> = {
  'linkedin-post': 'LinkedIn-Post',
  'facebook-post': 'Facebook-Post',
  'newsletter': 'Newsletter-Text',
  'karussell': 'Karussell-Texte',
  'thread': 'LinkedIn-Thread',
}

export const FORMAT_DESCRIPTIONS: Record<OutputFormat, string> = {
  'linkedin-post': 'Ein einzelner LinkedIn-Post mit Hook, Inhalt und CTA (max. 3.000 Zeichen)',
  'facebook-post': 'Ein Facebook-Post, kürzer und lockerer als LinkedIn (max. 500 Zeichen)',
  'newsletter': 'E-Mail-Newsletter-Text für Brevo mit Betreffzeile und Inhalt',
  'karussell': 'Slide-Texte für den Karussell-Generator (Cover + 5 Slides + CTA)',
  'thread': 'LinkedIn-Thread mit 3-5 zusammenhängenden Posts',
}

export const BRANCHE_LABELS: Record<Branche, string> = {
  'bau': 'Bauunternehmen',
  'handwerk': 'Handwerksbetriebe',
  'immobilien': 'Immobilienmakler',
  'allgemein': 'Allgemein / KMU',
}

export const TONE_LABELS: Record<string, string> = {
  'professionell': 'Professionell',
  'locker': 'Locker und nahbar',
  'inspirierend': 'Inspirierend',
}
