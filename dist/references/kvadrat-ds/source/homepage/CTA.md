# CTA — секция главной страницы (React-референс)

Точная структура/копирайт/токены. Переносить как отдельный Vue-компонент `CTA.vue`, не копировать JSX напрямую.

```jsx
function CTA() {
  const { Button } = window.DesignSystem_16ec3d;
  return (
    <div style={{ position: "relative", width: 1920, height: 520, background: "var(--neutral-900)", overflow: "hidden" }}>
      <img src="../../assets/images/fig/880316dc7fbbcd57.png" alt="" style={{ position: "absolute", right: 260, top: 0, width: 320, height: 520, objectFit: "cover", objectPosition: "top" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 520, background: "linear-gradient(90deg, var(--neutral-900) 46%, rgba(47,51,54,0.2) 70%)" }} />
      <p style={{ position: "absolute", left: 390, top: 150, margin: 0, fontFamily: "var(--font-sans)", fontSize: 14, letterSpacing: "0.2em", color: "var(--blue-500)", textTransform: "uppercase" }}>Консультация</p>
      <h2 style={{ position: "absolute", left: 390, top: 180, margin: 0, fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 36, letterSpacing: "0.05em", color: "var(--surface-white)" }}>Напишите нам</h2>
      <p style={{ position: "absolute", left: 390, top: 240, margin: 0, width: 500, fontFamily: "var(--font-sans)", fontSize: 18, lineHeight: 1.3, color: "var(--surface-white)" }}>Мы свяжемся с вами в ближайшее время и поможем вам сделать лучший выбор, а также безопасно провести сделку.</p>
      <Button variant="primary" style={{ position: "absolute", left: 390, top: 330 }}>Оставить заявку</Button>
    </div>
  );
}
window.CTA = CTA;

```
