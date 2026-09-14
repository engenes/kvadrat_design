# Mortgage — секция главной страницы (React-референс)

Точная структура/копирайт/токены. Переносить как отдельный Vue-компонент `Mortgage.vue`, не копировать JSX напрямую.

```jsx
function Mortgage() {
  const row1 = ["Помощь в получении ипотеки. Ипотечный калькулятор.", "Ипотека без первого взноса", "Рефинансирование ипотеки"];
  const row2 = ["Материнский капитал", "Военная ипотека"];
  const Tile = ({ title, left, top }) => (
    <div style={{ position: "absolute", left, top, width: 369, height: 170, background: "var(--neutral-700)", boxShadow: "var(--shadow-button)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 22, lineHeight: 1.05, color: "var(--surface-white)", maxWidth: 230 }}>{title}</span>
      <div style={{ width: 34, height: 34, borderRadius: "50%", boxShadow: "inset 0 0 0 1px var(--border-on-dark)", display: "flex", alignItems: "center", justifyContent: "center", alignSelf: "flex-end" }}>
        <svg width="12" height="9" viewBox="0 0 14 10" fill="var(--surface-white)" style={{ transform: "rotate(180deg)" }}><path d="M4.567 0.15c.197-.2.508-.2.705 0 .19.194.19.517 0 .71L1.695 4.494H13.5c.274 0 .5.223.5.502 0 .28-.226.509-.5.509H1.695l3.577 3.628c.19.2.19.523 0 .71-.197.2-.508.2-.705 0L.143 5.355c-.19-.194-.19-.516 0-.71L4.567.15Z" /></svg>
      </div>
    </div>
  );
  return (
    <div style={{ position: "relative", width: 1920, height: 780, background: "var(--neutral-900)", overflow: "hidden" }}>
      <img src="../../assets/icons/percent-badge.svg" alt="" style={{ position: "absolute", left: -60, top: 520, width: 280, height: 260, opacity: 0.5 }} />
      <p style={{ position: "absolute", left: 390, top: 56, margin: 0, fontFamily: "var(--font-sans)", fontSize: 14, letterSpacing: "0.25em", color: "var(--blue-500)", textTransform: "uppercase" }}>Низкий процент</p>
      <h2 style={{ position: "absolute", left: 390, top: 86, margin: 0, width: 420, fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 36, letterSpacing: "0.05em", lineHeight: 0.9, color: "var(--surface-white)" }}>Ипотечное кредитование</h2>
      <p style={{ position: "absolute", left: 850, top: 90, margin: 0, width: 680, fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.3, color: "var(--ink-100-on-dark)" }}>Мы бесплатно получим для вас ипотечное решение на самых выгодных условиях, а так же окажем содействие в покупке квартиры с использованием материнского семейного капитала, военной ипотеки и других жилищных сертификатов.</p>

      {row1.map((t, i) => <Tile key={t} title={t} left={390 + i * 390} top={280} />)}
      {row2.map((t, i) => <Tile key={t} title={t} left={390 + i * 390} top={472} />)}
    </div>
  );
}
window.Mortgage = Mortgage;

```
