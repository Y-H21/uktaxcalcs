import { useState } from "react";

const fmt = (n) => "£" + Math.round(n).toLocaleString("en-GB");
const pct = (n) => n.toFixed(2) + "%";

export default function RentalYieldCalc() {
  const [price, setPrice] = useState("250000");
  const [rent, setRent] = useState("1200");
  const [mortgage, setMortgage] = useState("800");
  const [mgmt, setMgmt] = useState("10");
  const [maintenance, setMaintenance] = useState("100");
  const [insurance, setInsurance] = useState("30");
  const [void_, setVoid] = useState("4");

  
  const p = parseFloat(price.replace(/,/g, "")) || 0;
  const r = parseFloat(rent.replace(/,/g, "")) || 0;
  const m = parseFloat(mortgage.replace(/,/g, "")) || 0;
  const mg = parseFloat(mgmt) || 0;
  const mt = parseFloat(maintenance) || 0;
  const ins = parseFloat(insurance) || 0;
  const vd = parseFloat(void_) || 0;

  const annualRent = r * 12;
  const effectiveRent = annualRent * (1 - vd / 100);
  const mgmtCost = effectiveRent * (mg / 100);
  const annualMaintenance = mt * 12;
  const annualInsurance = ins * 12;
  const annualMortgage = m * 12;
  const totalExpenses = mgmtCost + annualMaintenance + annualInsurance;
  const grossYield = p > 0 ? (annualRent / p) * 100 : 0;
  const netYield = p > 0 ? ((effectiveRent - totalExpenses) / p) * 100 : 0;
  const monthlyCashflow = (effectiveRent - totalExpenses - annualMortgage) / 12;
  const annualCashflow = monthlyCashflow * 12;
  const roi = p > 0 ? (annualCashflow / (p * 0.25)) * 100 : 0; // Assumes 25% deposit

  return (
    <div style={S.page}>
      <style>{css}</style>
      <div style={S.container}>
        <div style={S.header}>
          <div style={S.badge}>BUY-TO-LET</div>
          <h1 style={S.title}>Rental Yield Calculator</h1>
          <p style={S.sub}>Calculate gross yield, net yield, and monthly cashflow for any UK rental property investment.</p>
        </div>

        <div style={S.card}>
          <label style={S.label}>Property Purchase Price</label>
          <div style={S.inputWrap}>
            <span style={S.pfx}>£</span>
            <input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))} style={S.input} placeholder="250,000" />
          </div>

          <div style={S.row}>
            <div style={S.field}>
              <label style={S.label}>Monthly Rent</label>
              <div style={S.inputWrap}>
                <span style={S.pfx}>£</span>
                <input type="text" inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value.replace(/[^0-9]/g, ""))} style={S.input} />
              </div>
            </div>
            <div style={S.field}>
              <label style={S.label}>Monthly Mortgage</label>
              <div style={S.inputWrap}>
                <span style={S.pfx}>£</span>
                <input type="text" inputMode="numeric" value={mortgage} onChange={(e) => setMortgage(e.target.value.replace(/[^0-9]/g, ""))} style={S.input} />
              </div>
            </div>
          </div>

          <div style={S.row}>
            <div style={S.field}>
              <label style={S.label}>Management Fee %</label>
              <div style={S.inputWrap}>
                <input type="text" inputMode="decimal" value={mgmt} onChange={(e) => setMgmt(e.target.value)} style={S.input} />
                <span style={S.sfx}>%</span>
              </div>
            </div>
            <div style={S.field}>
              <label style={S.label}>Monthly Maintenance</label>
              <div style={S.inputWrap}>
                <span style={S.pfx}>£</span>
                <input type="text" inputMode="numeric" value={maintenance} onChange={(e) => setMaintenance(e.target.value)} style={S.input} />
              </div>
            </div>
            <div style={S.field}>
              <label style={S.label}>Void Rate %</label>
              <div style={S.inputWrap}>
                <input type="text" inputMode="decimal" value={void_} onChange={(e) => setVoid(e.target.value)} style={S.input} />
                <span style={S.sfx}>%</span>
              </div>
            </div>
          </div>

          <div style={S.results}>
            <div style={{ ...S.rCard, background: "#1a1a1a" }}>
              <div style={S.rLabel}>Gross Yield</div>
              <div style={{ ...S.rVal, color: "#fff" }}>{pct(grossYield)}</div>
            </div>
            <div style={{ ...S.rCard, background: netYield >= 5 ? "#065f46" : netYield >= 3 ? "#92400e" : "#991b1b" }}>
              <div style={S.rLabel}>Net Yield</div>
              <div style={{ ...S.rVal, color: "#fff" }}>{pct(netYield)}</div>
            </div>
            <div style={{ ...S.rCard, background: monthlyCashflow >= 0 ? "#065f46" : "#991b1b" }}>
              <div style={S.rLabel}>Monthly Cashflow</div>
              <div style={{ ...S.rVal, color: "#fff" }}>{fmt(monthlyCashflow)}</div>
            </div>
            <div style={{ ...S.rCard, background: "#1e40af" }}>
              <div style={S.rLabel}>ROI (on 25% deposit)</div>
              <div style={{ ...S.rVal, color: "#fff" }}>{pct(roi)}</div>
            </div>
          </div>

          <div style={S.breakdown}>
            <div style={S.bTitle}>Annual Breakdown</div>
            <div style={S.bRow}><span>Gross Rent</span><span style={{ fontWeight: 700 }}>{fmt(annualRent)}</span></div>
            <div style={S.bRow}><span>Void Adjustment ({vd}%)</span><span style={{ color: "#dc2626" }}>-{fmt(annualRent - effectiveRent)}</span></div>
            <div style={S.bRow}><span>Management ({mg}%)</span><span style={{ color: "#dc2626" }}>-{fmt(mgmtCost)}</span></div>
            <div style={S.bRow}><span>Maintenance</span><span style={{ color: "#dc2626" }}>-{fmt(annualMaintenance)}</span></div>
            <div style={S.bRow}><span>Insurance</span><span style={{ color: "#dc2626" }}>-{fmt(annualInsurance)}</span></div>
            <div style={S.bRow}><span>Mortgage Payments</span><span style={{ color: "#dc2626" }}>-{fmt(annualMortgage)}</span></div>
            <div style={{ ...S.bRow, borderTop: "2px solid #1a1a1a", fontWeight: 700, paddingTop: 10 }}>
              <span>Annual Cashflow</span>
              <span style={{ color: annualCashflow >= 0 ? "#16a34a" : "#dc2626" }}>{fmt(annualCashflow)}</span>
            </div>
          </div>

          {netYield >= 5 && <div style={S.good}>Strong yield — this property looks like a solid investment on paper.</div>}
          {netYield >= 3 && netYield < 5 && <div style={S.ok}>Moderate yield — typical for many UK cities. Cashflow may be tight.</div>}
          {netYield < 3 && netYield > 0 && <div style={S.warn}>Low yield — consider whether capital appreciation makes up for weak cashflow.</div>}
        </div>

        <div style={S.info}>
          <h2 style={S.infoTitle}>Understanding Rental Yields</h2>
          <p style={S.infoText}>Gross yield is the simplest measure — annual rent divided by property price. Net yield deducts running costs (management, maintenance, insurance, voids) but not mortgage payments. Cashflow is what actually hits your bank account each month after all expenses including the mortgage.</p>
          <p style={S.infoText}>Most experienced BTL investors target a minimum 6% gross yield or 4% net yield. Properties below these thresholds can still be profitable if capital growth is strong, but cashflow-negative properties require you to subsidise the investment each month.</p>
        </div>

        <div style={S.footer}>For illustrative purposes only. Does not include stamp duty surcharge, legal fees, or tax on rental income.</div>
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
  container: { maxWidth: 600, margin: "0 auto" },
  header: { textAlign: "center", marginBottom: 28 },
  badge: { display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#065f46", background: "rgba(6,95,70,0.08)", padding: "4px 12px", borderRadius: 100, marginBottom: 14 },
  title: { fontFamily: "'Instrument Serif', serif", fontSize: "clamp(26px, 5vw, 38px)", fontWeight: 400, lineHeight: 1.15, marginBottom: 8 },
  sub: { fontSize: 14, color: "#6b6b6b", lineHeight: 1.6, maxWidth: 480, margin: "0 auto" },
  card: { background: "#fff", borderRadius: 16, padding: "24px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" },
  label: { display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: "#999", textTransform: "uppercase", marginBottom: 6, marginTop: 16 },
  inputWrap: { display: "flex", alignItems: "center", background: "#f9f7f4", borderRadius: 10, border: "2px solid #e8e4de" },
  pfx: { padding: "0 0 0 12px", fontSize: 18, fontWeight: 700, color: "#065f46" },
  sfx: { padding: "0 12px 0 0", fontSize: 14, fontWeight: 600, color: "#999" },
  input: { flex: 1, padding: "12px", fontSize: 18, fontWeight: 700, border: "none", background: "transparent", outline: "none", fontFamily: "'Karla', sans-serif" },
  row: { display: "flex", gap: 10 },
  field: { flex: 1 },
  results: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 24 },
  rCard: { borderRadius: 12, padding: "14px", textAlign: "center" },
  rLabel: { fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 },
  rVal: { fontFamily: "'Instrument Serif', serif", fontSize: 26 },
  breakdown: { marginTop: 20 },
  bTitle: { fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: "#999", textTransform: "uppercase", marginBottom: 8 },
  bRow: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0ede8", fontSize: 14, color: "#555" },
  good: { marginTop: 14, padding: "10px 14px", background: "#ecfdf5", borderRadius: 8, fontSize: 13, color: "#065f46", lineHeight: 1.5 },
  ok: { marginTop: 14, padding: "10px 14px", background: "#fef3c7", borderRadius: 8, fontSize: 13, color: "#92400e", lineHeight: 1.5 },
  warn: { marginTop: 14, padding: "10px 14px", background: "#fef2f2", borderRadius: 8, fontSize: 13, color: "#991b1b", lineHeight: 1.5 },
  info: { marginTop: 28, padding: "20px 0" },
  infoTitle: { fontFamily: "'Instrument Serif', serif", fontSize: 22, marginBottom: 12 },
  infoText: { fontSize: 14, color: "#555", lineHeight: 1.75, marginBottom: 10 },
  footer: { marginTop: 20, padding: "14px 0", borderTop: "1px solid #e0dbd4", fontSize: 12, color: "#999", textAlign: "center", lineHeight: 1.6 },
};
