import { useState } from "react";

const TAX_CONFIG = {
  personalAllowance: 12570,
  basicRate: 0.20,
  basicThreshold: 50270,
  higherRate: 0.40,
  higherThreshold: 125140,
  additionalRate: 0.45,
  niRate: 0.08,
  niThreshold: 12570,
  niUpperLimit: 50270,
  niUpperRate: 0.02,
  corpTax: 0.25,
  corpTaxSmall: 0.19,
  corpTaxSmallLimit: 50000,
  divAllowance: 500,
  divBasicRate: 0.0875,
  divHigherRate: 0.3375,
  divAdditionalRate: 0.3938,
  studentLoanPlan1: { threshold: 22015, rate: 0.09 },
  studentLoanPlan2: { threshold: 27295, rate: 0.09 },
};

function calcTakeHome(dayRate, daysPerWeek, weeksWorked, ir35, studentLoan, expenses) {
  const grossAnnual = dayRate * daysPerWeek * weeksWorked;
  const annualExpenses = expenses * 12;

  if (ir35 === "inside") {
    const taxableIncome = grossAnnual;
    const tax = calcIncomeTax(taxableIncome);
    const ni = calcNI(taxableIncome);
    const sl = calcStudentLoan(taxableIncome, studentLoan);
    const net = taxableIncome - tax - ni - sl;
    return { grossAnnual, taxableIncome, tax, ni, corpTax: 0, divTax: 0, studentLoan: sl, totalDeductions: tax + ni + sl, netAnnual: net, netMonthly: net / 12 };
  }

  // Outside IR35: Ltd company route
  const salary = TAX_CONFIG.personalAllowance; // Optimal: pay yourself £12,570 salary
  const profitBeforeTax = grossAnnual - salary - annualExpenses;
  const corpTax = profitBeforeTax > 0 ? (profitBeforeTax <= TAX_CONFIG.corpTaxSmallLimit ? profitBeforeTax * TAX_CONFIG.corpTaxSmall : profitBeforeTax * TAX_CONFIG.corpTax) : 0;
  const profitAfterTax = profitBeforeTax - corpTax;
  const dividends = Math.max(profitAfterTax, 0);

  const salaryTax = 0; // Below personal allowance
  const salaryNI = 0;

  
  // Dividend tax
  const taxableDividends = Math.max(dividends - TAX_CONFIG.divAllowance, 0);
  const totalIncome = salary + dividends;
  let divTax = 0;

  if (totalIncome <= TAX_CONFIG.basicThreshold) {
    divTax = taxableDividends * TAX_CONFIG.divBasicRate;
  } else if (totalIncome <= TAX_CONFIG.higherThreshold) {
    const basicPortion = Math.max(TAX_CONFIG.basicThreshold - salary, 0);
    const higherPortion = taxableDividends - basicPortion;
    divTax = Math.min(taxableDividends, basicPortion) * TAX_CONFIG.divBasicRate;
    if (higherPortion > 0) divTax += higherPortion * TAX_CONFIG.divHigherRate;
  } else {
    divTax = taxableDividends * TAX_CONFIG.divAdditionalRate;
  }

  const sl = calcStudentLoan(salary + dividends, studentLoan);
  const totalDeductions = salaryTax + salaryNI + corpTax + divTax + sl;
  const netAnnual = grossAnnual - annualExpenses - totalDeductions;

  return {
    grossAnnual, taxableIncome: totalIncome, tax: salaryTax, ni: salaryNI,
    corpTax, divTax, studentLoan: sl, totalDeductions,
    netAnnual, netMonthly: netAnnual / 12, salary, dividends, profitBeforeTax, expenses: annualExpenses,
  };
}

function calcIncomeTax(income) {
  let tax = 0;
  const pa = income > 100000 ? Math.max(TAX_CONFIG.personalAllowance - (income - 100000) / 2, 0) : TAX_CONFIG.personalAllowance;
  const taxable = Math.max(income - pa, 0);

  if (taxable <= TAX_CONFIG.basicThreshold - TAX_CONFIG.personalAllowance) {
    tax = taxable * TAX_CONFIG.basicRate;
  } else if (taxable <= TAX_CONFIG.higherThreshold - TAX_CONFIG.personalAllowance) {
    tax = (TAX_CONFIG.basicThreshold - TAX_CONFIG.personalAllowance) * TAX_CONFIG.basicRate;
    tax += (taxable - (TAX_CONFIG.basicThreshold - TAX_CONFIG.personalAllowance)) * TAX_CONFIG.higherRate;
  } else {
    tax = (TAX_CONFIG.basicThreshold - TAX_CONFIG.personalAllowance) * TAX_CONFIG.basicRate;
    tax += (TAX_CONFIG.higherThreshold - TAX_CONFIG.basicThreshold) * TAX_CONFIG.higherRate;
    tax += (taxable - (TAX_CONFIG.higherThreshold - TAX_CONFIG.personalAllowance)) * TAX_CONFIG.additionalRate;
  }
  return tax;
}

