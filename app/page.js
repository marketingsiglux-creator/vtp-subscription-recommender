"use client";
import { useMemo, useState } from "react";

const COLORS = {
  primary: "#237e7d",
  secondary: "#de682d",
  text: "#1f2937",
  bg: "#f7faf9",
  white: "#ffffff",
};

export default function Page() {
  const [examDate, setExamDate] = useState("");
  const [touched, setTouched] = useState(false);

  const result = useMemo(() => {
    if (!examDate) return null;
    const [y, m, d] = examDate.split("-").map(Number);
    const selected = new Date(y, m - 1, d, 12, 0, 0);
    const today = new Date();
    const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const msPerDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.floor((selected - todayMid) / msPerDay);

    if (isNaN(diffDays)) return { error: "Please enter a valid date." };
    if (diffDays < 0) return { error: "That date is in the past. Pick a future exam date." };
    if (diffDays === 0) return { error: "That’s today! Choose a future exam date so we can help." };

    const recommend180 = diffDays >= 180;

    return {
      days: diffDays,
      plan: recommend180 ? "180-day" : "90-day",
      description: recommend180
        ? "You have ample time to prep with full coverage and review."
        : "You’re inside 180 days—focus and stay sharp with the 90-day plan.",
    };
  }, [examDate]);

  const pricingUrl = "https://www.vettechprep.com/sign-up-and-pricing.jsp";
  const pricingHref =
    result && !result.error
      ? `${pricingUrl}?recommended=${result.plan === "180-day" ? "180" : "90"}`
      : pricingUrl;

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <header style={styles.header}>
          <div style={styles.logoCircle}>VTP</div>
          <h1 style={styles.h1}>Find your best VetTechPrep plan</h1>
          <p style={styles.lead}>Enter your VTNE exam date to get a recommendation.</p>
        </header>

        <label htmlFor="examDate" style={styles.label}>Exam date</label>
        <input
          id="examDate"
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          onBlur={() => setTouched(true)}
          style={styles.input}
        />

        {touched && !examDate ? <p style={styles.help}>Tip: tap the calendar and choose your test day.</p> : null}

        {result && (
          <section style={styles.resultBox}>
            {result.error ? (
              <p style={styles.error}>{result.error}</p>
            ) : (
              <div>
                <p style={styles.subtle}>Days until exam</p>
                <p style={styles.days}>{result.days}</p>
                <p style={styles.subtle}>Recommended plan</p>
                <p style={styles.plan}>
                  {result.plan === "180-day" ? (
                    <strong style={styles.planBadgePrimary}>180-day</strong>
                  ) : (
                    <strong style={styles.planBadgeSecondary}>90-day</strong>
                  )}
                </p>
                <p style={styles.desc}>{result.description}</p>

                <div style={styles.ctaRow}>
                  <a
                    href={pricingHref}
                    style={{
                      ...styles.button,
                      ...(result.plan === "180-day" ? styles.buttonPrimary : styles.buttonSecondary),
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Go to VetTechPrep pricing to choose the ${result.plan}`}
                  >
                    Continue with {result.plan}
                  </a>
                </div>

                <p style={styles.smallPrint}>Not sure? You can always switch your plan before checkout.</p>
              </div>
            )}
          </section>
        )}

        <footer style={styles.footer}>
          <p>
            Built for <strong>VetTechPrep</strong> • Colors: <code>#237e7d</code> & <code>#de682d</code>
          </p>
        </footer>
      </div>
    </main>
  );
}

const styles = {
  main: {
    minHeight: "100vh",
    background: COLORS.bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: 640,
    background: COLORS.white,
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    padding: 24,
  },
  header: { textAlign: "center", marginBottom: 16 },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    margin: "0 auto 12px",
    background: COLORS.primary,
    color: COLORS.white,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    letterSpacing: 1,
  },
  h1: { fontSize: 24, margin: "0 0 6px", color: COLORS.text },
  lead: { color: "#6b7280", margin: 0 },
  label: { display: "block", fontWeight: 600, marginTop: 16, marginBottom: 6 },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: 16,
  },
  help: { color: "#6b7280", marginTop: 6 },
  resultBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    background: "#f3f7f6",
    border: `1px solid ${COLORS.primary}22`,
  },
  error: { color: "#b91c1c", fontWeight: 600 },
  subtle: { color: "#6b7280", marginBottom: 0 },
  days: { fontSize: 36, fontWeight: 800, margin: "4px 0 12px", color: COLORS.text },
  plan: { fontSize: 14, color: COLORS.text },
  planBadgePrimary: {
    background: COLORS.primary,
    color: COLORS.white,
    padding: "6px 10px",
    borderRadius: 999,
  },
  planBadgeSecondary: {
    background: COLORS.secondary,
    color: COLORS.white,
    padding: "6px 10px",
    borderRadius: 999,
  },
  desc: { color: "#374151", marginTop: 12 },
  ctaRow: { display: "flex", gap: 12, marginTop: 12 },
  button: {
    display: "inline-block",
    textDecoration: "none",
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 700,
  },
  buttonPrimary: { background: COLORS.primary, color: COLORS.white },
  buttonSecondary: { background: COLORS.secondary, color: COLORS.white },
  smallPrint: { color: "#6b7280", marginTop: 12, fontSize: 12 },
  footer: { marginTop: 18, textAlign: "center", color: "#6b7280" },
};
