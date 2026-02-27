import { useState, useEffect } from 'react';

interface ScoreDisplayProps {
    score: number;
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
    const [displayScore, setDisplayScore] = useState(0);
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (displayScore / 100) * circumference;

    // Animate score from 0 to target
    useEffect(() => {
        setDisplayScore(0);
        const duration = 1200;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayScore(Math.round(eased * score));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [score]);

    const getScoreColor = (s: number) => {
        if (s >= 70) return 'var(--color-success)';
        if (s >= 40) return 'var(--color-warning)';
        return 'var(--color-danger)';
    };

    const getScoreLabel = () => {
        if (score >= 80) return 'Excellent';
        if (score >= 70) return 'Good';
        if (score >= 50) return 'Fair';
        if (score >= 30) return 'Needs Work';
        return 'Poor';
    };

    const color = getScoreColor(displayScore);

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
                        stroke={color}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="score-arc"
                        transform="rotate(-90 90 90)"
                    />
                </svg>
                <div className="score-value">
                    <span className="score-number" style={{ color }}>
                        {displayScore}
                    </span>
                    <span className="score-max">/100</span>
                </div>
            </div>
            <p className="score-label" style={{ color: getScoreColor(score) }}>
                {getScoreLabel()}
            </p>
        </div>
    );
}
