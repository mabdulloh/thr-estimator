import taxBrackets from './taxBrackets.json';

export interface TaxBracket {
    max: number;
    rate: number;
}

export type Category = 'A' | 'B' | 'C';

const TABLES: Record<Category, TaxBracket[]> = taxBrackets as any;

export const getRate = (category: Category, income: number): number => {
    const table = TABLES[category];
    const bracket = table.find((b) => income <= b.max);
    return bracket ? bracket.rate : table[table.length - 1].rate;
};

export const calculateDeductions = (salary: number) => {
    const jht = salary * 0.02; // JHT Employee 2%
    const bpjsKes = Math.min(salary, 12000000) * 0.01; // BPJS Kesehatan 1%, cap 12jt
    const jp = Math.min(salary, 10042300) * 0.01; // JP Employee 1%, cap 10.0423jt

    return { jht, bpjsKes, jp, total: jht + bpjsKes + jp };
};

export const getPTKPValue = (status: string): number => {
    const ptkpMap: Record<string, number> = {
        'TK/0': 54000000,
        'TK/1': 58500000,
        'K/0': 58500000,
        'TK/2': 63000000,
        'K/1': 63000000,
        'TK/3': 67500000,
        'K/2': 67500000,
        'K/3': 72000000,
    };
    return ptkpMap[status] || 54000000;
};

export const calculateArticle17Tax = (taxableIncome: number): number => {
    if (taxableIncome <= 0) return 0;

    let tax = 0;
    let remaining = taxableIncome;

    const brackets = [
        { limit: 60000000, rate: 0.05 },
        { limit: 190000000, rate: 0.15 },
        { limit: 250000000, rate: 0.25 },
        { limit: 4500000000, rate: 0.30 },
        { limit: Infinity, rate: 0.35 }
    ];

    for (const bracket of brackets) {
        const chunk = Math.min(remaining, bracket.limit);
        tax += chunk * bracket.rate;
        remaining -= chunk;
        if (remaining <= 0) break;
    }

    return tax;
};

export const calculateYearlyEstimate = (status: string, category: Category, salary: number, thr: number) => {
    const annualGross = (salary * 12) + thr;
    const annualDeductions = calculateDeductions(salary).total * 12;
    const biayaJabatan = Math.min(annualGross * 0.05, 6000000);

    const netIncome = annualGross - annualDeductions - biayaJabatan;
    const ptkp = getPTKPValue(status);
    const taxableIncome = Math.max(0, netIncome - ptkp);
    const yearlyTaxArt17 = calculateArticle17Tax(taxableIncome);

    const normalMonthlyTax = salary * getRate(category, salary);
    const thrMonthTax = (salary + thr) * getRate(category, salary + thr);

    const totalPaidJanToNov = (normalMonthlyTax * 10) + thrMonthTax;
    const decAdjustment = yearlyTaxArt17 - totalPaidJanToNov;
    const decNet = salary - decAdjustment - calculateDeductions(salary).total;

    return {
        annualGross,
        annualTax: yearlyTaxArt17,
        decAdjustment,
        decNet,
        monthlyBreakdown: [
            { month: 'Jan-Feb', tax: normalMonthlyTax },
            { month: 'Mar (THR)', tax: thrMonthTax },
            { month: 'Apr-Nov', tax: normalMonthlyTax },
            { month: 'Dec (Adj)', tax: decAdjustment }
        ]
    };
};

export const calculateTaxResult = (category: Category, salary: number, thr: number) => {
    const normalRate = getRate(category, salary);
    const normalTax = salary * normalRate;
    const normalDeductions = calculateDeductions(salary);

    const totalMarchGross = salary + thr;
    const marchRate = getRate(category, totalMarchGross);
    const marchTax = totalMarchGross * marchRate;

    const paydayNet = salary - marchTax - normalDeductions.total;

    return {
        payouts: {
            thr: thr,
            payday: paydayNet > 0 ? paydayNet : 0
        },
        normal: {
            income: salary,
            rate: normalRate,
            tax: normalTax,
            deductions: normalDeductions.total,
            net: salary - normalTax - normalDeductions.total
        },
        march: {
            gross: totalMarchGross,
            rate: marchRate,
            tax: marchTax,
            deductions: normalDeductions.total,
            net: totalMarchGross - marchTax - normalDeductions.total
        },
        details: {
            jht: normalDeductions.jht,
            bpjs: normalDeductions.bpjsKes,
            jp: normalDeductions.jp
        },
        hike: {
            absolute: marchTax - normalTax,
            percIncrease: normalTax > 0 ? ((marchTax - normalTax) / normalTax) * 100 : 0,
            thrDeduction: thr > 0 ? ((marchTax - normalTax) / thr) * 100 : 0
        }
    };
};
