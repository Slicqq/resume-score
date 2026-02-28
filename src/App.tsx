import { useState, useRef } from 'react';
import ScoreDisplay from './components/ScoreDisplay';
import BreakdownBar from './components/BreakdownBar';
import Suggestions from './components/Suggestions';
import ScoreHistory, { addToHistory } from './components/ScoreHistory';
import ATSKeywordChecker from './components/ATSKeywordChecker';
import { useTheme } from './hooks/useTheme';
import { analyzeResume, type AnalysisResult } from './utils/scoringEngine';
import { SAMPLE_RESUME } from './utils/sampleResume';

function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();

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
          <div className="header-actions">
            <button
              className="btn btn-ghost btn-sm btn-icon"
              onClick={toggleTheme}
              type="button"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>
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
              <button
                className="btn btn-ghost"
                onClick={(e) => {
                  const btn = e.currentTarget;
                  const lines = [
                    `Resume Score: ${result.totalScore}/100`,
                    '',
                    'Breakdown:',
                    ...result.categories.map((c) => `  ${c.name}: ${c.score}/${c.maxScore}`),
                  ];
                  if (result.suggestions.length > 0) {
                    lines.push('', 'Suggestions:');
                    result.suggestions.forEach((s) => lines.push(`  • ${s}`));
                  }
                  navigator.clipboard.writeText(lines.join('\n')).then(() => {
                    const orig = btn.innerHTML;
                    btn.textContent = '✓ Copied!';
                    setTimeout(() => { btn.innerHTML = orig; }, 1500);
                  });
                }}
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy Results
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
  const [isExtracting, setIsExtracting] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleFileUpload = async (file: File) => {
    setFileError('');

    if (file.type === 'application/pdf') {
      setIsExtracting(true);
      try {
        const { extractTextFromPDF } = await import('./utils/pdfExtractor');
        const extractedText = await extractTextFromPDF(file);
        if (!extractedText.trim()) {
          setFileError('Could not extract text from this PDF. It may be image-based.');
        } else {
          onTextChange(extractedText);
        }
      } catch {
        setFileError('Failed to read this PDF. Please try pasting the text instead.');
      } finally {
        setIsExtracting(false);
      }
    } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onTextChange(content);
      };
      reader.onerror = () => {
        setFileError('Failed to read this file.');
      };
      reader.readAsText(file);
    } else {
      setFileError('Please upload a PDF or TXT file.');
    }

    // Reset file input so same file can be re-uploaded
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  return (
    <section className="resume-input-section" aria-label="Resume input">
      <div className="input-header">
        <h2>Paste or Upload Your Resume</h2>
        <div className="input-header-actions">
          <button className="btn btn-ghost" onClick={() => fileInputRef.current?.click()} type="button" aria-label="Upload a PDF or text file">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload PDF
          </button>
          <button className="btn btn-ghost" onClick={onLoadSample} type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Try Sample
          </button>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
      {fileError && (
        <div className="file-error" role="alert">
          <span>⚠</span> {fileError}
        </div>
      )}
      {isExtracting && (
        <div className="file-extracting">
          <div className="loading-spinner" style={{ width: 20, height: 20 }} />
          <span>Extracting text from PDF…</span>
        </div>
      )}
      <textarea
        className="resume-textarea"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        placeholder="Paste your resume content here, or drag & drop a PDF…"
        rows={16}
        aria-label="Resume text content"
      />
      <div className="input-actions">
        <span className="word-count" aria-live="polite">{wordCount} words</span>
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

