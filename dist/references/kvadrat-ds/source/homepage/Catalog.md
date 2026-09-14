# Catalog — секция главной страницы (React-референс)

Точная структура/копирайт/токены. Переносить как отдельный Vue-компонент `Catalog.vue`, не копировать JSX напрямую.

```jsx
function Catalog() {
  const { PropertyCard, Badge, IconBadge } = window.DesignSystem_16ec3d;
  const chips = ["Новостройки", "Квартиры", "Комнаты", "Дома", "Коммерческая недвижимость", "Земельные участки", "Гаражи"];
  const listings = [
    { image: "../../assets/images/fig/a9ab1ca827388d01.png", title: "1-комнатная квартира", address: "ул. Тюльпанов, 34", area: "36 м²", floor: "2/10", price: "2 650 000 руб" },
    { image: "../../assets/images/fig/16018cf6e66fdbb9.png", title: "3-комнатная квартира", address: "ул. Револционная, 34", area: "86 м²", floor: "6/10", price: "4 650 000 руб", status: "Сдан" },
    { image: "../../assets/images/newbuild-4.png", title: "1-комнатная квартира", address: "ул. Казахстанская, 34", area: "36 м²", floor: "2/10", price: "2 650 000 руб" },
    { image: "../../assets/images/newbuild-5.png", title: "3-комнатная квартира", address: "ул. Пролетарская, 34", area: "86 м²", floor: "6/10", price: "4 650 000 руб", status: "Сдан" },
  ];
  const Arrow = () => (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="var(--ink-600)"><path d="M9.433 0.15c-.197-.2-.508-.2-.705 0-.19.194-.19.517 0 .71l3.577 3.634H.31C.035 4.494 0 4.717 0 4.996c0 .28.035.509.31.509h11.995L8.728 9.14c-.19.2-.19.523 0 .71.197.2.508.2.705 0l4.424-4.495c.19-.194.19-.516 0-.71L9.433.15Z" /></svg>
  );
  return (
    <div style={{ position: "relative", width: 1920, height: 640, background: "var(--surface-white)" }}>
      <p style={{ position: "absolute", left: 390, top: 0, margin: 0, fontFamily: "var(--font-sans)", fontSize: 14, letterSpacing: "0.2em", color: "var(--blue-500)", textTransform: "uppercase" }}>Большая база</p>
      <h2 style={{ position: "absolute", left: 390, top: 34, margin: 0, width: 400, fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 36, letterSpacing: "0.05em", lineHeight: 0.9, color: "var(--ink-900)" }}>Каталог недвижимости</h2>

      <div style={{ position: "absolute", left: 780, top: 8, width: 750, display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
        {chips.map((c, i) => (
          <Badge key={c} variant={i === 0 ? "solid" : "outline"} tone={i === 0 ? "blue" : "neutral"}>{c}</Badge>
        ))}
      </div>

      <div style={{ position: "absolute", left: 390, top: 130, display: "flex", gap: 21 }}>
        {listings.map((l) => <PropertyCard key={l.address} {...l} />)}
      </div>

      <a href="#" style={{ position: "absolute", left: 390, top: 500, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 14, letterSpacing: "0.1em", color: "var(--ink-600)" }}>
        Все объекты <Arrow />
      </a>
      <div style={{ position: "absolute", left: 1416, top: 484, display: "flex", gap: 10 }}>
        <IconBadge variant="ring"><div style={{ transform: "rotate(180deg)" }}><Arrow /></div></IconBadge>
        <IconBadge variant="ring"><Arrow /></IconBadge>
      </div>
    </div>
  );
}
window.Catalog = Catalog;

```
