# FooterSection — секция главной страницы (React-референс)

Точная структура/копирайт/токены. Переносить как отдельный Vue-компонент `FooterSection.vue`, не копировать JSX напрямую.

```jsx
function FooterSection() {
  const { Footer } = window.DesignSystem_16ec3d;
  return (
    <div style={{ position: "relative", width: 1920 }}>
      <Footer
        columns={[
          { title: "Услуги", items: ["Помощь в получении ипотеки", "Ипотечный калькулятор", "Ипотека без первого взноса", "Рефинансирование ипотеки", "Материнский капитал", "Военная ипотека"] },
          { title: "Объекты", items: ["Новостройки", "Квартиры", "Комнаты", "Дома", "Коммерческая недвижимость", "Земельные участки"] },
          { title: "Об агентстве", items: ["Наша команда", "Новости", "Блог", "Контакты"] },
        ]}
        address='г. Астана, БЦ "Астана", 4 этаж (Астанинская, 3/1; Северная 15/1)'
        phones={["+7 (999) 777-33-50", "+7 (3444) 94-44-44"]}
      />
      <div style={{ background: "rgb(41,47,49)", padding: "16px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--ink-600)" }}>© 2018 Все права защищены</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--surface-white)" }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--success-500)" }} />
          Сейчас открыты
        </span>
      </div>
    </div>
  );
}
window.FooterSection = FooterSection;

```
