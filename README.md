# 🧮 THR Tax Estimator

A premium, interactive web application designed to help Indonesian employees estimate their **Take Home Pay** during the THR (Tunjangan Hari Raya) month, factoring in the new **TER (Tarif Efektif Rata-rata)** tax method.

![Premium Design](https://img.shields.io/badge/Design-Premium%20Dark-blueviolet)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-6-646CFF)

## 🚀 Key Features

### 1. New TER Method (PMK 168/2023)
The app is built with the latest Indonesian tax regulations. It automatically maps your **Status PTKP** (TK/0, K/1, etc.) to the correct **TER Category (A, B, or C)** and applies the monthly average rate.

### 2. Pro-rated THR Calculation
Calculates your estimated THR based on Indonesian labor law:
*   **>= 12 Months**: Full 1x Gross Salary.
*   **< 12 Months**: Pro-rated calculation `(Tenure / 12) * Salary`.

### 3. Chronological Payout Visualization
Most calculators only show a total monthly figure. This app splits it into two realistic "receipts":
*   **Early Month**: The gross THR distribution usually received 1-2 weeks before Eid.
*   **Payday (25th)**: The net salary received at the end of the month, adjusted for the combined tax hike.

### 4. Mandatory Deductions (BPJS & JHT)
Includes automated calculation for mandatory employee contributions:
*   **JHT (Jaminan Hari Tua)**: 2% of gross salary.
*   **BPJS Kesehatan**: 1% (capped at Rp 12M salary).
*   **JP (Jaminan Pensiun)**: 1% (capped at 2024 limit).

### 5. Yearly Estimation & December Adjustment
Predicts your year-end "December Surprise":
*   Calculates total annual tax liability using **Article 17 (Progressive)** rates.
*   Compares it against total paid via TER (Jan-Nov).
*   Estimates the **December Tax Adjustment** (+ or -) and the final December Take Home Pay.

### 6. Robust i18n
Full support for **English** and **Bahasa Indonesia** with a persistent language switcher.

---

## 🛠 Technology Stack

*   **Frontend**: React 19 (Hooks, useMemo for real-time logic).
*   **Styling**: Vanilla CSS with Modern Aesthetics (Glassmorphism, Vibrant Gradients).
*   **Animations**: Framer Motion for smooth transitions.
*   **Visuals**: Recharts for animated tax impact bars.
*   **Localization**: i18next + react-i18next.
*   **Reliability**: Vitest for core calculation engine verification.

---

## 📂 Project Structure

```text
src/
├── lib/
│   ├── taxEngine.ts       # Core calculation logic
│   ├── taxBrackets.json   # Externalized government tax data
│   └── taxEngine.test.ts  # Vitest unit tests
├── i18n.ts                # Localization config (EN/ID)
├── App.tsx                # Main Dashboard UI
└── index.css              # Global design system & premium styles
```

---

## 💻 Local Development

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run development server**:
    ```bash
    npm run dev
    ```

3.  **Run unit tests**:
    ```bash
    npm test
    ```

---

## ⚖️ Disclaimer
*This tool provides estimates based on current Indonesian tax regulations (PMK 168/2023 and PPh 21 Article 17). Results may vary depending on specific company policies or individual tax status changes. Always consult with your company's HR/Payroll department for binding figures.*

© 2024 THR Tax Estimator
