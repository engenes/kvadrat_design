# News — секция главной страницы (React-референс)

Точная структура/копирайт/токены. Переносить как отдельный Vue-компонент `News.vue`, не копировать JSX напрямую.

```jsx
function News() {
  const { ArticleCard, IconBadge } = window.DesignSystem_16ec3d;
  const news = [
    { image: "../../assets/images/fig/a005fbedcccf8482.jpg", category: "Акция", title: "Тестовый заголовок акции для примера", meta: "21 ноября 2018", elevation: "featured" },
    { image: "../../assets/images/fig/41cd0a0530a4be35.jpg", category: "Застройщики", title: "Тестовый заголовок новости для примера", meta: "21 ноября 2018" },
  ];
  const Arrow = () => (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="var(--ink-600)"><path d="M9.433 0.15c-.197-.2-.508-.2-.705 0-.19.194-.19.517 0 .71l3.577 3.634H.31C.035 4.494 0 4.717 0 4.996c0 .28.035.509.31.509h11.995L8.728 9.14c-.19.2-.19.523 0 .71.197.2.508.2.705 0l4.424-4.495c.19-.194.19-.516 0-.71L9.433.15Z" /></svg>
  );
  return (
    <div style={{ position: "relative", width: 1920, height: 480, background: "var(--surface-white)" }}>
      <p style={{ position: "absolute", left: 390, top: 0, margin: 0, fontFamily: "var(--font-sans)", fontSize: 14, letterSpacing: "0.2em", color: "var(--blue-500)", textTransform: "uppercase" }}>Актуальное</p>
      <h2 style={{ position: "absolute", left: 390, top: 30, margin: 0, fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 36, letterSpacing: "0.05em", color: "var(--ink-900)" }}>Новости</h2>
      <label style={{ position: "absolute", left: 390, top: 100, display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-sans)", fontSize: 13, letterSpacing: "0.03em", color: "var(--neutral-900)" }}>
        <span style={{ width: 48, height: 24, borderRadius: 50, background: "var(--ink-300)", position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", left: 3, top: 3, width: 18, height: 18, borderRadius: "50%", background: "var(--surface-white)" }} />
        </span>
        Только акции
      </label>

      <div style={{ position: "absolute", left: 390, top: 150, display: "flex", gap: 21 }}>
        {news.map((n) => <ArticleCard key={n.title} {...n} />)}
      </div>

      <a href="#" style={{ position: "absolute", left: 390, top: 445, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 14, letterSpacing: "0.1em", color: "var(--ink-600)" }}>
        Все новости <Arrow />
      </a>
      <div style={{ position: "absolute", left: 1416, top: 430, display: "flex", gap: 10 }}>
        <IconBadge variant="ring"><div style={{ transform: "rotate(180deg)" }}><Arrow /></div></IconBadge>
        <IconBadge variant="ring"><Arrow /></IconBadge>
      </div>
    </div>
  );
}
window.News = News;

```
