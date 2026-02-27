// ─── Types ───────────────────────────────────────────────────────────────

export interface CategoryScore {
  name: string;
  score: number;
  maxScore: number;
  description: string;
}

export interface AnalysisResult {
  totalScore: number;
  categories: CategoryScore[];
  suggestions: string[];
}

// ─── Constants ───────────────────────────────────────────────────────────

const STRONG_ACTION_VERBS = [
  'achieved', 'accelerated', 'accomplished', 'administered', 'advanced',
  'analyzed', 'architected', 'automated', 'boosted', 'built',
  'championed', 'consolidated', 'coordinated', 'created', 'cultivated',
  'decreased', 'delivered', 'designed', 'developed', 'directed',
  'doubled', 'drove', 'eliminated', 'engineered', 'established',
  'exceeded', 'executed', 'expanded', 'facilitated', 'generated',
  'grew', 'headed', 'implemented', 'improved', 'increased',
  'initiated', 'innovated', 'introduced', 'launched', 'led',
  'managed', 'maximized', 'mentored', 'modernized', 'negotiated',
  'optimized', 'orchestrated', 'overhauled', 'partnered', 'pioneered',
  'produced', 'propelled', 'reduced', 'reformed', 'resolved',
  'revamped', 'scaled', 'secured', 'simplified', 'spearheaded',
  'streamlined', 'strengthened', 'supervised', 'surpassed', 'transformed',
  'tripled', 'unified', 'upgraded',
];

const REQUIRED_SECTIONS = [
  'experience', 'education', 'skills', 'summary', 'objective',
  'projects', 'certifications', 'contact', 'professional summary',
  'work experience', 'technical skills',
];

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'is', 'was', 'are', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'shall', 'can', 'this', 'that', 'these',
  'those', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she',
  'it', 'they', 'them', 'its', 'his', 'her', 'their', 'as', 'from',
  'not', 'so', 'if', 'then', 'than', 'also', 'about', 'up', 'out',
  'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
]);

// ─── Scoring Functions ──────────────────────────────────────────────────

function scoreLength(text: string): { score: number; suggestion: string | null } {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const count = words.length;

  if (count < 100) return { score: 3, suggestion: 'Your resume is very short. Aim for 300–800 words to provide enough detail.' };
  if (count < 200) return { score: 6, suggestion: 'Your resume could use more content. Target at least 300 words.' };
  if (count < 300) return { score: 10, suggestion: 'Consider adding a bit more detail to reach the ideal 300–800 word range.' };
  if (count <= 800) return { score: 15, suggestion: null };
  if (count <= 1000) return { score: 12, suggestion: 'Your resume is slightly long. Consider trimming to under 800 words for conciseness.' };
  return { score: 7, suggestion: 'Your resume is too long. Keep it under 800 words to maintain recruiter attention.' };
}

function scoreBullets(text: string): { score: number; suggestion: string | null } {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 0) return { score: 0, suggestion: 'Add bullet points to structure your experience.' };

  const bulletRegex = /^\s*(?:[•\-\*\u2022\u2023\u25E6]|\d+[\.\)])\s/;
  const bulletLines = lines.filter(l => bulletRegex.test(l));
  const ratio = bulletLines.length / lines.length;

  if (ratio >= 0.4) return { score: 20, suggestion: null };
  if (ratio >= 0.25) return { score: 15, suggestion: 'Good use of bullets. Adding a few more could improve readability.' };
  if (ratio >= 0.1) return { score: 10, suggestion: 'Use more bullet points to make your experience easier to scan.' };
  return { score: 5, suggestion: 'Your resume lacks bullet points. Structure your achievements as bullet lists.' };
}

function scoreActionVerbs(text: string): { score: number; suggestion: string | null } {
  const words = text.toLowerCase().split(/\s+/);
  const verbSet = new Set(STRONG_ACTION_VERBS);
  const found = new Set(words.filter(w => verbSet.has(w)));

  if (found.size >= 8) return { score: 20, suggestion: null };
  if (found.size >= 5) return { score: 15, suggestion: 'Good verb usage! Try adding a few more strong action verbs like "spearheaded" or "optimized".' };
  if (found.size >= 2) return { score: 10, suggestion: 'Include more strong action verbs (e.g., "achieved", "implemented", "streamlined") to strengthen your impact.' };
  return { score: 4, suggestion: 'Your resume lacks strong action verbs. Start bullet points with words like "Led", "Designed", "Increased", "Automated".' };
}

