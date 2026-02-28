import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, TrendingUp, AlertCircle, CreditCard, Info, Languages, ShieldCheck, Calculator, X, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { calculateTaxResult, calculateYearlyEstimate } from './lib/taxEngine';
import type { Category } from './lib/taxEngine';

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

const formatIDR = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
const formatPerc = (n: number) => (n * 100).toFixed(2) + '%';

export default function App() {
  const { t, i18n } = useTranslation();
  const [salary, setSalary] = useState(10000000);
  const [tenure, setTenure] = useState(12);
  const [ptkpId, setPtkpId] = useState('TK/0');
  const [showYearly, setShowYearly] = useState(false);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'id' ? 'en' : 'id');
  };

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
    { name: t('chart_normal'), tax: result.normal.tax, fill: '#3b82f6' },
    { name: t('chart_thr'), tax: result.march.tax, fill: '#ef4444' },
  ];

  return (
    <div className="app-container">
      <div className="header">
        <button className="lang-toggle" onClick={toggleLang}>
          <Languages size={16} /> {t('lang_switch')}
        </button>
        <h1>{t('title')}</h1>
        <p style={{ color: 'var(--text-dim)' }}>{t('subtitle')}</p>
      </div>

      {showYearly && (
        <div className="modal-overlay" onClick={() => setShowYearly(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowYearly(false)}><X size={20} /></button>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calendar size={24} color="var(--accent)" /> {t('yearly_modal_title')}
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

            <div className="card stat-card highlight" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', marginBottom: '1.5rem' }}>
              <div className="label" style={{ color: 'var(--accent-amber)' }}><AlertCircle size={18} /> {t('yearly_dec_adj')}</div>
              <div className="val" style={{ color: 'var(--accent-amber)', fontSize: '1.8rem' }}>{yearly.decAdjustment > 0 ? '+' : ''}{formatIDR(yearly.decAdjustment)}</div>
              <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.5rem' }}>{t('yearly_note')}</p>
            </div>

            <div className="card stat-card highlight" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div className="label" style={{ color: '#10b981' }}><Wallet size={18} /> {t('yearly_dec_net')}</div>
              <div className="val" style={{ color: '#10b981' }}>{formatIDR(yearly.decNet)}</div>
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
            <label>{t('label_ptkp')}</label>
            <select value={ptkpId} onChange={(e) => setPtkpId(e.target.value)}>
              {PTKP_OPTIONS.map(o => <option key={o.id} value={o.id}>{t(o.label)}</option>)}
            </select>
          </div>

          <div className="input-box">
            <label>{t('label_tenure')}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
            <div className="val">{formatIDR(result.normal.tax)}</div>
            <div className="badge" style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', borderColor: 'rgba(96,165,250,0.2)' }}>
              {formatPerc(result.normal.rate)}
            </div>
          </div>

          <div className="card stat-card tax">
            <div className="label"><CreditCard size={18} /> {t('stat_thr_month')}</div>
            <div className="val">{formatIDR(result.march.tax)}</div>
            <div className="badge">{formatPerc(result.march.rate)}</div>
          </div>

          <div className="card stat-card hike">
            <div className="label"><TrendingUp size={18} /> {t('stat_hike')}</div>
            <div className="val">+{formatIDR(result.hike.absolute)}</div>
            <div className="badge" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
              {t('hike_warning', { perc: result.hike.percIncrease.toFixed(0) })}
            </div>
          </div>

          <div className="card" style={{ gridColumn: 'span 2' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} style={{ color: '#10b981' }} /> {t('label_deductions')}
            </h3>
            <div className="deductions-list">
              <div className="deduction-item">
                <span>{t('deduction_jht')}</span>
                <span>-{formatIDR(result.details.jht)}</span>
              </div>
              <div className="deduction-item">
                <span>{t('deduction_bpjs')}</span>
                <span>-{formatIDR(result.details.bpjs)}</span>
              </div>
              <div className="deduction-item">
                <span>{t('deduction_jp')}</span>
                <span>-{formatIDR(result.details.jp)}</span>
              </div>
              <div className="deduction-item total">
                <span>{t('total_deductions')}</span>
                <span>-{formatIDR(result.normal.deductions)}</span>
              </div>
            </div>
          </div>

          <div className="card stat-card highlight" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <div className="label" style={{ color: '#60a5fa' }}><CreditCard size={18} /> {t('stat_thr_receipt')}</div>
            <div className="val" style={{ color: '#60a5fa' }}>{formatIDR(result.payouts.thr)}</div>
            <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>{t('desc_thr_receipt')}</p>
          </div>

          <div className="card stat-card highlight" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div className="label" style={{ color: '#10b981' }}><Wallet size={18} /> {t('stat_payday_receipt')}</div>
            <div className="val" style={{ color: '#10b981' }}>{formatIDR(result.payouts.payday)}</div>
            <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>{t('desc_payday_receipt')}</p>
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem', minHeight: 'fit-content' }}>
            <button className="btn-primary" onClick={() => setShowYearly(true)}>
              <Calculator size={18} /> {t('btn_yearly_est')}
            </button>
          </div>

          <div className="card chart-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem' }}>{t('visual_title')}</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}><Info size={14} /> {t('visual_info')} {currentCategory}</div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-dim)" axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-dim)" hide />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ background: '#1e293b', border: '1px solid var(--border)', borderRadius: '12px' }}
                  formatter={(v: any) => [formatIDR(Number(v)), 'Pajak']}
                />
                <Bar dataKey="tax" radius={[10, 10, 0, 0]} barSize={60}>
                  {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <footer style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
        <p>{t('disclaimer')}</p>
      </footer>
    </div>
  );
}
