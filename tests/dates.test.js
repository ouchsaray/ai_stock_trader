import { describe, test, expect } from '@jest/globals';
import { formatDate, getDateNDaysAgo, dates } from '../utils/dates.js';

describe('formatDate', () => {
    test('should format date as YYYY-MM-DD', () => {
        expect(formatDate(new Date('2025-12-05'))).toBe('2025-12-05');
        expect(formatDate(new Date('2025-01-15'))).toBe('2025-01-15');
    });

    test('should pad single digit months and days', () => {
        expect(formatDate(new Date('2025-01-05'))).toBe('2025-01-05');
        expect(formatDate(new Date('2025-09-09'))).toBe('2025-09-09');
    });

    test('should handle year boundaries', () => {
        expect(formatDate(new Date('2024-12-31'))).toBe('2024-12-31');
        expect(formatDate(new Date('2025-01-01'))).toBe('2025-01-01');
    });
});

describe('getDateNDaysAgo', () => {
    test('should return date in correct format', () => {
        const result = getDateNDaysAgo(1);
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('should return yesterday for n=1', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const expected = formatDate(yesterday);
        expect(getDateNDaysAgo(1)).toBe(expected);
    });

    test('should return 3 days ago for n=3', () => {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        const expected = formatDate(threeDaysAgo);
        expect(getDateNDaysAgo(3)).toBe(expected);
    });

    test('should return today for n=0', () => {
        const today = new Date();
        const expected = formatDate(today);
        expect(getDateNDaysAgo(0)).toBe(expected);
    });

    test('should handle larger values', () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const expected = formatDate(thirtyDaysAgo);
        expect(getDateNDaysAgo(30)).toBe(expected);
    });
});

describe('dates object', () => {
    test('should have startDate property', () => {
        expect(dates.startDate).toBeDefined();
        expect(dates.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('should have endDate property', () => {
        expect(dates.endDate).toBeDefined();
        expect(dates.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('startDate should be 3 days ago', () => {
        expect(dates.startDate).toBe(getDateNDaysAgo(3));
    });

    test('endDate should be 1 day ago (yesterday)', () => {
        expect(dates.endDate).toBe(getDateNDaysAgo(1));
    });

    test('startDate should be before endDate', () => {
        const start = new Date(dates.startDate);
        const end = new Date(dates.endDate);
        expect(start.getTime()).toBeLessThan(end.getTime());
    });
});