function scoreMeasurableImpact(text: string): { score: number; suggestion: string | null } {
  const impactPatterns = [
    /\d+\s*%/g,                          // percentages
    /\$[\d,]+/g,                         // dollar amounts
    /\d+\s*(?:million|billion|thousand|k\b)/gi, // large numbers
    /\b(?:increased|decreased|reduced|improved|grew|boosted|saved|generated|cut)\s+(?:by\s+)?\d+/gi,
    /\d+\s*(?:users|customers|clients|employees|team members|projects|applications)/gi,
    /\b\d{2,}\b/g,                       // any 2+ digit numbers
  ];

  let totalMatches = 0;
  for (const pattern of impactPatterns) {
    const matches = text.match(pattern);
    totalMatches += matches ? matches.length : 0;
  }

  if (totalMatches >= 6) return { score: 20, suggestion: null };
  if (totalMatches >= 4) return { score: 15, suggestion: 'Good quantification. Try adding more specific numbers to your remaining achievements.' };
  if (totalMatches >= 2) return { score: 10, suggestion: 'Add more measurable results (percentages, dollar amounts, team sizes) to demonstrate impact.' };
  return { score: 4, suggestion: 'Your resume lacks quantified achievements. Add numbers like "Increased revenue by 25%" or "Managed a team of 12".' };
}

function scoreSections(text: string): { score: number; suggestion: string | null } {
  const lowerText = text.toLowerCase();
  const foundSections: string[] = [];

  for (const section of REQUIRED_SECTIONS) {
    const regex = new RegExp(`(?:^|\\n)\\s*${section.replace(/\s+/g, '\\s+')}\\s*(?::|\\n|$)`, 'i');
    if (regex.test(lowerText) || lowerText.includes(section)) {
      foundSections.push(section);
    }
  }

  // Deduplicate related sections
  const unique = new Set<string>();
  for (const s of foundSections) {
    if (s.includes('experience')) unique.add('experience');
    else if (s.includes('skill')) unique.add('skills');
    else if (s.includes('summary') || s.includes('objective')) unique.add('summary');
    else unique.add(s);
  }

  const count = unique.size;
  if (count >= 4) return { score: 15, suggestion: null };
  if (count >= 3) return { score: 12, suggestion: 'Consider adding another section like "Projects" or "Certifications" to round out your resume.' };
  if (count >= 2) return { score: 8, suggestion: 'Your resume is missing key sections. Include at least: Experience, Education, Skills, and a Summary.' };
  return { score: 3, suggestion: 'Your resume needs proper section headers (Experience, Education, Skills, Summary) for organization.' };
}

function scoreRepetition(text: string): { score: number; suggestion: string | null } {
  const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const freq: Record<string, number> = {};

  for (const word of words) {
    if (STOP_WORDS.has(word)) continue;
    freq[word] = (freq[word] || 0) + 1;
  }

  const repeatedWords = Object.entries(freq)
    .filter(([, count]) => count > 3)
    .sort((a, b) => b[1] - a[1]);

  if (repeatedWords.length === 0) return { score: 10, suggestion: null };
  if (repeatedWords.length <= 2) return { score: 8, suggestion: `Consider varying your language — "${repeatedWords[0][0]}" appears ${repeatedWords[0][1]} times.` };
  if (repeatedWords.length <= 5) return { score: 5, suggestion: `Several words are overused: ${repeatedWords.slice(0, 3).map(([w, c]) => `"${w}" (${c}×)`).join(', ')}. Use synonyms for variety.` };
  return { score: 2, suggestion: `Significant word repetition detected. Diversify your vocabulary — ${repeatedWords.slice(0, 3).map(([w, c]) => `"${w}" (${c}×)`).join(', ')} and more.` };
}

// ─── Main Analysis Function ──────────────────────────────────────────────

export function analyzeResume(text: string): AnalysisResult {
  if (!text.trim()) {
    return {
      totalScore: 0,
      categories: [],
      suggestions: ['Please paste your resume text to get started.'],
    };
  }

  const lengthResult = scoreLength(text);
  const bulletResult = scoreBullets(text);
  const verbResult = scoreActionVerbs(text);
  const impactResult = scoreMeasurableImpact(text);
  const sectionResult = scoreSections(text);
  const repetitionResult = scoreRepetition(text);

  const categories: CategoryScore[] = [
    { name: 'Length', score: lengthResult.score, maxScore: 15, description: 'Word count appropriateness (300–800 ideal)' },
    { name: 'Bullet Structure', score: bulletResult.score, maxScore: 20, description: 'Use of bullet points for readability' },
    { name: 'Action Verbs', score: verbResult.score, maxScore: 20, description: 'Strong action verbs to convey impact' },
    { name: 'Measurable Impact', score: impactResult.score, maxScore: 20, description: 'Quantified achievements and metrics' },
    { name: 'Section Structure', score: sectionResult.score, maxScore: 15, description: 'Required sections present and organized' },
    { name: 'Word Variety', score: repetitionResult.score, maxScore: 10, description: 'Vocabulary diversity and minimal repetition' },
  ];

  const totalScore = categories.reduce((sum, cat) => sum + cat.score, 0);

  const suggestions = [
    lengthResult.suggestion,
    bulletResult.suggestion,
    verbResult.suggestion,
    impactResult.suggestion,
    sectionResult.suggestion,
    repetitionResult.suggestion,
  ].filter((s): s is string => s !== null);

  return { totalScore, categories, suggestions };
}
