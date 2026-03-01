import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, TrendingUp, AlertCircle, CreditCard, ShieldCheck, Calculator, X, Calendar, Sun, Moon, Activity } from 'lucide-react';
import { calculateTaxResult, calculateYearlyEstimate } from './lib/taxEngine';
import type { Category } from './lib/taxEngine';
import { useAnimatedNumber } from './lib/useAnimatedNumber';
import CustomBarChart from './components/CustomBarChart';
import InfoTooltip from './components/InfoTooltip';
import RateBar from './components/RateBar';

const PTKP_OPTIONS = [
  { id: 'TK/0', label: 'ptkp_tk0', cat: 'A' },
  { id: 'TK/1', label: 'ptkp_tk1', cat: 'A' },
  { id: 'K/0', label: 'ptkp_k0', cat: 'A' },
  { id: 'TK/2', label: 'ptkp_tk2', cat: 'B' },
  { id: 'TK/3', label: 'ptkp_tk3', cat: 'B' },
  { id: 'K/1', label: 'ptkp_k1', cat: 'B' },
  { id: 'K/2', label: 'ptkp_k2', cat: 'B' },
  { id: 'K/3', label: 'ptkp_k3', cat: 'C' },
];

const formatIDR = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
const formatPerc = (n: number) => (n * 100).toFixed(2) + '%';

function AnimatedIDR({ value }: { value: number }) {
  const animated = useAnimatedNumber(value);
  return <>{formatIDR(animated)}</>;
}