function calcNI(income) {
  let ni = 0;
  if (income > TAX_CONFIG.niThreshold) {
    const basicNI = Math.min(income, TAX_CONFIG.niUpperLimit) - TAX_CONFIG.niThreshold;
    ni = basicNI * TAX_CONFIG.niRate;
    if (income > TAX_CONFIG.niUpperLimit) {
      ni += (income - TAX_CONFIG.niUpperLimit) * TAX_CONFIG.niUpperRate;
    }
  }
  return ni;
}

function calcStudentLoan(income, plan) {
  if (plan === "none") return 0;
  const config = plan === "plan1" ? TAX_CONFIG.studentLoanPlan1 : TAX_CONFIG.studentLoanPlan2;
  return Math.max((income - config.threshold) * config.rate, 0);
}

const fmt = (n) => "£" + Math.round(n).toLocaleString("en-GB");

export default function ContractorCalc() {
  const [dayRate, setDayRate] = useState("500");
  const [daysPerWeek, setDaysPerWeek] = useState("5");
  const [weeksWorked, setWeeksWorked] = useState("46");
  const [ir35, setIr35] = useState("outside");
  const [studentLoan, setStudentLoan] = useState("none");
  const [expenses, setExpenses] = useState("200");

  const dr = parseFloat(dayRate) || 0;
  const dpw = parseFloat(daysPerWeek) || 5;
  const ww = parseFloat(weeksWorked) || 46;
  const exp = parseFloat(expenses) || 0;

  const result = calcTakeHome(dr, dpw, ww, ir35, studentLoan, exp);

  return (
    <div style={S.page}>
      <style>{css}</style>
      <div style={S.container}>
        <div style={S.header}>
          <div style={S.badge}>2025/26 TAX YEAR</div>
          <h1 style={S.title}>Contractor Take-Home Pay Calculator</h1>
          <p style={S.sub}>See your real take-home pay as a UK contractor — inside or outside IR35, with Ltd company optimisation.</p>
        </div>

        <div style={S.card}>
          <label style={S.label}>Day Rate</label>
          <div style={S.inputWrap}>
            <span style={S.pfx}>£</span>
            <input type="text" inputMode="numeric" value={dayRate} onChange={(e) => setDayRate(e.target.value.replace(/[^0-9]/g, ""))} style={S.input} placeholder="500" />
            <span style={S.sfx}>/day</span>
          </div>

          <div style={S.row}>
            <div style={S.field}>
              <label style={S.label}>Days/Week</label>
              <div style={S.inputWrap}>
                <input type="text" inputMode="numeric" value={daysPerWeek} onChange={(e) => setDaysPerWeek(e.target.value)} style={S.input} />
              </div>
            </div>
            <div style={S.field}>
              <label style={S.label}>Weeks/Year</label>
              <div style={S.inputWrap}>
                <input type="text" inputMode="numeric" value={weeksWorked} onChange={(e) => setWeeksWorked(e.target.value)} style={S.input} />
              </div>
            </div>
            <div style={S.field}>
              <label style={S.label}>Monthly Expenses</label>
              <div style={S.inputWrap}>
                <span style={S.pfx}>£</span>
                <input type="text" inputMode="numeric" value={expenses} onChange={(e) => setExpenses(e.target.value.replace(/[^0-9]/g, ""))} style={S.input} />
              </div>
            </div>
          </div>

          <label style={S.label}>IR35 Status</label>
          <div style={S.toggleRow}>
            {[["outside", "Outside IR35 (Ltd)"], ["inside", "Inside IR35 (PAYE)"]].map(([id, lbl]) => (
              <button key={id} onClick={() => setIr35(id)} style={{ ...S.toggle, ...(ir35 === id ? S.toggleActive : {}) }}>{lbl}</button>
            ))}
          </div>

          <label style={S.label}>Student Loan</label>
          <div style={S.toggleRow}>
            {[["none", "None"], ["plan1", "Plan 1"], ["plan2", "Plan 2"]].map(([id, lbl]) => (
              <button key={id} onClick={() => setStudentLoan(id)} style={{ ...S.toggle, ...(studentLoan === id ? S.toggleActive : {}) }}>{lbl}</button>
            ))}
          </div>

          <div style={S.bigResult}>
            <div style={S.bigLabel}>Your Take-Home Pay</div>
            <div style={S.bigRow}>
              <div>
                <div style={S.bigVal}>{fmt(result.netMonthly)}</div>
                <div style={S.bigSub}>per month</div>
              </div>
              <div style={S.bigDivider} />
              <div>
                <div style={S.bigVal}>{fmt(result.netAnnual)}</div>
                <div style={S.bigSub}>per year</div>
              </div>
            </div>
          </div>

          <div style={S.breakdown}>
            <div style={S.bRow}><span>Gross Annual</span><span style={{ fontWeight: 700 }}>{fmt(result.grossAnnual)}</span></div>
            {ir35 === "outside" && <div style={S.bRow}><span>Optimal Salary</span><span>{fmt(result.salary || 0)}</span></div>}
            {ir35 === "outside" && <div style={S.bRow}><span>Business Expenses</span><span>-{fmt(result.expenses || 0)}</span></div>}
            <div style={S.bRow}><span>Income Tax</span><span style={{ color: "#dc2626" }}>-{fmt(result.tax)}</span></div>
            <div style={S.bRow}><span>National Insurance</span><span style={{ color: "#dc2626" }}>-{fmt(result.ni)}</span></div>
            {result.corpTax > 0 && <div style={S.bRow}><span>Corporation Tax</span><span style={{ color: "#dc2626" }}>-{fmt(result.corpTax)}</span></div>}
            {result.divTax > 0 && <div style={S.bRow}><span>Dividend Tax</span><span style={{ color: "#dc2626" }}>-{fmt(result.divTax)}</span></div>}
            {result.studentLoan > 0 && <div style={S.bRow}><span>Student Loan</span><span style={{ color: "#dc2626" }}>-{fmt(result.studentLoan)}</span></div>}
            <div style={{ ...S.bRow, borderTop: "2px solid #1a1a1a", fontWeight: 700, paddingTop: 10 }}>
              <span>Net Take-Home</span><span style={{ color: "#16a34a" }}>{fmt(result.netAnnual)}</span>
            </div>
          </div>

          <div style={S.effRate}>
            Effective tax rate: {result.grossAnnual > 0 ? ((result.totalDeductions / result.grossAnnual) * 100).toFixed(1) : "0"}%
          </div>
        </div>

        <div style={S.info}>
          <h2 style={S.infoTitle}>Understanding IR35 and Contractor Tax</h2>
          <p style={S.infoText}>IR35 is tax legislation that determines whether a contractor is genuinely self-employed or should be taxed as an employee. If your contract is "inside IR35," you pay tax and NI as if you were employed. "Outside IR35" means you can operate through a limited company, paying yourself a small salary and taking the rest as dividends — which is significantly more tax-efficient.</p>
          <p style={S.infoText}>The optimal strategy for outside-IR35 contractors is typically to pay a salary at the personal allowance threshold (£12,570) and take the remainder as dividends. This minimises NI contributions and takes advantage of lower dividend tax rates.</p>
        </div>

        <div style={S.footer}>For illustrative purposes only. Consult an accountant for personalised tax advice. Rates for 2025/26 tax year.</div>
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
  badge: { display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#1e40af", background: "rgba(30,64,175,0.08)", padding: "4px 12px", borderRadius: 100, marginBottom: 14 },
  title: { fontFamily: "'Instrument Serif', serif", fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 400, lineHeight: 1.15, marginBottom: 8 },
  sub: { fontSize: 14, color: "#6b6b6b", lineHeight: 1.6, maxWidth: 500, margin: "0 auto" },
  card: { background: "#fff", borderRadius: 16, padding: "24px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" },
  label: { display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: "#999", textTransform: "uppercase", marginBottom: 6, marginTop: 16 },
  inputWrap: { display: "flex", alignItems: "center", background: "#f9f7f4", borderRadius: 10, border: "2px solid #e8e4de" },
  pfx: { padding: "0 0 0 12px", fontSize: 18, fontWeight: 700, color: "#1e40af" },
  sfx: { padding: "0 12px 0 0", fontSize: 14, fontWeight: 600, color: "#999" },
  input: { flex: 1, padding: "12px", fontSize: 18, fontWeight: 700, border: "none", background: "transparent", outline: "none", fontFamily: "'Karla', sans-serif" },
  row: { display: "flex", gap: 10 },
  field: { flex: 1 },
  toggleRow: { display: "flex", gap: 8 },
  toggle: { flex: 1, padding: "10px 6px", fontSize: 12, fontWeight: 600, border: "2px solid #e8e4de", borderRadius: 10, background: "#f9f7f4", color: "#6b6b6b", cursor: "pointer", fontFamily: "'Karla', sans-serif" },
  toggleActive: { background: "#1a1a1a", color: "#fff", borderColor: "#1a1a1a" },
  bigResult: { marginTop: 24, padding: 20, background: "#1a1a1a", borderRadius: 14, textAlign: "center" },
  bigLabel: { fontSize: 12, color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 },
  bigRow: { display: "flex", justifyContent: "center", alignItems: "center", gap: 24 },
  bigVal: { fontFamily: "'Instrument Serif', serif", fontSize: 32, color: "#fff" },
  bigSub: { fontSize: 12, color: "#777", marginTop: 2 },
  bigDivider: { width: 1, height: 40, background: "#333" },
  breakdown: { marginTop: 18 },
  bRow: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0ede8", fontSize: 14, color: "#555" },
  effRate: { textAlign: "center", marginTop: 14, fontSize: 13, color: "#1e40af", fontWeight: 600 },
  info: { marginTop: 28, padding: "20px 0" },
  infoTitle: { fontFamily: "'Instrument Serif', serif", fontSize: 22, marginBottom: 12 },
  infoText: { fontSize: 14, color: "#555", lineHeight: 1.75, marginBottom: 10 },
  footer: { marginTop: 20, padding: "14px 0", borderTop: "1px solid #e0dbd4", fontSize: 12, color: "#999", textAlign: "center", lineHeight: 1.6 },
};
