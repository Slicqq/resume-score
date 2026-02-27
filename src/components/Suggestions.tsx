interface SuggestionsProps {
    suggestions: string[];
}

export default function Suggestions({ suggestions }: SuggestionsProps) {
    if (suggestions.length === 0) {
        return (
            <div className="suggestions-section">
                <h3>Suggestions</h3>
                <div className="suggestions-empty">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <p>Your resume looks great! No major suggestions.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="suggestions-section">
            <h3>Improvement Suggestions</h3>
            <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                    <li key={index} className="suggestion-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{suggestion}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
