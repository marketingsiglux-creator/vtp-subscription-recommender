export const metadata = {
  title: "VetTechPrep Subscription Recommender",
  description: "Enter your VTNE exam date to get a plan recommendation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" }}>
        {children}
      </body>
    </html>
  );
}
