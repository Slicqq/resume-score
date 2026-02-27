import type { CategoryScore } from '../utils/scoringEngine';

interface BreakdownBarProps {
    categories: CategoryScore[];
}

export default function BreakdownBar({ categories }: BreakdownBarProps) {
    const getBarColor = (score: number, max: number) => {
        const pct = (score / max) * 100;
        if (pct >= 75) return 'var(--color-success)';
        if (pct >= 50) return 'var(--color-warning)';
        return 'var(--color-danger)';
    };

    return (
        <div className="breakdown-section">
            <h3>Category Breakdown</h3>
            <div className="breakdown-list">
                {categories.map((cat) => {
                    const pct = Math.round((cat.score / cat.maxScore) * 100);
                    return (
                        <div key={cat.name} className="breakdown-item">
                            <div className="breakdown-header">
                                <span className="breakdown-name">{cat.name}</span>
                                <span className="breakdown-score">
                                    {cat.score}/{cat.maxScore}
                                </span>
                            </div>
                            <div className="breakdown-bar-track">
                                <div
                                    className="breakdown-bar-fill"
                                    style={{
                                        width: `${pct}%`,
                                        backgroundColor: getBarColor(cat.score, cat.maxScore),
                                    }}
                                />
                            </div>
                            <p className="breakdown-desc">{cat.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
