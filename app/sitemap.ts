import { MetadataRoute } from 'next'

const baseUrl = 'https://www.groupxam.com'

const primaryPages = [
  '',
  '/about',
  '/subscription',
  '/services',
  '/contact',
  '/login',
  '/signup',
  '/faq',
  '/privacy-policy',
  '/terms-of-use',
  '/testimonials',
]

const learningHubs = [
  '/exams',
  '/exams/jamb',
  '/exams/waec',
  '/exams/wassce',
  '/quiz',
  '/flashcards',
  '/discussions',
  '/whiteboard',
  '/calculator',
  '/calculator/scientific',
  '/calculator/programming',
  '/calculator/graphing',
  '/calculator/converter',
  '/calculator/finance',
  '/calculator/physics',
]

const studyTools = [
  '/quiz/mathematics',
  '/quiz/english',
  '/quiz/physics',
  '/quiz/chemistry',
  '/quiz/biology',
  '/flashcards/mathematics',
  '/flashcards/english',
  '/flashcards/physics',
  '/flashcards/chemistry',
  '/flashcards/biology',
]

const retentionSensitivePages = ['/chatbot']

const pagePriorities: Record<string, number> = {
  '': 1,
  '/subscription': 0.9,
  '/exams': 0.9,
  '/chatbot': 0.9,
}

const pageFrequencies: Record<string, MetadataRoute.Sitemap[0]['changeFrequency']> = {
  '': 'daily',
  '/discussions': 'daily',
  '/subscription': 'weekly',
  '/exams': 'weekly',
  '/exams/jamb': 'weekly',
  '/exams/waec': 'weekly',
  '/exams/wassce': 'weekly',
  '/quiz': 'weekly',
  '/flashcards': 'weekly',
  '/whiteboard': 'weekly',
  '/calculator': 'weekly',
  '/chatbot': 'weekly',
}

function buildEntry(path: string, lastModified: Date): MetadataRoute.Sitemap[0] {
  const priority = pagePriorities[path] ?? (path.startsWith('/calculator') ? 0.7 : 0.6)
  const changeFrequency = pageFrequencies[path] ?? (path ? 'monthly' : 'daily')

  return {
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const allPaths = new Set<string>([...primaryPages, ...learningHubs, ...studyTools, ...retentionSensitivePages])

  return Array.from(allPaths).map((path) => buildEntry(path, now))
}