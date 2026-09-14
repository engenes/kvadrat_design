# Services — секция главной страницы (React-референс)

Точная структура/копирайт/токены. Переносить как отдельный Vue-компонент `Services.vue`, не копировать JSX напрямую.

```jsx
function Services() {
  const cards = [
    { title: "Продажа\nнедвижимости", image: "../../assets/images/apartment-interior-1.jpg", tone: "white" },
    { title: "Покупка\nнедвижимости", sub: "Студии, однокомнатные,\nдвухкомнатные, трехкомнатные", tone: "wash" },
    { title: "Покупка от\nзастройщика", image: "../../assets/images/newbuild-4.png", tone: "white" },
    { title: "Аренда\nнедвижимости", sub: "Поможем нанимателям снять жилье или коммерческую недвижимость, а владельцам найти нанимателей.", tone: "wash" },
    { title: "Оценка\nнедвижимости", sub: "Проведем оценку объекта недвижимости с выдачей официального отчета об оценке.", tone: "wash" },
    { title: "Юридическое\nсопровождение", sub: "Подготовим документы и проведем сопровождение сделок купли-продажи любой сложности.", tone: "dark" },
  ];
  const toneBg = { white: "var(--surface-white)", wash: "var(--surface-wash)", dark: "var(--neutral-900)" };
  return (
    <div style={{ position: "relative", width: 1920, height: 800, background: "var(--surface-white)" }}>
      <p style={{ position: "absolute", left: 390, top: 56, margin: 0, fontFamily: "var(--font-sans)", fontSize: 14, letterSpacing: "0.25em", color: "var(--blue-500)", textTransform: "uppercase" }}>Полный цикл</p>
      <h2 style={{ position: "absolute", left: 390, top: 86, margin: 0, fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 36, letterSpacing: "0.05em", lineHeight: 0.9, color: "var(--ink-900)" }}>Услуги агентства</h2>
      <a href="#" style={{ position: "absolute", left: 1444, top: 100, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 14, letterSpacing: "0.1em", color: "var(--ink-600)" }}>
        Все услуги
        <svg width="14" height="10" viewBox="0 0 14 10" fill="var(--ink-600)" style={{ transform: "rotate(180deg)" }}><path d="M4.567 0.15c.197-.2.508-.2.705 0 .19.194.19.517 0 .71L1.695 4.494H13.5c.274 0 .5.223.5.502 0 .28-.226.509-.5.509H1.695l3.577 3.628c.19.2.19.523 0 .71-.197.2-.508.2-.705 0L.143 5.355c-.19-.194-.19-.516 0-.71L4.567.15Z" /></svg>
      </a>
      {cards.map((c, i) => {
        const col = i % 3, row = Math.floor(i / 3);
        return (
          <div key={c.title} style={{ position: "absolute", left: 390 + col * 390, top: 172 + row * 301, width: 369, height: 280, background: toneBg[c.tone], overflow: "hidden", padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ whiteSpace: "pre-line", fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 24, lineHeight: 1, color: c.tone === "dark" ? "var(--surface-white)" : "var(--ink-900)", maxWidth: c.image ? "58%" : "90%" }}>{c.title}</span>
            {c.sub && <span style={{ whiteSpace: "pre-line", fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.4, color: c.tone === "dark" ? "var(--ink-100-on-dark)" : "var(--ink-600)", maxWidth: "62%" }}>{c.sub}</span>}
            {c.image && <img src={c.image} alt="" style={{ position: "absolute", right: 0, bottom: 0, width: "50%", height: "62%", objectFit: "cover" }} />}
          </div>
        );
      })}
    </div>
  );
}
window.Services = Services;

```
