import { useState } from 'react';

interface KeywordMatch {
    keyword: string;
    found: boolean;
}

interface ATSKeywordCheckerProps {
    resumeText: string;
}

export default function ATSKeywordChecker({ resumeText }: ATSKeywordCheckerProps) {
    const [jobDescription, setJobDescription] = useState('');
    const [matches, setMatches] = useState<KeywordMatch[] | null>(null);

    const extractKeywords = (text: string): string[] => {
        // Remove common stop words and extract meaningful terms
        const stopWords = new Set([
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'is', 'was', 'are', 'were', 'be', 'been', 'being',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
            'should', 'may', 'might', 'shall', 'can', 'this', 'that', 'these',
            'those', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she',
            'it', 'they', 'them', 'its', 'his', 'her', 'their', 'as', 'from',
            'not', 'so', 'if', 'then', 'than', 'also', 'about', 'up', 'out',
            'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
            'who', 'which', 'what', 'when', 'where', 'how', 'why', 'able',
            'must', 'such', 'like', 'well', 'just', 'only', 'into', 'over',
            'new', 'one', 'two', 'work', 'working', 'looking', 'join', 'team',
            'role', 'position', 'company', 'including', 'etc', 'strong',
            'experience', 'required', 'preferred', 'plus', 'years', 'year',
        ]);

        const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
        const freq: Record<string, number> = {};

        for (const word of words) {
            if (!stopWords.has(word)) {
                freq[word] = (freq[word] || 0) + 1;
            }
        }

        // Get words that appear 2+ times or are significant technical terms
        return Object.entries(freq)
            .filter(([, count]) => count >= 2)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
            .map(([word]) => word);
    };

    const handleCheck = () => {
        if (!jobDescription.trim() || !resumeText.trim()) return;

        const keywords = extractKeywords(jobDescription);
        const resumeLower = resumeText.toLowerCase();

        const results: KeywordMatch[] = keywords.map((keyword) => ({
            keyword,
            found: resumeLower.includes(keyword),
        }));

        setMatches(results);
    };

    const matchCount = matches?.filter((m) => m.found).length ?? 0;
    const totalCount = matches?.length ?? 0;
    const matchPct = totalCount > 0 ? Math.round((matchCount / totalCount) * 100) : 0;

    return (
        <div className="ats-section">
            <h3>ATS Keyword Checker</h3>
            <p className="ats-description">
                Paste a job description to see how many keywords your resume matches.
            </p>
            <textarea
                className="ats-textarea"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here…"
                rows={6}
            />
            <button
                className="btn btn-primary btn-sm"
                onClick={handleCheck}
                disabled={!jobDescription.trim() || !resumeText.trim()}
                type="button"
                style={{ marginTop: '0.75rem' }}
            >
                Check Keywords
            </button>

            {matches && (
                <div className="ats-results">
                    <div className="ats-summary">
                        <span className="ats-match-count" style={{
                            color: matchPct >= 70 ? 'var(--color-success)' :
                                matchPct >= 40 ? 'var(--color-warning)' : 'var(--color-danger)'
                        }}>
                            {matchCount}/{totalCount}
                        </span>
                        <span className="ats-match-label">
                            keywords matched ({matchPct}%)
                        </span>
                    </div>
                    <div className="ats-keywords">
                        {matches.map((m) => (
                            <span
                                key={m.keyword}
                                className={`ats-keyword ${m.found ? 'ats-keyword-found' : 'ats-keyword-missing'}`}
                            >
                                {m.keyword}
                            </span>
                        ))}
                    </div>
                    {matchPct < 70 && (
                        <p className="ats-tip">
                            💡 Try incorporating the missing keywords naturally into your resume to improve your ATS match rate.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
