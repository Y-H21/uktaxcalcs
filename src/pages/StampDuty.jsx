import { useState } from "react";

const RATES_RESIDENTIAL = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 925000, rate: 0.05 },
  { min: 925000, max: 1500000, rate: 0.10 },
  { min: 1500000, max: Infinity, rate: 0.12 },
];

const RATES_ADDITIONAL = [
  { min: 0, max: 250000, rate: 0.05 },
  { min: 250000, max: 925000, rate: 0.10 },
  { min: 925000, max: 1500000, rate: 0.15 },
  { min: 1500000, max: Infinity, rate: 0.17 },
];


const RATES_FTB = [
  { min: 0, max: 425000, rate: 0 },
  { min: 425000, max: 625000, rate: 0.05 },
];

function calcSDLT(price, rates) {
  let tax = 0;
  for (const band of rates) {
    if (price <= band.min) break;
    const taxable = Math.min(price, band.max) - band.min;
    tax += taxable * band.rate;
  }
  return tax;
}

export default function StampDutyCalc() {
  const [price, setPrice] = useState("");
  const [type, setType] = useState("residential");
  const parsed = parseFloat(price.replace(/,/g, "")) || 0;

  const isFTBEligible = parsed <= 625000;
  const rates =
    type === "additional" ? RATES_ADDITIONAL :
    type === "ftb" && isFTBEligible ? RATES_FTB :
    RATES_RESIDENTIAL;

  const tax = calcSDLT(parsed, rates);
  const effective = parsed > 0 ? ((tax / parsed) * 100).toFixed(2) : "0.00";

  const breakdown = rates.map((band) => {
    if (parsed <= band.min) return null;
    const taxable = Math.min(parsed, band.max === Infinity ? parsed : band.max) - band.min;
    const bandTax = taxable * band.rate;
    if (taxable <= 0) return null;
    return {
      range: `£${band.min.toLocaleString()} – £${band.max === Infinity ? parsed.toLocaleString() : band.max.toLocaleString()}`,
      rate: `${(band.rate * 100).toFixed(0)}%`,
      taxable: `£${taxable.toLocaleString()}`,
      tax: `£${bandTax.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
    };
  }).filter(Boolean);

  return (
    <div style={S.page}>
      <style>{css}</style>
      <div style={S.container}>
        <div style={S.header}>
          <div style={S.badge}>UPDATED APRIL 2026</div>
          <h1 style={S.title}>UK Stamp Duty Calculator</h1>
          <p style={S.sub}>Calculate your Stamp Duty Land Tax (SDLT) instantly for England & Northern Ireland.</p>
        </div>

        <div style={S.card}>
          <label style={S.label}>Property Price</label>
          <div style={S.inputWrap}>
            <span style={S.pound}>£</span>
            <input
              type="text"
              inputMode="numeric"
              value={price}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, "");
                setPrice(v ? parseInt(v).toLocaleString() : "");
              }}
              placeholder="e.g. 350,000"
              style={S.input}
            />
          </div>

          <label style={S.label}>Buyer Type</label>
          <div style={S.toggleRow}>
            {[
              { id: "residential", label: "Standard" },
              { id: "ftb", label: "First-Time Buyer" },
              { id: "additional", label: "Additional Property" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                style={{
                  ...S.toggle,
                  ...(type === t.id ? S.toggleActive : {}),
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {type === "ftb" && parsed > 625000 && (
            <div style={S.warning}>
              First-time buyer relief only applies to properties up to £625,000. Standard rates shown instead.
            </div>
          )}

          <div style={S.resultBox}>
            <div style={S.resultMain}>
              <div style={S.resultLabel}>Stamp Duty to Pay</div>
              <div style={S.resultValue}>
                £{tax.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div style={S.resultEffective}>Effective rate: {effective}%</div>
            </div>
          </div>

          {breakdown.length > 0 && (
            <div style={S.breakdownSection}>
              <div style={S.breakdownTitle}>Tax Breakdown</div>
              <div style={S.breakdownHeader}>
                <span>Band</span><span>Rate</span><span>Taxable</span><span>Tax</span>
              </div>
              {breakdown.map((b, i) => (
                <div key={i} style={S.breakdownRow}>
                  <span style={S.breakdownCell}>{b.range}</span>
                  <span style={S.breakdownCell}>{b.rate}</span>
                  <span style={S.breakdownCell}>{b.taxable}</span>
                  <span style={{ ...S.breakdownCell, fontWeight: 700 }}>{b.tax}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={S.infoSection}>
          <h2 style={S.infoTitle}>How Stamp Duty Works in 2025/26</h2>
          <p style={S.infoText}>
            Stamp Duty Land Tax (SDLT) is a tax paid when you buy property or land over a certain price in England and Northern Ireland. The tax is calculated on a tiered basis — you only pay each rate on the portion of the price within that band, similar to income tax brackets.
          </p>
          <p style={S.infoText}>
            First-time buyers benefit from relief on properties up to £625,000, paying nothing on the first £425,000. Additional properties such as buy-to-let and second homes attract a 5% surcharge across all bands.
          </p>
          <h3 style={S.infoSubtitle}>Current SDLT Rates (2025/26)</h3>
          <p style={S.infoText}>
            Standard residential: 0% up to £250,000, 5% on £250,001–£925,000, 10% on £925,001–£1,500,000, and 12% above £1,500,000. Scotland and Wales have their own equivalents (LBTT and LTT respectively).
          </p>
        </div>

        <div style={S.footer}>
          <p>This calculator provides estimates only and should not be treated as financial advice. Rates effective from April 2025. Scotland (LBTT) and Wales (LTT) have different rates.</p>
        </div>
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
  page: {
    fontFamily: "'Karla', sans-serif",
    background: "#f5f0eb",
    minHeight: "100vh",
    color: "#1a1a1a",
    padding: "24px 16px",
  },
  container: { maxWidth: 560, margin: "0 auto" },
  header: { textAlign: "center", marginBottom: 32 },
  badge: {
    display: "inline-block",
    fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
    color: "#7c6a4f", background: "rgba(124,106,79,0.1)",
    padding: "4px 12px", borderRadius: 100, marginBottom: 16,
  },
  title: {
    fontFamily: "'Instrument Serif', serif",
    fontSize: "clamp(28px, 5vw, 40px)",
    fontWeight: 400, lineHeight: 1.15, marginBottom: 10, color: "#1a1a1a",
  },
  sub: { fontSize: 15, color: "#6b6b6b", lineHeight: 1.5 },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "28px 24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
  },
  label: {
    display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
    color: "#999", textTransform: "uppercase", marginBottom: 8, marginTop: 20,
  },
  inputWrap: {
    display: "flex", alignItems: "center", background: "#f9f7f4",
    borderRadius: 10, border: "2px solid #e8e4de", overflow: "hidden",
  },
  pound: {
    padding: "0 0 0 16px", fontSize: 22, fontWeight: 700, color: "#7c6a4f",
  },
  input: {
    flex: 1, padding: "14px 16px", fontSize: 22, fontWeight: 700,
    border: "none", background: "transparent", outline: "none",
    fontFamily: "'Karla', sans-serif", color: "#1a1a1a",
  },
  toggleRow: { display: "flex", gap: 8 },
  toggle: {
    flex: 1, padding: "10px 8px", fontSize: 13, fontWeight: 600,
    border: "2px solid #e8e4de", borderRadius: 10, background: "#f9f7f4",
    color: "#6b6b6b", cursor: "pointer", transition: "all 0.2s",
    fontFamily: "'Karla', sans-serif",
  },
  toggleActive: {
    background: "#1a1a1a", color: "#fff", borderColor: "#1a1a1a",
  },
  warning: {
    marginTop: 12, padding: "10px 14px", background: "#fef3c7",
    borderRadius: 8, fontSize: 13, color: "#92400e", lineHeight: 1.5,
  },
  resultBox: {
    marginTop: 24, padding: 24, background: "#1a1a1a", borderRadius: 14,
    textAlign: "center",
  },
  resultLabel: { fontSize: 13, color: "#999", marginBottom: 4, fontWeight: 600 },
  resultValue: {
    fontFamily: "'Instrument Serif', serif",
    fontSize: 44, color: "#fff", lineHeight: 1.1,
  },
  resultEffective: { fontSize: 14, color: "#7c6a4f", marginTop: 6, fontWeight: 600 },
  breakdownSection: { marginTop: 20 },
  breakdownTitle: {
    fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
    color: "#999", textTransform: "uppercase", marginBottom: 10,
  },
  breakdownHeader: {
    display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1fr",
    fontSize: 11, fontWeight: 700, color: "#bbb", textTransform: "uppercase",
    letterSpacing: "0.05em", padding: "0 0 8px", borderBottom: "1px solid #eee",
  },
  breakdownRow: {
    display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1fr",
    padding: "10px 0", borderBottom: "1px solid #f5f5f5", fontSize: 13,
  },
  breakdownCell: { color: "#444" },
  infoSection: {
    marginTop: 32, padding: "24px 0",
  },
  infoTitle: {
    fontFamily: "'Instrument Serif', serif",
    fontSize: 24, marginBottom: 14, color: "#1a1a1a",
  },
  infoSubtitle: {
    fontSize: 16, fontWeight: 700, marginTop: 16, marginBottom: 8, color: "#1a1a1a",
  },
  infoText: {
    fontSize: 14, color: "#555", lineHeight: 1.75, marginBottom: 12,
  },
  footer: {
    marginTop: 24, padding: "16px 0", borderTop: "1px solid #e0dbd4",
    fontSize: 12, color: "#999", textAlign: "center", lineHeight: 1.6,
  },
};
