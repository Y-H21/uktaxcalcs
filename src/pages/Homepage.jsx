import { useState, useEffect, useRef } from "react";

const TOOLS = [
  {
    slug: "/stamp-duty",
    title: "Stamp Duty Calculator",
    desc: "Calculate SDLT for England & Northern Ireland. Covers standard, first-time buyer, and additional property rates.",
    icon: "🏠",
    tag: "110K monthly searches",
    color: "#7c6a4f",
  },
  {
    slug: "/mortgage",
    title: "Mortgage Affordability Calculator",
    desc: "See how much you can borrow based on your salary. Uses the standard 4.5x lender multiplier with monthly payment breakdown.",
    icon: "🏦",
    tag: "90K monthly searches",
    color: "#2d6a4f",
  },
  {
    slug: "/contractor",
    title: "Contractor Take-Home Pay",
    desc: "Inside or outside IR35? See your real take-home pay as a UK contractor with Ltd company optimisation.",
    icon: "💼",
    tag: "12K monthly searches",
    color: "#1e40af",
  },
  {
    slug: "/rental-yield",
    title: "Rental Yield Calculator",
    desc: "Calculate gross yield, net yield, and monthly cashflow for any UK buy-to-let property investment.",
    icon: "📊",
    tag: "8K monthly searches",
    color: "#065f46",
  },
  {
    slug: "/side-hustle-tax",
    title: "Side Hustle Tax Calculator",
    desc: "Earning extra alongside your job? See exactly how much tax you owe HMRC on your side hustle profits.",
    icon: "⚡",
    tag: "6K monthly searches",
    color: "#9333ea",
  },
];

const UPCOMING = [
  "Dividend Tax Calculator",
  "Capital Gains Tax Calculator",
  "Student Loan Repayment Calculator",
  "Pension Calculator (SIPP vs Workplace)",
  "Self Assessment Tax Estimator",
  "VAT Threshold Calculator",
];


