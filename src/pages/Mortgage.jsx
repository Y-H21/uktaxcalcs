import { useState } from "react";

function calcMortgage(principal, annualRate, years) {
  if (principal <= 0 || annualRate <= 0 || years <= 0) return { monthly: 0, total: 0, interest: 0 };
  const r = annualRate / 100 / 12;
  const n = years * 12;
  const monthly = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total = monthly * n;
  return { monthly, total, interest: total - principal };
}

export default function MortgageCalc() {
  const [salary, setSalary] = useState("55000");
  const [salary2, setSalary2] = useState("");
  const [deposit, setDeposit] = useState("40000");
  const [rate, setRate] = useState("4.5");
  const [term, setTerm] = useState("25");

  const s1 = parseFloat(salary.replace(/,/g, "")) || 0;
  const s2 = parseFloat(salary2.replace(/,/g, "")) || 0;
  const dep = parseFloat(deposit.replace(/,/g, "")) || 0;
  const r = parseFloat(rate) || 0;
  const t = parseInt(term) || 25;

  const totalIncome = s1 + s2;
  const maxBorrow = totalIncome * 4.5;
  const maxProperty = maxBorrow + dep;
  const ltv = maxProperty > 0 ? ((maxBorrow / maxProperty) * 100).toFixed(0) : 0;

  const { monthly, total, interest } = calcMortgage(maxBorrow, r, t);

  const affordCheck = monthly > 0 ? ((monthly / (totalIncome / 12)) * 100).toFixed(0) : 0;

  const fmt = (n) => n.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <div style={S.page}>
      <style>{css}</style>
      <div style={S.container}>
        <div style={S.header}>
          <div style={S.badge}>2026 RATES</div>
          <h1 style={S.title}>Mortgage Affordability Calculator</h1>
          <p style={S.sub}>Find out how much you could borrow based on your income, using the standard 4.5x salary multiplier used by most UK lenders.</p>
        </div>

        <div style={S.card}>
          <div style={S.row}>
            <div style={S.field}>
              <label style={S.label}>Your Annual Salary</label>
              <div style={S.inputWrap}>
                <span style={S.prefix}>£</span>
                <input
                  type="text" inputMode="numeric"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value.replace(/[^0-9]/g, ""))}
                  style={S.input} placeholder="55,000"
                />
              </div>
            </div>
            <div style={S.field}>
              <label style={S.label}>Partner's Salary (optional)</label>
              <div style={S.inputWrap}>
                <span style={S.prefix}>£</span>
                <input
                  type="text" inputMode="numeric"
                  value={salary2}
                  onChange={(e) => setSalary2(e.target.value.replace(/[^0-9]/g, ""))}
                  style={S.input} placeholder="0"
                />
              </div>
            </div>
          </div>

          <div style={S.row}>
            <div style={S.field}>
              <label style={S.label}>Deposit</label>
              <div style={S.inputWrap}>
                <span style={S.prefix}>£</span>
                <input
                  type="text" inputMode="numeric"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value.replace(/[^0-9]/g, ""))}
                  style={S.input} placeholder="40,000"
                />
              </div>
            </div>
            <div style={S.field}>
              <label style={S.label}>Interest Rate (%)</label>
              <div style={S.inputWrap}>
                <input
                  type="text" inputMode="decimal"
                  value={rate}
                  onChange={(e) => setRate(e.target.value.replace(/[^0-9.]/g, ""))}
                  style={S.input} placeholder="4.5"
                />
                <span style={S.suffix}>%</span>
              </div>
            </div>
          </div>

          <div style={S.field}>
            <label style={S.label}>Mortgage Term</label>
            <div style={S.sliderRow}>
              <input
                type="range" min="5" max="40" value={term}
                onChange={(e) => setTerm(e.target.value)}
                style={S.slider}
              />
              <span style={S.sliderVal}>{term} years</span>
            </div>
          </div>

          <div style={S.results}>
            <div style={S.resultCard}>
              <div style={S.rcLabel}>Max Property Price</div>
              <div style={S.rcValue}>£{fmt(maxProperty)}</div>
            </div>
            <div style={S.resultCard}>
              <div style={S.rcLabel}>Max You Can Borrow</div>
              <div style={S.rcValue}>£{fmt(maxBorrow)}</div>
            </div>
            <div style={S.resultCard}>
              <div style={S.rcLabel}>Monthly Payment</div>
              <div style={S.rcValue}>£{fmt(monthly)}</div>
            </div>
            <div style={S.resultCard}>
              <div style={S.rcLabel}>Total Interest Paid</div>
              <div style={S.rcValue}>£{fmt(interest)}</div>
            </div>
          </div>

          <div style={S.metricRow}>
            <div style={S.metric}>
              <span style={S.metricLabel}>LTV Ratio</span>
              <span style={S.metricVal}>{ltv}%</span>
            </div>
            <div style={S.metric}>
              <span style={S.metricLabel}>Income to Payment</span>
              <span style={{
                ...S.metricVal,
                color: affordCheck > 35 ? "#dc2626" : affordCheck > 28 ? "#d97706" : "#16a34a"
              }}>{affordCheck}%</span>
            </div>
            <div style={S.metric}>
              <span style={S.metricLabel}>Total Repaid</span>
              <span style={S.metricVal}>£{fmt(total)}</span>
            </div>
          </div>

          {affordCheck > 35 && (
            <div style={S.warning}>
              Your monthly payments would exceed 35% of gross income. Most lenders prefer this to be below 28-35%. Consider a longer term or larger deposit.
            </div>
          )}
        </div>

        <div style={S.info}>
          <h2 style={S.infoTitle}>How Mortgage Affordability Works</h2>
          <p style={S.infoText}>
            Most UK lenders use an income multiplier of 4 to 4.5 times your gross annual salary to determine the maximum amount they'll lend. Some specialist lenders offer up to 5.5x for high earners. This calculator uses the standard 4.5x multiplier.
          </p>
          <p style={S.infoText}>
            Beyond the multiplier, lenders also assess your monthly outgoings, credit score, deposit size, and the property value. They'll stress-test your ability to pay at higher interest rates, typically 2-3% above the product rate.
          </p>
          <h3 style={S.infoSub}>Tips to Increase Your Borrowing Power</h3>
          <p style={S.infoText}>
            Reduce existing debts and credit card balances before applying. A larger deposit improves your LTV ratio and unlocks better rates. Joint applications combine both salaries. Some professions (doctors, solicitors, accountants) qualify for enhanced multipliers with certain lenders.
          </p>
        </div>

        <div style={S.footer}>
          <p>For illustrative purposes only. Actual borrowing depends on individual lender criteria, credit score, and affordability assessment.</p>
        </div>
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Karla:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #f5f0eb; }
  input[type=range] { -webkit-appearance: none; width: 100%; height: 6px; border-radius: 3px; background: #e0dbd4; outline: none; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #1a1a1a; cursor: pointer; border: 3px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
`;

const S = {
  page: { fontFamily: "'Karla', sans-serif", background: "#f5f0eb", minHeight: "100vh", color: "#1a1a1a", padding: "24px 16px" },
  container: { maxWidth: 600, margin: "0 auto" },
  header: { textAlign: "center", marginBottom: 28 },
  badge: { display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#2d6a4f", background: "rgba(45,106,79,0.1)", padding: "4px 12px", borderRadius: 100, marginBottom: 14 },
  title: { fontFamily: "'Instrument Serif', serif", fontSize: "clamp(26px, 5vw, 38px)", fontWeight: 400, lineHeight: 1.15, marginBottom: 10 },
  sub: { fontSize: 14, color: "#6b6b6b", lineHeight: 1.6, maxWidth: 480, margin: "0 auto" },
  card: { background: "#fff", borderRadius: 16, padding: "24px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" },
  row: { display: "flex", gap: 12 },
  field: { flex: 1, marginBottom: 16 },
  label: { display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: "#999", textTransform: "uppercase", marginBottom: 6 },
  inputWrap: { display: "flex", alignItems: "center", background: "#f9f7f4", borderRadius: 10, border: "2px solid #e8e4de", overflow: "hidden" },
  prefix: { padding: "0 0 0 12px", fontSize: 18, fontWeight: 700, color: "#2d6a4f" },
  suffix: { padding: "0 12px 0 0", fontSize: 16, fontWeight: 700, color: "#2d6a4f" },
  input: { flex: 1, padding: "12px", fontSize: 18, fontWeight: 700, border: "none", background: "transparent", outline: "none", fontFamily: "'Karla', sans-serif", color: "#1a1a1a" },
  sliderRow: { display: "flex", alignItems: "center", gap: 16 },
  slider: { flex: 1 },
  sliderVal: { fontSize: 16, fontWeight: 700, color: "#1a1a1a", minWidth: 70, textAlign: "right" },
  results: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 24 },
  resultCard: { background: "#1a1a1a", borderRadius: 12, padding: "16px 14px", textAlign: "center" },
  rcLabel: { fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 },
  rcValue: { fontFamily: "'Instrument Serif', serif", fontSize: 24, color: "#fff" },
  metricRow: { display: "flex", gap: 10, marginTop: 14 },
  metric: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 8px", background: "#f9f7f4", borderRadius: 10 },
  metricLabel: { fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em" },
  metricVal: { fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginTop: 2 },
  warning: { marginTop: 14, padding: "10px 14px", background: "#fef2f2", borderRadius: 8, fontSize: 13, color: "#dc2626", lineHeight: 1.5 },
  info: { marginTop: 28, padding: "20px 0" },
  infoTitle: { fontFamily: "'Instrument Serif', serif", fontSize: 22, marginBottom: 12 },
  infoSub: { fontSize: 15, fontWeight: 700, marginTop: 14, marginBottom: 6 },
  infoText: { fontSize: 14, color: "#555", lineHeight: 1.75, marginBottom: 10 },
  footer: { marginTop: 20, padding: "14px 0", borderTop: "1px solid #e0dbd4", fontSize: 12, color: "#999", textAlign: "center", lineHeight: 1.6 },
};
