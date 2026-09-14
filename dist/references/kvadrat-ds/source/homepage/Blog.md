# Blog — секция главной страницы (React-референс)

Точная структура/копирайт/токены. Переносить как отдельный Vue-компонент `Blog.vue`, не копировать JSX напрямую.

```jsx
function Blog() {
  const { Avatar, IconBadge } = window.DesignSystem_16ec3d;
  const posts = [
    { tag: "Полезно", title: "Квартиры в кирпичных, панельных, монолитных домах - что выбрать?", name: "Гульмира Суеналимова", role: "Риелтор, директор агентства", photo: "../../assets/images/avatar-photo-1.png" },
    { tag: "Полезно", title: "Как быстро продать квартиру в Оренбурге?", name: "Ипотечный брокер", role: "", photo: "../../assets/images/agent-realtor-1.png" },
    { tag: "Важно", title: "Какие документы проверить при покупке квартиры?", name: "Риелтор", role: "Тестовая Тест", photo: "../../assets/images/agent-realtor-2.png" },
    { tag: "Полезно", title: "Вторичка или новостройка - что выбрать?", name: "Риелтор", role: "", photo: "../../assets/images/avatar-photo-1.png" },
  ];
  const Arrow = () => (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="var(--ink-600)"><path d="M9.433 0.15c-.197-.2-.508-.2-.705 0-.19.194-.19.517 0 .71l3.577 3.634H.31C.035 4.494 0 4.717 0 4.996c0 .28.035.509.31.509h11.995L8.728 9.14c-.19.2-.19.523 0 .71.197.2.508.2.705 0l4.424-4.495c.19-.194.19-.516 0-.71L9.433.15Z" /></svg>
  );
  return (
    <div style={{ position: "relative", width: 1920, height: 560, background: "var(--surface-wash)" }}>
      <h2 style={{ position: "absolute", left: 390, top: 40, margin: 0, fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 36, letterSpacing: "0.05em", color: "var(--ink-900)" }}>Наш блог</h2>

      <div style={{ position: "absolute", left: 390, top: 130, display: "flex", gap: 20 }}>
        {posts.map((p) => (
          <div key={p.title} style={{ width: 270, height: 380, background: "linear-gradient(-8deg, var(--blue-tint-100) -60%, rgba(255,255,255,0) 90%)", padding: "28px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span style={{ display: "inline-flex", height: 23, paddingInline: 12, alignItems: "center", borderRadius: 100, background: "var(--surface-white)", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 12, letterSpacing: "0.03em", color: "var(--neutral-900)" }}>{p.tag}</span>
              <p style={{ margin: "20px 0 0", fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 18, lineHeight: 1.3, color: "var(--ink-900)" }}>{p.title}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar src={p.photo} size={44} />
              <div>
                <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink-900)" }}>{p.name}</p>
                {p.role && <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-400)" }}>{p.role}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <a href="#" style={{ position: "absolute", left: 390, top: 525, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 14, letterSpacing: "0.1em", color: "var(--ink-600)" }}>
        Все статьи <Arrow />
      </a>
      <div style={{ position: "absolute", left: 1416, top: 510, display: "flex", gap: 10 }}>
        <IconBadge variant="ring"><div style={{ transform: "rotate(180deg)" }}><Arrow /></div></IconBadge>
        <IconBadge variant="ring"><Arrow /></IconBadge>
      </div>
    </div>
  );
}
window.Blog = Blog;

```