function useInView() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Fade({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      ...style,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

export default function Homepage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div style={S.page}>
      <style>{css}</style>

      {/* NAV */}
      <nav style={S.nav}>
        <div style={S.navInner}>
          <div style={S.logo}>
            <span style={S.logoMark}>⬡</span>
            <span style={S.logoName}>UKTaxCalcs</span>
            <span style={S.logoDot}>.co.uk</span>
          </div>
          <div style={S.navRight}>
            <a href="#tools" style={S.navLink}>Tools</a>
            <a href="#about" style={S.navLink}>About</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={S.hero}>
        <Fade>
          <p style={S.heroEyebrow}>Free UK tax & property calculators</p>
        </Fade>
        <Fade delay={0.08}>
          <h1 style={S.heroTitle}>
            Know your numbers<br />
            <span style={S.heroAccent}>before you commit.</span>
          </h1>
        </Fade>
        <Fade delay={0.16}>
          <p style={S.heroSub}>
            Stamp duty, mortgage affordability, contractor pay, rental yields, and side hustle tax — calculated in seconds. No sign-up. No nonsense.
          </p>
        </Fade>
        <Fade delay={0.24}>
          <a href="#tools" style={S.heroCta}>Explore calculators ↓</a>
        </Fade>
      </section>

      {/* AD SLOT 1 */}
      <div style={S.adSlot}>
        <div style={S.adPlaceholder}>— Ad —</div>
      </div>

      {/* TOOLS GRID */}
      <section id="tools" style={S.section}>
        <Fade>
          <p style={S.sectionEyebrow}>CALCULATORS</p>
          <h2 style={S.sectionTitle}>Pick your calculator.</h2>
        </Fade>

        <div style={S.grid}>
          {TOOLS.map((tool, i) => (
            <Fade key={i} delay={i * 0.06} style={{ display: "flex" }}>
              <a href={tool.slug} style={S.card}>
                <div style={S.cardTop}>
                  <span style={S.cardIcon}>{tool.icon}</span>
                  <span style={{ ...S.cardTag, background: `${tool.color}14`, color: tool.color }}>{tool.tag}</span>
                </div>
                <h3 style={S.cardTitle}>{tool.title}</h3>
                <p style={S.cardDesc}>{tool.desc}</p>
                <span style={{ ...S.cardLink, color: tool.color }}>
                  Calculate now →
                </span>
              </a>
            </Fade>
          ))}
        </div>
      </section>

      {/* AD SLOT 2 */}
      <div style={S.adSlot}>
        <div style={S.adPlaceholder}>— Ad —</div>
      </div>

      {/* COMING SOON */}
      <section style={{ ...S.section, background: "#f9f7f4", maxWidth: "100%", padding: "64px 24px" }}>
        <Fade>
          <p style={S.sectionEyebrow}>COMING SOON</p>
          <h2 style={S.sectionTitle}>More calculators on the way.</h2>
        </Fade>
        <div style={S.upcoming}>
          {UPCOMING.map((item, i) => (
            <Fade key={i} delay={i * 0.04}>
              <div style={S.upcomingItem}>
                <span style={S.upcomingDot} />
                {item}
              </div>
            </Fade>
          ))}
        </div>

        <Fade delay={0.3}>
          <div style={S.newsletter}>
            <p style={S.nlText}>Get notified when new calculators launch.</p>
            {!subscribed ? (
              <div style={S.nlForm}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={S.nlInput}
                />
                <button style={S.nlBtn} onClick={() => { if (email.includes("@")) setSubscribed(true); }}>
                  Notify me
                </button>
              </div>
            ) : (
              <p style={S.nlSuccess}>✓ You're on the list.</p>
            )}
          </div>
        </Fade>
      </section>

      {/* SEO CONTENT */}
      <section id="about" style={S.section}>
        <Fade>
          <h2 style={S.sectionTitle}>About UKTaxCalcs</h2>
        </Fade>
        <div style={S.seoContent}>
          <Fade>
            <p>
              UKTaxCalcs.co.uk provides free, accurate financial calculators for anyone navigating the UK tax system. Whether you're buying your first home, working as a contractor, investing in buy-to-let property, or earning extra income from a side hustle — our tools help you understand exactly what you'll pay and what you'll keep.
            </p>
          </Fade>
          <Fade delay={0.05}>
            <p>
              All calculators are updated for the 2025/26 tax year and reflect the latest HMRC rates and thresholds. We cover Stamp Duty Land Tax (SDLT) for England and Northern Ireland, mortgage affordability based on standard lender criteria, contractor take-home pay for both inside and outside IR35 arrangements, rental yield analysis for buy-to-let investors, and self-employment tax for side hustles and freelance work.
            </p>
          </Fade>
          <Fade delay={0.1}>
            <p>
              Our tools are designed to be simple, fast, and mobile-friendly. No sign-up required, no personal data collected. Just enter your numbers and get instant results with full breakdowns. While our calculators provide helpful estimates, they should not be treated as financial advice — always consult a qualified professional for decisions involving significant sums.
            </p>
          </Fade>
          <Fade delay={0.15}>
            <h3 style={S.seoSubtitle}>Frequently Asked Questions</h3>
            <p><strong>Are these calculators free?</strong> Yes, completely free with no sign-up required.</p>
            <p><strong>How accurate are the results?</strong> Our calculators use current 2025/26 HMRC rates and standard lender criteria. Results are estimates — for exact figures, consult a tax professional or mortgage adviser.</p>
            <p><strong>Do you cover Scotland and Wales?</strong> Currently our stamp duty calculator covers England and Northern Ireland (SDLT). Scotland (LBTT) and Wales (LTT) calculators are coming soon.</p>
            <p><strong>Can I use these on mobile?</strong> Yes, all calculators are fully responsive and work on any device.</p>
          </Fade>
        </div>
      </section>

      {/* AD SLOT 3 */}
      <div style={S.adSlot}>
        <div style={S.adPlaceholder}>— Ad —</div>
      </div>

      {/* FOOTER */}
      <footer style={S.footer}>
        <div style={S.footerInner}>
          <div style={S.logo}>
            <span style={S.logoMark}>⬡</span>
            <span style={{ ...S.logoName, color: "#999" }}>UKTaxCalcs</span>
            <span style={{ ...S.logoDot, color: "#7c6a4f" }}>.co.uk</span>
          </div>
          <div style={S.footerLinks}>
            <a href="#" style={S.footerLink}>Privacy</a>
            <a href="#" style={S.footerLink}>Terms</a>
            <a href="#" style={S.footerLink}>Contact</a>
          </div>
          <p style={S.footerCopy}>© 2026 UKTaxCalcs.co.uk — Free UK tax calculators. Not financial advice.</p>
        </div>
      </footer>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Karla:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { background: #faf8f5; }
  a { text-decoration: none; }
`;

const S = {
  page: { fontFamily: "'Karla', sans-serif", background: "#faf8f5", color: "#1a1a1a", overflowX: "hidden" },

  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(250,248,245,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid #eae6df" },
  navInner: { maxWidth: 960, margin: "0 auto", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { display: "flex", alignItems: "center", gap: 5 },
  logoMark: { fontSize: 18, color: "#7c6a4f" },
  logoName: { fontFamily: "'Instrument Serif', serif", fontSize: 18, fontWeight: 400, color: "#1a1a1a" },
  logoDot: { fontFamily: "'Instrument Serif', serif", fontSize: 18, color: "#7c6a4f" },
  navRight: { display: "flex", gap: 20 },
  navLink: { fontSize: 14, fontWeight: 600, color: "#888" },

  hero: { maxWidth: 680, margin: "0 auto", padding: "140px 24px 64px", textAlign: "center" },
  heroEyebrow: { fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7c6a4f", marginBottom: 16 },
  heroTitle: { fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 400, lineHeight: 1.12, color: "#1a1a1a", marginBottom: 20, letterSpacing: "-0.01em" },
  heroAccent: { color: "#7c6a4f" },
  heroSub: { fontSize: 17, lineHeight: 1.65, color: "#777", maxWidth: 500, margin: "0 auto 28px" },
  heroCta: { display: "inline-block", padding: "13px 28px", background: "#1a1a1a", color: "#fff", borderRadius: 10, fontSize: 15, fontWeight: 700 },

  section: { maxWidth: 960, margin: "0 auto", padding: "64px 24px" },
  sectionEyebrow: { fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7c6a4f", marginBottom: 8, textAlign: "center" },
  sectionTitle: { fontFamily: "'Instrument Serif', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 400, color: "#1a1a1a", textAlign: "center", marginBottom: 36 },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 },
  card: {
    display: "flex", flexDirection: "column", padding: "24px 22px", background: "#fff",
    borderRadius: 14, border: "1px solid #eae6df", transition: "border-color 0.2s, box-shadow 0.2s",
    cursor: "pointer", textDecoration: "none", color: "inherit", flex: 1,
  },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  cardIcon: { fontSize: 28 },
  cardTag: { fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", padding: "3px 8px", borderRadius: 100, textTransform: "uppercase" },
  cardTitle: { fontSize: 18, fontWeight: 700, color: "#1a1a1a", marginBottom: 8, fontFamily: "'Karla', sans-serif" },
  cardDesc: { fontSize: 14, color: "#777", lineHeight: 1.6, flex: 1, marginBottom: 14 },
  cardLink: { fontSize: 14, fontWeight: 700 },

  upcoming: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, maxWidth: 600, margin: "0 auto 32px" },
  upcomingItem: { display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "#fff", borderRadius: 100, border: "1px solid #eae6df", fontSize: 14, color: "#555", fontWeight: 500 },
  upcomingDot: { width: 6, height: 6, borderRadius: "50%", background: "#d4c9b8" },

  newsletter: { maxWidth: 400, margin: "0 auto", textAlign: "center" },
  nlText: { fontSize: 14, color: "#777", marginBottom: 12 },
  nlForm: { display: "flex", gap: 8 },
  nlInput: { flex: 1, padding: "12px 14px", border: "1px solid #ddd", borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "'Karla', sans-serif", background: "#fff" },
  nlBtn: { padding: "12px 20px", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Karla', sans-serif" },
  nlSuccess: { fontSize: 15, color: "#2d6a4f", fontWeight: 600 },

  seoContent: { maxWidth: 680, margin: "0 auto", fontSize: 15, color: "#555", lineHeight: 1.8 },
  seoSubtitle: { fontFamily: "'Instrument Serif', serif", fontSize: 22, color: "#1a1a1a", margin: "24px 0 12px" },

  adSlot: { maxWidth: 960, margin: "0 auto", padding: "16px 24px" },
  adPlaceholder: { background: "#f0ede8", borderRadius: 8, padding: "20px", textAlign: "center", fontSize: 12, color: "#bbb", fontWeight: 600, letterSpacing: "0.08em" },

  footer: { borderTop: "1px solid #eae6df", padding: "32px 24px", marginTop: 32 },
  footerInner: { maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  footerLinks: { display: "flex", gap: 20 },
  footerLink: { fontSize: 13, color: "#999" },
  footerCopy: { fontSize: 12, color: "#bbb", textAlign: "center" },
};
