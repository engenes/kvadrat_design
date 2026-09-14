# App — секция главной страницы (React-референс)

Точная структура/копирайт/токены. Переносить как отдельный Vue-компонент `App.vue`, не копировать JSX напрямую.

```jsx
function App() {
  return (
    <div style={{ position: "relative", width: 1920, background: "var(--surface-white)" }}>
      <Hero />
      <Services />
      <Mortgage />
      <Promo />
      <Catalog />
      <SearchPanel />
      <TeamBio />
      <LoremSection />
      <CTA />
      <News />
      <Blog />
      <FooterSection />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);

```
