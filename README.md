# Resume Score

A clean, client-side web application that analyzes resume text using rule-based scoring. No data is sent to any server — everything runs in your browser.

## Features

- **Instant Analysis** — Paste your resume and get a score out of 100
- **6 Scoring Categories** — Length, bullet structure, action verbs, measurable impact, section detection, and word variety
- **Actionable Suggestions** — Specific tips to improve your resume
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
- Vanilla CSS (custom design system)

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── ResumeInput.tsx     # Textarea + analyze button
│   ├── ScoreDisplay.tsx    # Circular score gauge
│   ├── BreakdownBar.tsx    # Category progress bars
│   └── Suggestions.tsx     # Improvement tips list
├── utils/
│   ├── scoringEngine.ts    # Rule-based scoring logic
│   └── sampleResume.ts     # Example resume text
├── App.tsx                 # Main application
├── main.tsx                # Entry point
└── index.css               # Global styles
```

## License

MIT
