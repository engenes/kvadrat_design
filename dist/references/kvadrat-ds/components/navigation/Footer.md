# Footer

## Спецификация
Site-wide dark footer.

```jsx
<Footer
  columns={[
    { title: "Услуги", items: ["Помощь в получении ипотеки", "Ипотечный калькулятор"] },
    { title: "Объекты", items: ["Новостройки", "Квартиры", "Дома"] },
  ]}
  address='г. Астана, БЦ "Астана", 4 этаж'
  phones={["+7 (999) 777-33-50", "+7 (3444) 94-44-44"]}
/>
```

Repeats the header's contact block at the bottom — keep phone numbers identical to the `NavBar` instance on the same page.


## Контракт пропсов (TypeScript)
```ts
import { CSSProperties } from "react";

/**
 * @startingPoint section="Components" subtitle="Dark footer — logo, nav columns, contact block" viewport="1400x420"
 */
export interface FooterColumn {
  title: string;
  items: string[];
}
export interface FooterProps {
  columns?: FooterColumn[];
  address?: string;
  phones?: string[];
  style?: CSSProperties;
}

export function Footer(props: FooterProps): JSX.Element;

```

## Референс-реализация (React/JSX — точные значения/структура; переносить логику на Vue SFC + Tailwind, не копировать файл как есть)
```jsx
import React from "react";
import { Logo } from "../core/Logo.jsx";

/**
 * Dark footer with logo, 4 nav columns (Услуги/Объекты/Об агентстве + free
 * text), a divider, and repeated contact block. Decorative angular "Subtract"
 * shapes bleed off the right edge in the source — omitted here as a purely
 * decorative flourish, safe to add back with clip-path if desired.
 */
export function Footer({ columns = [], address, phones = [], style, ...rest }) {
  return (
    <footer style={{ background: "var(--surface-footer)", padding: "64px 48px 40px", ...style }} {...rest}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 48, flexWrap: "wrap" }}>
        <Logo variant="full" height={52} />
        {columns.map((col) => (
          <div key={col.title} style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 160 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-base)", color: "var(--surface-white)" }}>
              {col.title}
            </span>
            {col.items.map((item) => (
              <a key={item} href="#" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--ink-600)", textDecoration: "none" }}>
                {item}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,0.12)", margin: "40px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
        {address && (
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--surface-white)", maxWidth: 260 }}>
            {address}
          </span>
        )}
        <div style={{ display: "flex", gap: 24 }}>
          {phones.map((p) => (
            <span key={p} style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--weight-extrabold)", fontSize: "var(--text-2xl)", letterSpacing: "var(--tracking-normal)", color: "var(--surface-white)" }}>
              {p}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

```