export default function App() {
  const { t, i18n } = useTranslation();
  const [salary, setSalary] = useState(10000000);
  const [tenure, setTenure] = useState(12);
  const [ptkpId, setPtkpId] = useState('TK/0');
  const [showYearly, setShowYearly] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'id' ? 'en' : 'id');
  };

  const toggleTheme = () => {
    document.body.classList.add('theme-transitioning');

    const newTheme = theme === 'dark' ? 'light' : 'dark';

    // Force reflow so the transition: none takes effect
    void document.body.offsetHeight;

    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 150);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const currentCategory = useMemo(() => {
    return (PTKP_OPTIONS.find(o => o.id === ptkpId)?.cat || 'A') as Category;
  }, [ptkpId]);

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setSalary(Number(rawValue));
  };

  const calculatedTHR = useMemo(() => {
    if (tenure >= 12) return salary;
    return (tenure / 12) * salary;
  }, [salary, tenure]);

  const result = useMemo(() => calculateTaxResult(currentCategory, salary, calculatedTHR), [currentCategory, salary, calculatedTHR]);
  const yearly = useMemo(() => calculateYearlyEstimate(ptkpId, currentCategory, salary, calculatedTHR), [ptkpId, currentCategory, salary, calculatedTHR]);

  const chartData = [
    { name: t('chart_normal'), value: result.normal.tax, color: 'var(--accent)' },
    { name: t('chart_thr'), value: result.march.tax, color: 'var(--accent-red)' },
  ];

  return (
    <div className="app-container">
      <div className="header">
        <div className="controls-group">
          {/* Theme Toggle */}
          <div className="toggle-switch" onClick={toggleTheme}>
            <div className={`toggle-option ${theme === 'light' ? 'active' : ''}`}><Sun size={14} /></div>
            <div className={`toggle-option ${theme === 'dark' ? 'active' : ''}`}><Moon size={14} /></div>
          </div>
          {/* Language Toggle */}
          <div className="toggle-switch" onClick={toggleLang}>
            <div className={`toggle-option ${i18n.language.startsWith('en') ? 'active' : ''}`}>EN</div>
            <div className={`toggle-option ${i18n.language.startsWith('id') ? 'active' : ''}`}>ID</div>
          </div>
        </div>

        <h1>{t('title')}</h1>
        <p style={{ color: 'var(--text-dim)' }}>{t('subtitle')}</p>
      </div>

      {showYearly && (
        <div className="modal-overlay" onClick={() => setShowYearly(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowYearly(false)}><X size={20} /></button>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calendar size={24} color="var(--accent)" /> {t('yearly_modal_title')}
              <InfoTooltip text={t('info_art17')} placement="bottom" />
            </h2>

            <div className="grid-inputs" style={{ marginBottom: '2rem' }}>
              <div className="stat-card">
                <div className="label">{t('yearly_total_gross')}</div>
                <div className="val" style={{ fontSize: '1.5rem' }}>{formatIDR(yearly.annualGross)}</div>
              </div>
              <div className="stat-card">
                <div className="label">{t('yearly_total_tax')}</div>
                <div className="val" style={{ fontSize: '1.5rem', color: 'var(--accent-red)' }}>{formatIDR(yearly.annualTax)}</div>
              </div>
            </div>

            <h4 style={{ color: 'var(--text-dim)', marginBottom: '1rem' }}>{t('yearly_breakdown')}</h4>
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th>Periode</th>
                  <th>Pajak (Estimasi)</th>
                </tr>
              </thead>
              <tbody>
                {yearly.monthlyBreakdown.map((b, i) => (
                  <tr key={i} className={b.month.includes('Dec') ? 'highlight-row' : ''}>
                    <td>{b.month}</td>
                    <td>{formatIDR(b.tax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="card stat-card highlight" style={{ background: 'var(--accent-amber-bg)', border: '1px solid var(--accent-amber-border)', marginBottom: '1.5rem' }}>
              <div className="label" style={{ color: 'var(--accent-amber)' }}><AlertCircle size={18} /> {t('yearly_dec_adj')}</div>
              <div className="val" style={{ color: 'var(--accent-amber)', fontSize: '1.8rem' }}>{yearly.decAdjustment > 0 ? '+' : ''}{formatIDR(yearly.decAdjustment)}</div>
              <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.5rem' }}>{t('yearly_note')}</p>
            </div>

            <div className="card stat-card highlight" style={{ background: 'var(--accent-green-bg)', border: '1px solid var(--accent-green-border)' }}>
              <div className="label" style={{ color: 'var(--accent-green)' }}><Wallet size={18} /> {t('yearly_dec_net')}</div>
              <div className="val" style={{ color: 'var(--accent-green)' }}>{formatIDR(yearly.decNet)}</div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="grid-inputs">
          <div className="input-box">
            <label>{t('label_salary')}</label>
            <input
              type="text"
              value={salary === 0 ? '' : salary.toLocaleString('id-ID')}
              onChange={handleSalaryChange}
            />
          </div>

          <div className="input-box">
            <label style={{ display: 'flex', alignItems: 'center' }}>
              {t('label_ptkp')}
              <InfoTooltip text={t('info_ptkp')} />
            </label>
            <select value={ptkpId} onChange={(e) => setPtkpId(e.target.value)}>
              {PTKP_OPTIONS.map(o => <option key={o.id} value={o.id}>{t(o.label)}</option>)}
            </select>
          </div>

          <div className="input-box">
            <label>{t('label_tenure')}</label>
            <div className="slider-box">
              <input
                type="range" min="1" max="12" value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                style={{ flex: 1, '--value': `${(tenure / 12) * 100}%` } as any}
              />
              <span style={{ minWidth: '3.5rem', fontWeight: 600 }}>{tenure} {t('months')}</span>
            </div>
          </div>
        </div>

        <div className="dashboard">
          <div className="card stat-card">
            <div className="label"><Wallet size={18} /> {t('stat_normal')}</div>
            <div className="val"><AnimatedIDR value={result.normal.tax} /></div>
            <div className="badge" style={{ background: 'var(--accent-blue-bg)', color: 'var(--accent-blue-text)', borderColor: 'var(--accent-blue-border)' }}>
              {formatPerc(result.normal.rate)}
            </div>
          </div>

          <div className="card stat-card tax">
            <div className="label"><CreditCard size={18} /> {t('stat_thr_month')}</div>
            <div className="val"><AnimatedIDR value={result.march.tax} /></div>
            <div className="badge">{formatPerc(result.march.rate)}</div>
          </div>

          <div className="card stat-card hike">
            <div className="label"><TrendingUp size={18} /> {t('stat_hike')}</div>
            <div className="val">+<AnimatedIDR value={result.hike.absolute} /></div>
            <div className="badge" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
              {result.hike.isFromZero
                ? t('hike_from_zero', { perc: (result.march.rate * 100).toFixed(2) })
                : t('hike_warning', { perc: result.hike.percIncrease.toFixed(0) })}
            </div>
          </div>

          {/* Tax Rate Progress Bars */}
          <div className="card stat-card full-span">
            <div className="label" style={{ marginBottom: '1rem' }}>
              <Activity size={18} /> {t('visual_info')} <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{currentCategory}</span>
              <InfoTooltip text={t('info_ter')} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <RateBar rate={result.normal.rate} label={t('stat_normal_rate')} />
              <RateBar rate={result.march.rate} label={t('stat_thr_rate')} />
            </div>
          </div>

          <div className="card full-span">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} style={{ color: 'var(--accent-green)' }} /> {t('label_deductions')}
            </h3>
            <div className="deductions-list">
              <div className="deduction-item">
                <span style={{ display: 'flex', alignItems: 'center' }}>{t('deduction_jht')} <InfoTooltip text={t('info_jht')} /></span>
                <span>-<AnimatedIDR value={result.details.jht} /></span>
              </div>
              <div className="deduction-item">
                <span style={{ display: 'flex', alignItems: 'center' }}>{t('deduction_bpjs')} <InfoTooltip text={t('info_bpjs')} /></span>
                <span>-<AnimatedIDR value={result.details.bpjs} /></span>
              </div>
              <div className="deduction-item">
                <span style={{ display: 'flex', alignItems: 'center' }}>{t('deduction_jp')} <InfoTooltip text={t('info_jp')} /></span>
                <span>-<AnimatedIDR value={result.details.jp} /></span>
              </div>
              <div className="deduction-item total">
                <span>{t('total_deductions')}</span>
                <span>-<AnimatedIDR value={result.normal.deductions} /></span>
              </div>
            </div>
          </div>

          <div className="card stat-card highlight" style={{ background: 'var(--accent-blue-bg)', border: '1px solid var(--accent-blue-border)' }}>
            <div className="label" style={{ color: 'var(--accent-blue-text)' }}><CreditCard size={18} /> {t('stat_thr_receipt')}</div>
            <div className="val" style={{ color: 'var(--accent-blue-text)' }}><AnimatedIDR value={result.payouts.thr} /></div>
            <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>{t('desc_thr_receipt')}</p>
          </div>

          <div className="card stat-card highlight" style={{ background: 'var(--accent-green-bg)', border: '1px solid var(--accent-green-border)' }}>
            <div className="label" style={{ color: 'var(--accent-green)' }}><Wallet size={18} /> {t('stat_payday_receipt')}</div>
            <div className="val" style={{ color: 'var(--accent-green)' }}><AnimatedIDR value={result.payouts.payday} /></div>
            <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>{t('desc_payday_receipt')}</p>
          </div>

          <div className="full-span" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
            <button className="btn-primary" onClick={() => setShowYearly(true)}>
              <Calculator size={18} /> {t('btn_yearly_est')}
            </button>
          </div>

          {/* Custom SVG Bar Chart — replaces Recharts */}
          <div className="card chart-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem' }}>{t('visual_title')}</h3>
            </div>
            <CustomBarChart data={chartData} formatValue={formatIDR} height={260} />
          </div>
        </div>
      </div>

      <footer style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
        <p>{t('disclaimer')}</p>
      </footer>
    </div>
  );
}
