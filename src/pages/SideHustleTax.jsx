import { useState } from "react";

const fmt = (n) => "£" + Math.round(Math.abs(n)).toLocaleString("en-GB");

function calcSideHustleTax(employment, sideIncome, expenses) {
  const tradingAllowance = 1000;
  const net = sideIncome - expenses;
  const useTradingAllowance = expenses < tradingAllowance;
  const taxableProfit = useTradingAllowance ? Math.max(sideIncome - tradingAllowance, 0) : Math.max(net, 0);
  const totalIncome = employment + taxableProfit;

  const pa = totalIncome > 100000 ? Math.max(12570 - (totalIncome - 100000) / 2, 0) : 12570;
  const alreadyUsedPA = Math.min(employment, pa);
  const remainingPA = Math.max(pa - alreadyUsedPA, 0);

  const sideAfterPA = Math.max(taxableProfit - remainingPA, 0);

  const basicBand = 50270 - pa;
  const employmentInBasic = Math.max(Math.min(employment - pa, basicBand), 0);
  const remainingBasic = Math.max(basicBand - employmentInBasic, 0);

  let tax = 0;
  if (sideAfterPA <= remainingBasic) {
    tax = sideAfterPA * 0.20;
  } else {
    tax = remainingBasic * 0.20;
    const inHigher = sideAfterPA - remainingBasic;
    const higherBand = 125140 - 50270;
    const employmentInHigher = Math.max(Math.min(employment - 50270, higherBand), 0);
    const remainingHigher = Math.max(higherBand - employmentInHigher, 0);

    if (inHigher <= remainingHigher) {
      tax += inHigher * 0.40;
    } else {
      tax += remainingHigher * 0.40;
      tax += (inHigher - remainingHigher) * 0.45;
    }
  }

  // Class 4 NI on side income
  let ni = 0;
  if (taxableProfit > 12570) {
    const niBasic = Math.min(taxableProfit, 50270) - 12570;
    ni = niBasic * 0.06;
    if (taxableProfit > 50270) {
      ni += (taxableProfit - 50270) * 0.02;
    }
  }

  
  const class2NI = taxableProfit > 12570 ? 179.40 : 0;
  const totalTax = tax + ni + class2NI;
  const takeHome = sideIncome - expenses - totalTax;
  const needsSATR = sideIncome > tradingAllowance;

  return {
    sideIncome, expenses, taxableProfit, useTradingAllowance,
    incomeTax: tax, class4NI: ni, class2NI, totalTax,
    takeHome, effectiveRate: sideIncome > 0 ? (totalTax / sideIncome) * 100 : 0,
    needsSATR, totalIncome,
    taxBand: totalIncome <= 50270 ? "Basic (20%)" : totalIncome <= 125140 ? "Higher (40%)" : "Additional (45%)",
  };
}

