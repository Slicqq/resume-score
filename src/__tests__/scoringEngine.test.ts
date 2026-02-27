import { describe, it, expect } from 'vitest';
import { analyzeResume } from '../utils/scoringEngine';
import { SAMPLE_RESUME } from '../utils/sampleResume';

describe('scoringEngine', () => {
    describe('analyzeResume', () => {
        it('returns a result with totalScore, categories, and suggestions', () => {
            const result = analyzeResume('Some basic resume text here.');
            expect(result).toHaveProperty('totalScore');
            expect(result).toHaveProperty('categories');
            expect(result).toHaveProperty('suggestions');
            expect(result.categories).toHaveLength(6);
        });

        it('scores between 0 and 100', () => {
            const result = analyzeResume('Short resume.');
            expect(result.totalScore).toBeGreaterThanOrEqual(0);
            expect(result.totalScore).toBeLessThanOrEqual(100);
        });

        it('gives a high score to the sample resume', () => {
            const result = analyzeResume(SAMPLE_RESUME);
            expect(result.totalScore).toBeGreaterThanOrEqual(80);
        });

        it('gives a low score to very short text', () => {
            const result = analyzeResume('hi');
            expect(result.totalScore).toBeLessThan(30);
        });

        it('detects action verbs', () => {
            const withVerbs = analyzeResume(
                'Led a team of 10 engineers. Designed scalable architecture. Implemented CI/CD pipeline. ' +
                'Optimized database queries. Managed project timeline. Developed new features. ' +
                'Experience section. Education section. Skills section. ' +
                '• Point one\n• Point two\n• Point three\n• Point four\n• Point five'
            );
            const actionVerbCategory = withVerbs.categories.find((c) => c.name === 'Action Verbs');
            expect(actionVerbCategory).toBeDefined();
            expect(actionVerbCategory!.score).toBeGreaterThan(0);
        });

        it('detects section structure', () => {
            const withSections = analyzeResume(
                'Experience\nWorked at Company A for 3 years.\n\nEducation\nBachelor of Science.\n\nSkills\nJavaScript, React, Node.js\n\nSummary\nExperienced developer.\n\nProjects\nBuilt several apps.'
            );
            const sectionCategory = withSections.categories.find((c) => c.name === 'Section Structure');
            expect(sectionCategory).toBeDefined();
            expect(sectionCategory!.score).toBeGreaterThan(0);
        });

        it('detects measurable impact', () => {
            const withNumbers = analyzeResume(
                'Increased revenue by 40%. Reduced load time by 50%. Managed a budget of $2M. ' +
                'Led a team of 15 people. Processed 10,000 requests per second. ' +
                'Experience section. Education section. Skills section.'
            );
            const impactCategory = withNumbers.categories.find((c) => c.name === 'Measurable Impact');
            expect(impactCategory).toBeDefined();
            expect(impactCategory!.score).toBeGreaterThan(0);
        });

        it('generates suggestions for a weak resume', () => {
            const result = analyzeResume('just some random text without any structure');
            expect(result.suggestions.length).toBeGreaterThan(0);
        });

        it('handles empty string gracefully', () => {
            const result = analyzeResume('');
            expect(result.totalScore).toBe(0);
            expect(Array.isArray(result.categories)).toBe(true);
        });

        it('handles very long text', () => {
            const longText = 'Experience section. Education section. Skills section. ' +
                'Led the development of a platform. Designed the architecture. '.repeat(500);
            const result = analyzeResume(longText);
            expect(result.totalScore).toBeGreaterThanOrEqual(0);
            expect(result.totalScore).toBeLessThanOrEqual(100);
        });

        it('category scores do not exceed their max', () => {
            const result = analyzeResume(SAMPLE_RESUME);
            for (const cat of result.categories) {
                expect(cat.score).toBeLessThanOrEqual(cat.maxScore);
                expect(cat.score).toBeGreaterThanOrEqual(0);
            }
        });

        it('total score equals sum of category scores', () => {
            const result = analyzeResume(SAMPLE_RESUME);
            const sum = result.categories.reduce((acc, c) => acc + c.score, 0);
            expect(result.totalScore).toBe(sum);
        });
    });
});
