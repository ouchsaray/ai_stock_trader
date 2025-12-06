import { describe, test, expect } from '@jest/globals';
import {
    isValidTicker,
    parseTickerInput,
    filterValidTickers,
    checkTickerLimit,
    removeDuplicateTickers,
    validateStockData
} from '../utils/helpers.js';

describe('isValidTicker', () => {
    test('should return true for valid tickers', () => {
        expect(isValidTicker('TSLA')).toBe(true);
        expect(isValidTicker('AAPL')).toBe(true);
        expect(isValidTicker('A')).toBe(true);
        expect(isValidTicker('GOOGL')).toBe(true);
    });

    test('should return true for lowercase tickers (case insensitive)', () => {
        expect(isValidTicker('tsla')).toBe(true);
        expect(isValidTicker('aapl')).toBe(true);
    });

    test('should return false for invalid tickers', () => {
        expect(isValidTicker('')).toBe(false);
        expect(isValidTicker('TOOLONG')).toBe(false);
        expect(isValidTicker('123')).toBe(false);
        expect(isValidTicker('TS1A')).toBe(false);
        expect(isValidTicker(null)).toBe(false);
        expect(isValidTicker(undefined)).toBe(false);
    });

    test('should handle tickers with whitespace', () => {
        expect(isValidTicker(' TSLA ')).toBe(true);
        expect(isValidTicker('  AAPL  ')).toBe(true);
    });
});

describe('parseTickerInput', () => {
    test('should parse comma-separated tickers', () => {
        expect(parseTickerInput('TSLA, PLTR, ASTS')).toEqual(['TSLA', 'PLTR', 'ASTS']);
        expect(parseTickerInput('TSLA,PLTR,ASTS')).toEqual(['TSLA', 'PLTR', 'ASTS']);
    });

    test('should parse space-separated tickers', () => {
        expect(parseTickerInput('TSLA PLTR ASTS')).toEqual(['TSLA', 'PLTR', 'ASTS']);
    });

    test('should handle mixed separators', () => {
        expect(parseTickerInput('TSLA, PLTR ASTS')).toEqual(['TSLA', 'PLTR', 'ASTS']);
    });

    test('should convert to uppercase', () => {
        expect(parseTickerInput('tsla, pltr')).toEqual(['TSLA', 'PLTR']);
    });

    test('should handle empty input', () => {
        expect(parseTickerInput('')).toEqual([]);
        expect(parseTickerInput(null)).toEqual([]);
        expect(parseTickerInput(undefined)).toEqual([]);
    });

    test('should filter out empty strings', () => {
        expect(parseTickerInput('TSLA,, PLTR')).toEqual(['TSLA', 'PLTR']);
        expect(parseTickerInput('  TSLA   PLTR  ')).toEqual(['TSLA', 'PLTR']);
    });
});

describe('filterValidTickers', () => {
    test('should separate valid and invalid tickers', () => {
        const result = filterValidTickers(['TSLA', 'TOOLONG', 'AAPL', '123']);
        expect(result.valid).toEqual(['TSLA', 'AAPL']);
        expect(result.invalid).toEqual(['TOOLONG', '123']);
    });

    test('should return all valid when no invalid', () => {
        const result = filterValidTickers(['TSLA', 'AAPL', 'PLTR']);
        expect(result.valid).toEqual(['TSLA', 'AAPL', 'PLTR']);
        expect(result.invalid).toEqual([]);
    });

    test('should return all invalid when no valid', () => {
        const result = filterValidTickers(['TOOLONG', '123']);
        expect(result.valid).toEqual([]);
        expect(result.invalid).toEqual(['TOOLONG', '123']);
    });

    test('should handle empty array', () => {
        const result = filterValidTickers([]);
        expect(result.valid).toEqual([]);
        expect(result.invalid).toEqual([]);
    });
});

describe('checkTickerLimit', () => {
    test('should return correct available slots', () => {
        expect(checkTickerLimit(0, 2, 3)).toEqual({ canAdd: 2, exceeded: false, availableSlots: 3 });
        expect(checkTickerLimit(2, 1, 3)).toEqual({ canAdd: 1, exceeded: false, availableSlots: 1 });
    });

    test('should indicate when limit is exceeded', () => {
        expect(checkTickerLimit(2, 3, 3)).toEqual({ canAdd: 1, exceeded: true, availableSlots: 1 });
        expect(checkTickerLimit(3, 1, 3)).toEqual({ canAdd: 0, exceeded: true, availableSlots: 0 });
    });

    test('should use default max of 3', () => {
        expect(checkTickerLimit(0, 5)).toEqual({ canAdd: 3, exceeded: true, availableSlots: 3 });
    });
});

describe('removeDuplicateTickers', () => {
    test('should remove duplicates within array', () => {
        expect(removeDuplicateTickers(['TSLA', 'TSLA', 'AAPL'])).toEqual(['TSLA', 'AAPL']);
    });

    test('should remove tickers already in existing list', () => {
        expect(removeDuplicateTickers(['TSLA', 'AAPL'], ['TSLA'])).toEqual(['AAPL']);
    });

    test('should be case insensitive', () => {
        expect(removeDuplicateTickers(['tsla', 'TSLA'])).toEqual(['TSLA']);
        expect(removeDuplicateTickers(['AAPL'], ['aapl'])).toEqual([]);
    });

    test('should handle empty arrays', () => {
        expect(removeDuplicateTickers([])).toEqual([]);
        expect(removeDuplicateTickers(['TSLA'], [])).toEqual(['TSLA']);
    });
});

describe('validateStockData', () => {
    test('should return valid for good data', () => {
        const data = { resultsCount: 3, results: [{}, {}, {}] };
        expect(validateStockData(data)).toEqual({ isValid: true, error: null });
    });

    test('should return invalid for empty results', () => {
        const data = { resultsCount: 0, results: [] };
        expect(validateStockData(data)).toEqual({
            isValid: false,
            error: 'Ticker not found or has no data'
        });
    });

    test('should return invalid for missing results', () => {
        const data = { resultsCount: 0 };
        expect(validateStockData(data)).toEqual({
            isValid: false,
            error: 'Ticker not found or has no data'
        });
    });

    test('should return invalid for null data', () => {
        expect(validateStockData(null)).toEqual({
            isValid: false,
            error: 'No data received'
        });
    });

    test('should return invalid for undefined data', () => {
        expect(validateStockData(undefined)).toEqual({
            isValid: false,
            error: 'No data received'
        });
    });
});