export default function SideHustleTaxCalc() {
  const [employment, setEmployment] = useState("35000");
  const [sideIncome, setSideIncome] = useState("8000");
  const [expenses, setExpenses] = useState("1500");

  const emp = parseFloat(employment.replace(/,/g, "")) || 0;
  const side = parseFloat(sideIncome.replace(/,/g, "")) || 0;
  const exp = parseFloat(expenses.replace(/,/g, "")) || 0;

  const r = calcSideHustleTax(emp, side, exp);

  return (
    <div style={S.page}>
      <style>{css}</style>
      <div style={S.container}>
        <div style={S.header}>
          <div style={S.badge}>SELF ASSESSMENT</div>
          <h1 style={S.title}>Side Hustle Tax Calculator</h1>
          <p style={S.sub}>Earning extra income alongside your job? See exactly how much tax you'll owe HMRC on your side hustle profits.</p>
        </div>

        <div style={S.card}>
          <label style={S.label}>Employment Salary (Annual)</label>
          <div style={S.inputWrap}>
            <span style={S.pfx}>£</span>
            <input type="text" inputMode="numeric" value={employment} onChange={(e) => setEmployment(e.target.value.replace(/[^0-9]/g, ""))} style={S.input} placeholder="35,000" />
          </div>

          <label style={S.label}>Side Hustle Gross Income (Annual)</label>
          <div style={S.inputWrap}>
            <span style={S.pfx}>£</span>
            <input type="text" inputMode="numeric" value={sideIncome} onChange={(e) => setSideIncome(e.target.value.replace(/[^0-9]/g, ""))} style={S.input} placeholder="8,000" />
          </div>

          <label style={S.label}>Allowable Expenses (Annual)</label>
          <div style={S.inputWrap}>
            <span style={S.pfx}>£</span>
            <input type="text" inputMode="numeric" value={expenses} onChange={(e) => setExpenses(e.target.value.replace(/[^0-9]/g, ""))} style={S.input} placeholder="1,500" />
          </div>

          <div style={S.bigResult}>
            <div style={S.bigRow}>
              <div>
                <div style={S.bigLabel}>Tax Owed on Side Income</div>
                <div style={S.bigVal}>{fmt(r.totalTax)}</div>
              </div>
              <div style={S.bigDivider} />
              <div>
                <div style={S.bigLabel}>You Keep</div>
                <div style={{ ...S.bigVal, color: "#4ade80" }}>{fmt(r.takeHome)}</div>
              </div>
            </div>
          </div>

          {r.useTradingAllowance && (
            <div style={S.tip}>
              Using the £1,000 trading allowance instead of expenses (better for you in this case).
            </div>
          )}

          {r.needsSATR && (
            <div style={S.warn}>
              You need to file a Self Assessment tax return. Side income exceeds the £1,000 trading allowance.
            </div>
          )}

          {!r.needsSATR && side > 0 && (
            <div style={S.good}>
              Your side income is within the £1,000 trading allowance — no tax return needed.
            </div>
          )}

          <div style={S.breakdown}>
            <div style={S.bTitle}>How It Breaks Down</div>
            <div style={S.bRow}><span>Side Hustle Gross Income</span><span style={{ fontWeight: 700 }}>{fmt(r.sideIncome)}</span></div>
            <div style={S.bRow}><span>{r.useTradingAllowance ? "Trading Allowance" : "Expenses"}</span><span>-{fmt(r.useTradingAllowance ? 1000 : r.expenses)}</span></div>
            <div style={S.bRow}><span>Taxable Profit</span><span style={{ fontWeight: 700 }}>{fmt(r.taxableProfit)}</span></div>
            <div style={S.bRow}><span>Your Tax Band (with employment)</span><span>{r.taxBand}</span></div>
            <div style={{ ...S.bRow, borderTop: "1px solid #ddd", paddingTop: 10, marginTop: 4 }} />
            <div style={S.bRow}><span>Income Tax</span><span style={{ color: "#dc2626" }}>-{fmt(r.incomeTax)}</span></div>
            <div style={S.bRow}><span>Class 4 NI</span><span style={{ color: "#dc2626" }}>-{fmt(r.class4NI)}</span></div>
            <div style={S.bRow}><span>Class 2 NI</span><span style={{ color: "#dc2626" }}>-{fmt(r.class2NI)}</span></div>
            <div style={{ ...S.bRow, borderTop: "2px solid #1a1a1a", fontWeight: 700, paddingTop: 10 }}>
              <span>Total Tax</span><span style={{ color: "#dc2626" }}>{fmt(r.totalTax)}</span>
            </div>
          </div>

          <div style={S.effRate}>
            Effective tax rate on side income: {r.effectiveRate.toFixed(1)}%
          </div>
        </div>

        <div style={S.info}>
          <h2 style={S.infoTitle}>Side Hustle Tax Explained</h2>
          <p style={S.infoText}>If you earn over £1,000 from self-employment alongside a PAYE job, you need to register for Self Assessment and file a tax return. Your side income is taxed on top of your employment income, so it falls into whatever band your salary puts you in.</p>
          <p style={S.infoText}>You can either use the £1,000 trading allowance (no receipts needed) or deduct actual business expenses — whichever gives you a lower tax bill. You'll also pay Class 4 National Insurance on profits above £12,570, and a flat Class 2 NI charge of £179.40/year.</p>
          <h3 style={S.infoSub}>Common Allowable Expenses</h3>
          <p style={S.infoText}>Equipment and tools, software subscriptions, web hosting, marketing costs, phone and internet (business proportion), home office costs (simplified: £6/week), travel, professional development, and accountancy fees.</p>
        </div>

        <div style={S.footer}>For illustrative purposes only. Rates for 2025/26 tax year. Consult a tax professional for personalised advice.</div>
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Karla:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #f5f0eb; }
`;

const S = {
  page: { fontFamily: "'Karla', sans-serif", background: "#f5f0eb", minHeight: "100vh", color: "#1a1a1a", padding: "24px 16px" },
  container: { maxWidth: 560, margin: "0 auto" },
  header: { textAlign: "center", marginBottom: 28 },
  badge: { display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#9333ea", background: "rgba(147,51,234,0.08)", padding: "4px 12px", borderRadius: 100, marginBottom: 14 },
  title: { fontFamily: "'Instrument Serif', serif", fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 400, lineHeight: 1.15, marginBottom: 8 },
  sub: { fontSize: 14, color: "#6b6b6b", lineHeight: 1.6, maxWidth: 480, margin: "0 auto" },
  card: { background: "#fff", borderRadius: 16, padding: "24px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" },
  label: { display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: "#999", textTransform: "uppercase", marginBottom: 6, marginTop: 16 },
  inputWrap: { display: "flex", alignItems: "center", background: "#f9f7f4", borderRadius: 10, border: "2px solid #e8e4de" },
  pfx: { padding: "0 0 0 12px", fontSize: 18, fontWeight: 700, color: "#9333ea" },
  input: { flex: 1, padding: "12px", fontSize: 18, fontWeight: 700, border: "none", background: "transparent", outline: "none", fontFamily: "'Karla', sans-serif" },
  bigResult: { marginTop: 24, padding: 20, background: "#1a1a1a", borderRadius: 14 },
  bigRow: { display: "flex", justifyContent: "center", alignItems: "center", gap: 24 },
  bigLabel: { fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, textAlign: "center" },
  bigVal: { fontFamily: "'Instrument Serif', serif", fontSize: 30, color: "#fff", textAlign: "center" },
  bigDivider: { width: 1, height: 48, background: "#333" },
  tip: { marginTop: 12, padding: "8px 12px", background: "#eff6ff", borderRadius: 8, fontSize: 12, color: "#1e40af" },
  warn: { marginTop: 12, padding: "8px 12px", background: "#fef3c7", borderRadius: 8, fontSize: 12, color: "#92400e" },
  good: { marginTop: 12, padding: "8px 12px", background: "#ecfdf5", borderRadius: 8, fontSize: 12, color: "#065f46" },
  breakdown: { marginTop: 20 },
  bTitle: { fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: "#999", textTransform: "uppercase", marginBottom: 8 },
  bRow: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0ede8", fontSize: 14, color: "#555" },
  effRate: { textAlign: "center", marginTop: 14, fontSize: 13, color: "#9333ea", fontWeight: 600 },
  info: { marginTop: 28, padding: "20px 0" },
  infoTitle: { fontFamily: "'Instrument Serif', serif", fontSize: 22, marginBottom: 12 },
  infoSub: { fontSize: 15, fontWeight: 700, marginTop: 14, marginBottom: 6 },
  infoText: { fontSize: 14, color: "#555", lineHeight: 1.75, marginBottom: 10 },
  footer: { marginTop: 20, padding: "14px 0", borderTop: "1px solid #e0dbd4", fontSize: 12, color: "#999", textAlign: "center", lineHeight: 1.6 },
};
