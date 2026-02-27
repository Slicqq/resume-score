import { useState } from 'react';

interface ResumeInputProps {
    onAnalyze: (text: string) => void;
    onLoadSample: () => void;
}

export default function ResumeInput({ onAnalyze, onLoadSample }: ResumeInputProps) {
    const [text, setText] = useState('');

    const handleAnalyze = () => {
        if (text.trim()) {
            onAnalyze(text);
        }
    };

    return (
        <section className="resume-input-section">
            <div className="input-header">
                <h2>Paste Your Resume</h2>
                <button
                    className="btn btn-ghost"
                    onClick={() => { onLoadSample(); }}
                    type="button"
                >
                    Try Sample
                </button>
            </div>
            <textarea
                className="resume-textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your resume content here..."
                rows={14}
            />
            <div className="input-actions">
                <span className="word-count">
                    {text.trim() ? text.trim().split(/\s+/).length : 0} words
                </span>
                <button
                    className="btn btn-primary"
                    onClick={handleAnalyze}
                    disabled={!text.trim()}
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

// Expose a way to set text from outside via ref or callback
export function createResumeInputRef() {
    let setter: ((text: string) => void) | null = null;
    return {
        register: (fn: (text: string) => void) => { setter = fn; },
        set: (text: string) => { setter?.(text); },
    };
}
