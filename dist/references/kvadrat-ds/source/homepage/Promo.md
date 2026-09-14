# Promo — секция главной страницы (React-референс)

Точная структура/копирайт/токены. Переносить как отдельный Vue-компонент `Promo.vue`, не копировать JSX напрямую.

```jsx
function Promo() {
  const { Button, Avatar } = window.DesignSystem_16ec3d;
  const tiles = [
    { eyebrow: "Без комиссии", title: "Офис продаж\nот застройщиков", image: "../../assets/images/fig/3601de3847fa3114.png", tone: "dark" },
    { eyebrow: "Просто", title: "Более 10 банков\nв одном месте", image: "../../assets/images/fig/4ea7bdf126e22064.png", tone: "wash" },
    { eyebrow: "Удобно", title: "15 застройщиков\nв одном месте", image: "../../assets/images/fig/16018cf6e66fdbb9.png", tone: "dark" },
  ];
  const agents = [
    { label: "Лучший риэлтор месяца", name: "Жанслу Татлубаева", phone: "+7 (666) 666-66-66", photo: "../../assets/images/fig/4a18204de262b712.png" },
    { label: "Лучший риэлтор недели", name: "Алибек", phone: "+7 (5555) 55-55-83", photo: "../../assets/images/fig/47b7195c9da4b365.png" },
  ];
  return (
    <div style={{ position: "relative", width: 1920, height: 700, background: "var(--surface-white)" }}>
      {tiles.map((t, i) => (
        <div key={t.title} style={{ position: "absolute", left: 390 + i * 390, top: 40, width: 369, height: 375, overflow: "hidden", background: t.tone === "dark" ? "var(--neutral-900)" : "linear-gradient(-30deg, var(--blue-tint-100) -20%, rgba(221,232,237,0) 130%)", padding: 32, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: "0 0 6px", fontFamily: "var(--font-sans)", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--blue-500)" }}>{t.eyebrow}</p>
            <h3 style={{ margin: 0, whiteSpace: "pre-line", fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 24, lineHeight: 1.05, color: t.tone === "dark" ? "var(--surface-white)" : "var(--ink-900)" }}>{t.title}</h3>
          </div>
          <Button variant={t.tone === "dark" ? "primary" : "outline"} size="sm">Подробнее</Button>
          <img src={t.image} alt="" style={{ position: "absolute", right: 0, bottom: 0, width: "56%", height: "42%", objectFit: "cover", opacity: t.tone === "dark" ? 0.9 : 1 }} />
        </div>
      ))}

      {agents.map((a, i) => (
        <div key={a.name} style={{ position: "absolute", left: 390 + i * 583, top: 460, width: 563, height: 173, background: "var(--surface-white)", boxShadow: "var(--shadow-card-resting)", display: "flex", alignItems: "center", gap: 24, padding: "0 32px" }}>
          <Avatar src={a.photo} size={80} />
          <div>
            <p style={{ margin: "0 0 10px", fontFamily: "var(--font-sans)", fontSize: 16, color: "var(--ink-600)" }}>{a.label}</p>
            <p style={{ margin: "0 0 4px", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 16, color: "var(--ink-900)" }}>{a.name}</p>
            <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 14, letterSpacing: "0.05em", color: "var(--ink-400)" }}>{a.phone}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
window.Promo = Promo;

```
