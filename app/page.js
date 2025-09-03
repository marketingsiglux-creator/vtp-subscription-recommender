"use client";
import { useMemo, useState } from "react";

const PRIMARY = "#237e7d";
const SECONDARY = "#de682d";

export default function Page() {
  const [examDate, setExamDate] = useState("");
  const [touched, setTouched] = useState(false);

  const result = useMemo(() => {
    if (!examDate) return null;

    const [y, m, d] = examDate.split("-").map(Number);
    const selected = new Date(y, m - 1, d, 12, 0, 0); // noon local
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
    <main style={{
      minHeight: "100vh",
      background: "#ffffff",
      padding: 24,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center"
    }}>
      <div style={{
        width: "100%",
        maxWidth: 640,
        background: "#ffffff",
        padding: 24
      }}>
        <header style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            margin: "0 auto 12px",
            background: PRIMARY,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            padding: 8
          }}>
            <img
              src="/vtp-logo.png"
              alt="VetTechPrep logo"
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </div>
          <h1 style={{ fontSize: 24, margin: "0 0 6px", color: "#1f2937" }}>
            Find your best VetTechPrep plan
          </h1>
          <p style={{ color: "#6b7280", margin: 0 }}>
            Enter your VTNE exam date to get a recommendation.
          </p>
        </header>

        <label htmlFor="examDate" style={{ display: "block", fontWeight: 600, marginTop: 16, marginBottom: 6 }}>
          Exam date
        </label>
        <input
          id="examDate"
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          onBlur={() => setTouched(true)}
          style={{
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
            display: "block",
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid #d1d5db",
            outline: "none",
            fontSize: 16
          }}
        />

        {touched && !examDate ? (
          <p style={{ color: "#6b7280", marginTop: 6 }}>Tip: tap the calendar and choose your test day.</p>
        ) : null}

        {result && (
          <section style={{
            marginTop: 16, padding: 16, borderRadius: 12,
            background: "#f3f7f6", border: `${PRIMARY}22 solid 1px`
          }}>
            {result.error ? (
              <p style={{ color: "#b91c1c", fontWeight: 600 }}>{result.error}</p>
            ) : (
              <div>
                <p style={{ color: "#6b7280", marginBottom: 0 }}>Days until exam</p>
                <p style={{ fontSize: 36, fontWeight: 800, margin: "4px 0 12px", color: "#1f2937" }}>
                  {result.days}
                </p>
                <p style={{ color: "#6b7280", marginBottom: 0 }}>Recommended plan</p>
                <p style={{ fontSize: 14, color: "#1f2937" }}>
                  {result.plan === "180-day" ? (
                    <strong style={{
                      background: PRIMARY, color: "#ffffff",
                      padding: "6px 10px", borderRadius: 999
                    }}>
                      180-day
                    </strong>
                  ) : (
                    <strong style={{
                      background: SECONDARY, color: "#ffffff",
                      padding: "6px 10px", borderRadius: 999
                    }}>
                      90-day
                    </strong>
                  )}
                </p>
                <p style={{ color: "#374151", marginTop: 12 }}>{result.description}</p>

                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                  <a
                    href={pricingHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Go to VetTechPrep pricing to choose the ${result.plan}`}
                    style={{
                      display: "inline-block",
                      textDecoration: "none",
                      padding: "12px 16px",
                      borderRadius: 12,
                      fontWeight: 700,
                      background: result.plan === "180-day" ? PRIMARY : SECONDARY,
                      color: "#ffffff"
                    }}
                  >
                    Continue with {result.plan}
                  </a>
                </div>

                <p style={{ color: "#6b7280", marginTop: 12, fontSize: 12 }}>
                  Not sure? You can always switch your plan before checkout.
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
