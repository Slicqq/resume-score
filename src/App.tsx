import { useState } from 'react';
import ScoreDisplay from './components/ScoreDisplay';
import BreakdownBar from './components/BreakdownBar';
import Suggestions from './components/Suggestions';
import ScoreHistory, { addToHistory } from './components/ScoreHistory';
import ATSKeywordChecker from './components/ATSKeywordChecker';
import { analyzeResume, type AnalysisResult } from './utils/scoringEngine';
import { SAMPLE_RESUME } from './utils/sampleResume';

function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleAnalyze = (text: string) => {
    setIsAnalyzing(true);
    setResumeText(text);

    // Small delay for visual feedback
    setTimeout(() => {
      const analysis = analyzeResume(text);
      setResult(analysis);
      setIsAnalyzing(false);
      // Save to history
      const wordCount = text.trim().split(/\s+/).length;
      addToHistory(analysis.totalScore, wordCount);
    }, 400);
  };

  const handleLoadSample = () => {
    setResumeText(SAMPLE_RESUME);
    setResult(null);
  };

  const handleReset = () => {
    setResumeText('');
    setResult(null);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <h1>Resume Score</h1>
          </div>
          <p className="tagline">Analyze your resume with rule-based scoring</p>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowHistory(!showHistory)}
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            History
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {!result ? (
          <div className="input-view">
            <ResumeInputControlled
              text={resumeText}
              onTextChange={setResumeText}
              onAnalyze={handleAnalyze}
              onLoadSample={handleLoadSample}
              isAnalyzing={isAnalyzing}
            />
          </div>
        ) : (
          <div className="results-view">
            <div className="results-header">
              <button className="btn btn-ghost" onClick={handleReset} type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Analyze Another
              </button>
              <button className="btn btn-ghost" onClick={() => window.print()} type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9V2h12v7" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                Export PDF
              </button>
            </div>
            <div className="results-grid">
              <div className="results-score-col">
                <ScoreDisplay score={result.totalScore} />
              </div>
              <div className="results-detail-col">
                <BreakdownBar categories={result.categories} />
                <Suggestions suggestions={result.suggestions} />
                <ATSKeywordChecker resumeText={resumeText} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>100% client-side · No data is sent to any server · Rule-based analysis</p>
      </footer>

      {/* Score History Panel */}
      {showHistory && (
        <ScoreHistory onClose={() => setShowHistory(false)} />
      )}

      {/* Loading overlay */}
      {isAnalyzing && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <p>Analyzing your resume…</p>
        </div>
      )}
    </div>
  );
}

// ─── Controlled Resume Input ───────────────────────────────────────────

interface ResumeInputControlledProps {
  text: string;
  onTextChange: (text: string) => void;
  onAnalyze: (text: string) => void;
  onLoadSample: () => void;
  isAnalyzing: boolean;
}

function ResumeInputControlled({
  text,
  onTextChange,
  onAnalyze,
  onLoadSample,
  isAnalyzing,
}: ResumeInputControlledProps) {
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <section className="resume-input-section">
      <div className="input-header">
        <h2>Paste Your Resume</h2>
        <button className="btn btn-ghost" onClick={onLoadSample} type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          Try Sample
        </button>
      </div>
      <textarea
        className="resume-textarea"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Paste your resume content here…"
        rows={16}
      />
      <div className="input-actions">
        <span className="word-count">{wordCount} words</span>
        <button
          className="btn btn-primary"
          onClick={() => onAnalyze(text)}
          disabled={!text.trim() || isAnalyzing}
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Analyze Resume
        </button>
      </div>
    </section>
  );
}

export default App;
