# LoremSection — секция главной страницы (React-референс)

Точная структура/копирайт/токены. Переносить как отдельный Vue-компонент `LoremSection.vue`, не копировать JSX напрямую.

```jsx
function LoremSection() {
  const { Logo } = window.DesignSystem_16ec3d;
  const p1 = "Nunc pro nunc. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo.";
  const p2 = "Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor.";
  return (
    <div style={{ position: "relative", width: 1920, height: 400, background: "var(--surface-white)" }}>
      <p style={{ position: "absolute", left: 390, top: 0, margin: 0, fontFamily: "var(--font-sans)", fontSize: 14, letterSpacing: "0.2em", color: "var(--blue-500)", textTransform: "uppercase" }}>Тестовое</p>
      <h2 style={{ position: "absolute", left: 390, top: 30, margin: 0, fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 36, letterSpacing: "0.05em", color: "var(--ink-900)" }}>Заголовок</h2>
      <Logo variant="mark" height={40} style={{ position: "absolute", left: 1460, top: 10, opacity: 0.5 }} />
      <div style={{ position: "absolute", left: 390, top: 130, width: 1140, height: 1, background: "var(--ink-200)" }} />
      <p style={{ position: "absolute", left: 390, top: 170, margin: 0, width: 540, fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.5, color: "var(--ink-600)" }}>{p1}</p>
      <p style={{ position: "absolute", left: 990, top: 170, margin: 0, width: 540, fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.5, color: "var(--ink-600)" }}>{p2}</p>
    </div>
  );
}
window.LoremSection = LoremSection;

```
