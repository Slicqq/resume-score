import { useState, useEffect } from 'react';

interface HistoryEntry {
    id: string;
    score: number;
    date: string;
    wordCount: number;
}

const STORAGE_KEY = 'resume-score-history';

function loadHistory(): HistoryEntry[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveHistory(history: HistoryEntry[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function addToHistory(score: number, wordCount: number): void {
    const history = loadHistory();
    const entry: HistoryEntry = {
        id: Date.now().toString(36),
        score,
        date: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }),
        wordCount,
    };
    // Keep last 10 entries
    const updated = [entry, ...history].slice(0, 10);
    saveHistory(updated);
}

interface ScoreHistoryProps {
    onClose: () => void;
}

export default function ScoreHistory({ onClose }: ScoreHistoryProps) {
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        setHistory(loadHistory());
    }, []);

    const handleClear = () => {
        localStorage.removeItem(STORAGE_KEY);
        setHistory([]);
    };

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'var(--color-success)';
        if (score >= 40) return 'var(--color-warning)';
        return 'var(--color-danger)';
    };

    return (
        <div className="history-panel">
            <div className="history-header">
                <h3>Score History</h3>
                <div className="history-actions">
                    {history.length > 0 && (
                        <button className="btn-text" onClick={handleClear} type="button">
                            Clear
                        </button>
                    )}
                    <button className="btn-text" onClick={onClose} type="button">
                        ✕
                    </button>
                </div>
            </div>
            {history.length === 0 ? (
                <p className="history-empty">No analyses yet. Score a resume to start tracking.</p>
            ) : (
                <ul className="history-list">
                    {history.map((entry) => (
                        <li key={entry.id} className="history-item">
                            <span
                                className="history-score"
                                style={{ color: getScoreColor(entry.score) }}
                            >
                                {entry.score}
                            </span>
                            <div className="history-meta">
                                <span className="history-date">{entry.date}</span>
                                <span className="history-words">{entry.wordCount} words</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
