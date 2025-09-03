"use client";
import { useMemo, useState } from "react";

const PRIMARY = "#237e7d";   // VetTechPrep primary
const SECONDARY = "#de682d"; // VetTechPrep secondary

export default function Page() {
  const [examDate, setExamDate] = useState("");
  const [touched, setTouched] = useState(false);

  const result = useMemo(() => {
    if (!examDate) return null;

    const [y, m, d] = examDate.split("-").map(Number);
    const selected = new Date(y, m - 1, d, 12, 0, 0); // noon local to avoid TZ quirks
    const today = new Date();
    const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const msPerDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.floor((selected - todayMid) / msPerDay);

    if (isNaN(diffDays)) return { error: "Please enter a valid date." };
    if (diffDays < 0) return { error: "That date is in the past. Pick a future exam date." };
    if (diffDays === 0) return { error: "That’s today! Choose a future exam date so we can help." };

    // Plans:
    // ≥180 => 180-day; 90–179 => 90-day; 1–89 => 45-day
    let plan = "180-day";
    if (diffDays < 180 && diffDays >= 90) plan = "90-day";
    if (diffDays < 90) plan = "45-day";

    return {
      days: diffDays,
      plan,
      description:
        plan === "180-day"
          ? "You have ample time to prep with full coverage and review."
          : plan === "90-day"
          ? "You’re inside 180 days, focus and stay sharp with the 90-day plan."
          : "You’re inside 90 days, use the 45-day plan to focus and finalize.",
    };
  }, [examDate]);

  const pricingUrl = "https://www.vettechprep.com/sign-up-and-pricing.jsp";
  const pricingHref =
    result && !result.error
      ? `${pricingUrl}?recommended=${result.plan.replace("-day", "")}` // 180 / 90 / 45
      : pricingUrl;

  // CTA background: 180 = PRIMARY, 90/45 = SECONDARY
  const planBg = result?.plan === "180-day" ? PRIMARY : SECONDARY;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: "16px 12px", // tighter on mobile
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 640,
          background: "#ffffff",
          padding: "16px", // lighter padding for phones
          margin: "0 auto",
        }}
      >
        <header style={{ textAlign: "center", marginBottom: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              margin: "0 auto 12px",
              background: PRIMARY,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              padding: 8, // logo breathing room
            }}
          >
            <img
              src="/vtp-logo.png" // place file in /public/vtp-logo.png (or change the name)
              alt="VetTechPrep logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
          <h1
            style={{
              fontSize: "clamp(20px, 5vw, 28px)",
              margin: "0 0 6px",
              color: "#1f2937",
              lineHeight: 1.25,
            }}
          >
            Find your best VetTechPrep plan
          </h1>
          <p style={{ color: "#6b7280", margin: 0, fontSize: "clamp(14px, 3.6vw, 16px)" }}>
            Enter your VTNE exam date to get a recommendation.
          </p>
        </header>

        <label
          htmlFor="examDate"
          style={{
            display: "block",
            fontWeight: 600,
            marginTop: 16,
            marginBottom: 6,
            fontSize: "clamp(14px, 3.6vw, 16px)",
          }}
        >
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
            fontSize: "clamp(16px, 4vw, 18px)",
          }}
        />

        {touched && !examDate ? (
          <p style={{ color: "#6b7280", marginTop: 6, fontSize: "clamp(12px, 3.2vw, 14px)" }}>
            Tip: tap the calendar and choose your test day.
          </p>
        ) : null}

        {result && (
          <section
            style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 12,
              background: "#f3f7f6",
              border: `${PRIMARY}22 solid 1px`,
            }}
          >
            {result.error ? (
              <p
                style={{
                  color: "#b91c1c",
                  fontWeight: 600,
                  fontSize: "clamp(14px, 3.6vw, 16px)",
                }}
              >
                {result.error}
              </p>
            ) : (
              <div>
                <p style={{ color: "#6b7280", marginBottom: 0, fontSize: "clamp(12px, 3.2vw, 14px)" }}>
                  Days until exam
                </p>
                <p
                  style={{
                    fontSize: "clamp(24px, 6.5vw, 36px)",
                    fontWeight: 800,
                    margin: "4px 0 12px",
                    color: "#1f2937",
                  }}
                >
                  {result.days}
                </p>

                <p style={{ color: "#6b7280", marginBottom: 0, fontSize: "clamp(12px, 3.2vw, 14px)" }}>
                  Recommended plan
                </p>
                <p style={{ fontSize: "clamp(14px, 3.6vw, 16px)", color: "#1f2937", margin: "4px 0 8px" }}>
                  <strong
                    style={{
                      background: planBg,
                      color: "#ffffff",
                      padding: "6px 10px",
                      borderRadius: 999,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {result.plan}
                  </strong>
                </p>

                <p style={{ color: "#374151", marginTop: 8, fontSize: "clamp(14px, 3.6vw, 16px)", lineHeight: 1.5 }}>
                  {result.description}
                </p>

                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                  <a
                    href={pricingHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Go to VetTechPrep pricing to choose the ${result.plan}`}
                    style={{
                      display: "block", // full width on mobile
                      width: "100%",
                      textDecoration: "none",
                      padding: "14px 16px",
                      borderRadius: 12,
                      fontWeight: 700,
                      background: planBg,
                      color: "#ffffff",
                      textAlign: "center",
                      fontSize: "clamp(16px, 4vw, 18px)",
                    }}
                  >
                    Continue with {result.plan}
                  </a>
                </div>

                {/* Testimonial */}
                <div
                  style={{
                    marginTop: 16,
                    padding: 16,
                    borderRadius: 12,
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  {/* Five-star rating */}
                  <div
                    style={{ display: "flex", gap: 4, marginBottom: 8 }}
                    aria-label="5 out of 5 stars"
                    role="img"
                  >
                    <span style={{ fontSize: "clamp(16px, 4.5vw, 18px)", color: "#f59e0b" }}>★</span>
                    <span style={{ fontSize: "clamp(16px, 4.5vw, 18px)", color: "#f59e0b" }}>★</span>
                    <span style={{ fontSize: "clamp(16px, 4.5vw, 18px)", color: "#f59e0b" }}>★</span>
                    <span style={{ fontSize: "clamp(16px, 4.5vw, 18px)", color: "#f59e0b" }}>★</span>
                    <span style={{ fontSize: "clamp(16px, 4.5vw, 18px)", color: "#f59e0b" }}>★</span>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      color: "#374151",
                      lineHeight: 1.6,
                      fontSize: "clamp(14px, 3.6vw, 16px)",
                    }}
                  >
                    “I enjoyed using VTP. It was easy to use and gave me multiple ways of studying, other than just
                    memorizing questions. I think it can help build confidence in testing for the VTNE and really
                    help cement information you might not truly have down. VTP helped me pass my VTNE, and I think if
                    you put the work in to complete it, anyone can pass too.”
                  </p>
                  <p
                    style={{
                      margin: "8px 0 0",
                      color: "#6b7280",
                      fontStyle: "italic",
                      fontSize: "clamp(12px, 3.2vw, 14px)",
                    }}
                  >
                    — Morgan
                  </p>
                </div>

                <p style={{ color: "#6b7280", marginTop: 12, fontSize: "clamp(12px, 3.2vw, 14px)" }}>
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
