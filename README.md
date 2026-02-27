# Resume Score

A clean, client-side web application that analyzes resume text using rule-based scoring. No data is sent to any server — everything runs in your browser.

## Features

- **Instant Analysis** — Paste your resume and get a score out of 100
- **PDF Upload** — Upload a PDF resume and the text is automatically extracted
- **6 Scoring Categories** — Length, bullet structure, action verbs, measurable impact, section detection, and word variety
- **Actionable Suggestions** — Specific tips to improve your resume
- **ATS Keyword Checker** — Paste a job description to see how well your resume matches
- **Score History** — Track your improvement over time (stored locally)
- **Export to PDF** — Save your results via the browser's print dialog
- **Copy Results** — One-click copy of scores and suggestions to clipboard
- **Dark / Light Mode** — Toggle between warm peach light and charcoal dark themes
- **Animated Score** — Watch your score count up with a smooth animation
- **Error Handling** — Graceful error boundary with recovery
- **Sample Resume** — Try the tool instantly with a built-in example
- **Fully Client-Side** — No backend, no APIs, no data collection

## Scoring Categories

| Category | Weight | What It Checks |
|---|---|---|
| Length | 15 pts | Word count appropriateness (300–800 ideal) |
| Bullet Structure | 20 pts | Use of bullet points for readability |
| Action Verbs | 20 pts | Strong verbs like "led", "designed", "optimized" |
| Measurable Impact | 20 pts | Numbers, percentages, and quantified results |
| Section Structure | 15 pts | Required sections (Experience, Education, Skills, etc.) |
| Word Variety | 10 pts | Vocabulary diversity, minimal repetition |

**Total: 100 points**

## Tech Stack

- React 19 + TypeScript
- Vite
- Vanilla CSS (custom design system with dark/light theme support)
- pdf.js (client-side PDF text extraction)
- Vitest (unit testing)

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Project Structure

```
src/
├── __tests__/
│   └── scoringEngine.test.ts  # Unit tests for scoring logic
├── components/
│   ├── ATSKeywordChecker.tsx   # Job description keyword matcher
│   ├── BreakdownBar.tsx        # Category progress bars
│   ├── ErrorBoundary.tsx       # Error boundary with recovery
│   ├── ScoreDisplay.tsx        # Animated circular score gauge
│   ├── ScoreHistory.tsx        # Persistent score history panel
│   └── Suggestions.tsx         # Improvement tips list
├── hooks/
│   └── useTheme.ts             # Dark/light theme management
├── utils/
│   ├── pdfExtractor.ts         # Client-side PDF text extraction
│   ├── scoringEngine.ts        # Rule-based scoring logic
│   └── sampleResume.ts         # Example resume text
├── App.tsx                     # Main application
├── main.tsx                    # Entry point
└── index.css                   # Global styles + theme variables
```

## License

MIT
