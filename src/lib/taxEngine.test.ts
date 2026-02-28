import { describe, it, expect } from 'vitest';
import { getRate, calculateDeductions, calculateArticle17Tax, getPTKPValue } from './taxEngine';

describe('Tax Engine Core Logic', () => {
    it('should return correct TER rates for Category A', () => {
        // TK/0 with 10M income falls into Category A
        // Bracket for 10M in Category A is 2.0% (max 10,050,000)
        expect(getRate('A', 10000000)).toBe(0.02);
        expect(getRate('A', 5000000)).toBe(0);
        expect(getRate('A', 500000000)).toBe(0.30);
    });

    it('should calculate mandatory deductions correctly', () => {
        const salary = 10000000;
        const deductions = calculateDeductions(salary);

        // JHT: 2% of 10M = 200,000
        expect(deductions.jht).toBe(200000);
        // BPJS Kes: 1% of 10M = 100,000
        expect(deductions.bpjsKes).toBe(100000);
        // JP: 1% of 10M = 100,000
        expect(deductions.jp).toBe(100000);
        expect(deductions.total).toBe(400000);
    });

    it('should respect deduction caps', () => {
        const highSalary = 20000000;
        const deductions = calculateDeductions(highSalary);

        // JHT: 2% of 20M = 400,000 (no cap explicitly mentioned in code logic, just rate)
        expect(deductions.jht).toBe(400000);
        // BPJS Kes: capped at 1% of 12M = 120,000
        expect(deductions.bpjsKes).toBe(120000);
        // JP: capped at 1% of ~10M = ~100,423
        expect(deductions.jp).toBeCloseTo(100423, 0);
    });

    it('should return correct PTKP values', () => {
        expect(getPTKPValue('TK/0')).toBe(54000000);
        expect(getPTKPValue('K/1')).toBe(63000000);
        expect(getPTKPValue('K/3')).toBe(72000000);
    });

    it('should calculate Article 17 progressive tax correctly', () => {
        // 50M taxable income -> 5% bracket only
        expect(calculateArticle17Tax(50000000)).toBe(2500000);

        // 100M taxable income -> 60M @ 5% + 40M @ 15%
        // 3,000,000 + 6,000,000 = 9,000,000
        expect(calculateArticle17Tax(100000000)).toBe(9000000);
    });
});
