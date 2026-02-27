interface ScoreDisplayProps {
    score: number;
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const getScoreColor = () => {
        if (score >= 70) return 'var(--color-success)';
        if (score >= 40) return 'var(--color-warning)';
        return 'var(--color-danger)';
    };

    const getScoreLabel = () => {
        if (score >= 80) return 'Excellent';
        if (score >= 70) return 'Good';
        if (score >= 50) return 'Fair';
        if (score >= 30) return 'Needs Work';
        return 'Poor';
    };

    return (
        <div className="score-display">
            <div className="score-ring-container">
                <svg className="score-ring" viewBox="0 0 180 180">
                    {/* Background circle */}
                    <circle
                        cx="90"
                        cy="90"
                        r={radius}
                        fill="none"
                        stroke="var(--color-surface-alt)"
                        strokeWidth="10"
                    />
                    {/* Score arc */}
                    <circle
                        cx="90"
                        cy="90"
                        r={radius}
                        fill="none"
                        stroke={getScoreColor()}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="score-arc"
                        transform="rotate(-90 90 90)"
                    />
                </svg>
                <div className="score-value">
                    <span className="score-number" style={{ color: getScoreColor() }}>
                        {score}
                    </span>
                    <span className="score-max">/100</span>
                </div>
            </div>
            <p className="score-label" style={{ color: getScoreColor() }}>
                {getScoreLabel()}
            </p>
        </div>
    );
}
