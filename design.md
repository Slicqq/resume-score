Below is a revised, complete build prompt. It includes repository setup, structure, and commit discipline.

You can use this as your execution spec.

⸻

Project Prompt

Project Name

Resume Score

Objective

Build a clean, client side web application that analyzes resume text using rule based scoring. The project must include full repository setup, structured commits, and professional documentation.

⸻

Repository Requirements
	1.	Create a new public GitHub repository named:

resume-score


	2.	Include:
	•	Clear README
	•	Proper .gitignore
	•	License file
	•	Meaningful commit history
	•	Structured folder organization
	3.	Commits must reflect incremental development. No bulk dumping.
	4.	Default branch: main

⸻

Technical Requirements
	•	Framework: React with Vite or Next.js
	•	No backend
	•	No external AI APIs
	•	All analysis must be rule based
	•	Modular scoring engine
	•	Responsive layout
	•	Clean, minimal UI

⸻

Core Features

1. Resume Input
	•	Large textarea
	•	Paste resume content
	•	Analyze button

2. Scoring Engine (Rule Based)

Categories:
	1.	Length appropriateness
	2.	Bullet structure detection
	3.	Strong action verb detection
	4.	Measurable impact detection
	5.	Required section detection
	6.	Word repetition control

Total score out of 100.

⸻

3. Results UI
	•	Prominent total score
	•	Category breakdown bars
	•	List of improvement suggestions
	•	Mobile responsive layout

⸻

Folder Structure Example

For Vite:

resume-score/
├─ src/
│  ├─ components/
│  │  ├─ ResumeInput.tsx
│  │  ├─ ScoreDisplay.tsx
│  │  ├─ BreakdownBar.tsx
│  ├─ utils/
│  │  ├─ scoringEngine.ts
│  ├─ App.tsx
│  ├─ main.tsx
├─ public/
├─ README.md
├─ package.json


⸻

Commit Structure Plan

Phase 1 – Repository Setup
	1.	Initialize Vite project
	2.	Clean project structure
	3.	Add README skeleton
	4.	Add project description and goals

Phase 2 – UI Foundation
	5.	Create layout structure
	6.	Add textarea component
	7.	Add analyze button
	8.	Basic styling pass

Phase 3 – Scoring Logic
	9.	Implement word count logic
	10.	Add length scoring
	11.	Add bullet detection
	12.	Add verb strength detection
	13.	Add measurable impact detection
	14.	Add section detection
	15.	Add repetition detection
	16.	Combine into unified scoring engine

Phase 4 – Integration
	17.	Connect UI to scoring engine
	18.	Display total score
	19.	Add breakdown bars
	20.	Add feedback suggestions

Phase 5 – Polish
	21.	Refactor scoring module
	22.	Improve responsiveness
	23.	Add sample resume example
	24.	Finalize README with usage instructions

⸻

README Must Include
	•	Project overview
	•	Feature list
	•	Scoring explanation
	•	Local development instructions
	•	Tech stack
	•	Screenshots (after UI is built)

⸻

This gives you:
	•	Real utility
	•	Clean public repo
	•	20 plus meaningful commits
	•	Professional presentation
	•	Enough public activity to raise your score

If you want, next I can give you the exact scoring algorithm design so implementation stays simple and clean.