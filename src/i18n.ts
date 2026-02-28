import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            title: "THR Tax Estimator",
            subtitle: "New TER Method (PMK 168/2023) Visualization",
            label_salary: "Monthly Salary (Gross)",
            label_tenure: "Tenure (Months)",
            label_thr: "Estimated THR",
            label_ptkp: "Tax Status (PTKP)",
            ptkp_tk0: "TK/0 - Single, No Dependents",
            ptkp_tk1: "TK/1 - Single, 1 Dependent",
            ptkp_k0: "K/0 - Married, No Dependents",
            ptkp_tk2: "TK/2 - Single, 2 Dependents",
            ptkp_tk3: "TK/3 - Single, 3 Dependents",
            ptkp_k1: "K/1 - Married, 1 Dependent",
            ptkp_k2: "K/2 - Married, 2 Dependents",
            ptkp_k3: "K/3 - Married, 3 Dependents",
            label_deductions: "Additional Deductions (BPJS/JHT)",
            stat_normal: "Normal Month Tax",
            stat_thr_month: "THR Month Tax",
            stat_hike: "The Tax Hike",
            stat_thp: "Est. Total Take Home Pay",
            stat_thr_receipt: "THR Distribution (Early Month)",
            stat_payday_receipt: "Payday Salary (25th)",
            desc_thr_receipt: "Estimated gross THR received before Eid",
            desc_payday_receipt: "Net salary after combined Tax & BPJS",
            visual_title: "Visualization",
            visual_info: "Based on TER Category",
            btn_yearly_est: "Estimate Yearly Taxes",
            yearly_modal_title: "Yearly Tax Estimation (Jan - Dec)",
            yearly_total_gross: "Total Annual Gross",
            yearly_total_tax: "Total Annual Tax (Art 17)",
            yearly_dec_adj: "December Tax Adjustment",
            yearly_dec_net: "December Est. Net Pay",
            yearly_breakdown: "Monthly Tax Breakdown",
            yearly_note: "The difference occurs because monthly taxes use TER (Daily/Monthly Average Rate) while the final tax is calculated globally using Article 17 (Progressive) rates.",
            hike_warning: "Your tax increased by {{perc}}% this month.",
            disclaimer: "2026 THR Tax Estimator • Built with TER Method (PMK 168/2023)",
            months: "Mo",
            full_salary: "Full 1x Salary",
            prorated: "Pro-rated",
            deduction_jht: "JHT (2%)",
            deduction_bpjs: "BPJS Health (1%)",
            deduction_jp: "Pension (1%)",
            total_deductions: "Total Mandatory Deductions",
            chart_normal: "Regular Month",
            chart_thr: "THR Month",
            lang_switch: "Switch to Bahasa"
        }
    },
    id: {
        translation: {
            title: "Estimator Pajak THR",
            subtitle: "Visualisasi Metode TER Baru (PMK 168/2023)",
            label_salary: "Gaji Bulanan (Bruto)",
            label_tenure: "Masa Kerja (Bulan)",
            label_thr: "Estimasi THR",
            label_ptkp: "Status PTKP",
            ptkp_tk0: "TK/0 - Lajang, Tanpa Tanggungan",
            ptkp_tk1: "TK/1 - Lajang, 1 Tanggungan",
            ptkp_k0: "K/0 - Menikah, Tanpa Tanggungan",
            ptkp_tk2: "TK/2 - Lajang, 2 Tanggungan",
            ptkp_tk3: "TK/3 - Lajang, 3 Tanggungan",
            ptkp_k1: "K/1 - Menikah, 1 Tanggungan",
            ptkp_k2: "K/2 - Menikah, 2 Tanggungan",
            ptkp_k3: "K/3 - Menikah, 3 Tanggungan",
            label_deductions: "Potongan Tambahan (BPJS/JHT)",
            stat_normal: "Pajak Bulan Biasa",
            stat_thr_month: "Pajak Bulan THR",
            stat_hike: "Kenaikan Pajak",
            stat_thp: "Est. Gaji Bersih (THP)",
            stat_thr_receipt: "Pencairan THR (Awal Bulan)",
            stat_payday_receipt: "Gaji Payday (Tgl 25)",
            desc_thr_receipt: "Estimasi THR kotor yang diterima sebelum Lebaran",
            desc_payday_receipt: "Gaji bersih setelah dipotong total Pajak & BPJS",
            visual_title: "Visualisasi",
            visual_info: "Berdasarkan TER Kategori",
            btn_yearly_est: "Estimasi Pajak Tahunan",
            yearly_modal_title: "Estimasi Pajak Tahunan (Jan - Des)",
            yearly_total_gross: "Total Bruto Tahunan",
            yearly_total_tax: "Total Pajak Tahunan (Pasal 17)",
            yearly_dec_adj: "Penyesuaian Pajak Desember",
            yearly_dec_net: "Estimasi Gaji Bersih Desember",
            yearly_breakdown: "Rincian Pajak Bulanan",
            yearly_note: "Perbedaan muncul karena pajak bulanan menggunakan TER (Tarif Efektif Rata-rata) sementara pajak akhir dihitung global menggunakan tarif Pasal 17 (Progressive).",
            hike_warning: "Pajak Anda naik sebesar {{perc}}% bulan ini.",
            disclaimer: "2026 Estimator Pajak THR • Dibuat dengan Metode TER (PMK 168/2023)",
            months: "Bln",
            full_salary: "Full 1x Gaji",
            prorated: "Pro-rata",
            deduction_jht: "JHT (2%)",
            deduction_bpjs: "BPJS Kes (1%)",
            deduction_jp: "Pensiun (1%)",
            total_deductions: "Total Potongan Wajib",
            chart_normal: "Bulan Biasa",
            chart_thr: "Bulan THR",
            lang_switch: "Ubah ke English"
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'id',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
