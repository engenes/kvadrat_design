# NavBar

## Спецификация
The site header — always dark, sits over the hero photo with a gradient scrim beneath it.

```jsx
<NavBar
  address='г. Астана, БЦ "Астана", 4 этаж'
  phones={[{ number: "+7 (999) 777-33-50" }, { number: "+7 (3444) 94-44-44", label: "Заказать звонок" }]}
/>
```

The "currently open" green-dot status and dual phone numbers (office + mobile/Viber) are core to the brand's "always reachable" positioning — keep both on every page.


## Контракт пропсов (TypeScript)
```ts
import { CSSProperties } from "react";

/**
 * @startingPoint section="Components" subtitle="Dark header — logo, nav links, status, phones" viewport="1400x180"
 */
export interface Phone {
  number: string;
  label?: string;
}
export interface NavBarProps {
  links?: string[];
  address?: string;
  phones?: Phone[];
  open?: boolean;
  style?: CSSProperties;
}

export function NavBar(props: NavBarProps): JSX.Element;

```

## Референс-реализация (React/JSX — точные значения/структура; переносить логику на Vue SFC + Tailwind, не копировать файл как есть)
```jsx
import React from "react";
import { Logo } from "../core/Logo.jsx";

/**
 * Two-row dark header: thin top strip is intentionally blank/black in the
 * source; the main bar carries logo, primary nav, "currently open" status,
 * address, and two click-to-call phone numbers.
 */
export function NavBar({
  links = ["Услуги", "Недвижимость", "Спецпредложения", "Цены", "Отзывы", "Контакты"],
  address,
  phones = [],
  open = true,
  style,
  ...rest
}) {
  return (
    <header style={{ background: "var(--surface-header)", ...style }} {...rest}>
      <div style={{ height: 45, background: "var(--neutral-950)" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 48px", gap: 32 }}>
        <Logo variant="full" height={52} />
        <nav style={{ display: "flex", gap: 28 }}>
          {links.map((l) => (
            <a key={l} href="#" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", letterSpacing: "var(--tracking-tight)", color: "var(--surface-white)", textDecoration: "none" }}>
              {l}
            </a>
          ))}
        </nav>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          {open && (
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--surface-white)" }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--success-500)" }} />
              Сейчас открыты
            </span>
          )}
          {address && (
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--surface-white)", textAlign: "right", maxWidth: 260 }}>
              {address}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {phones.map((p) => (
            <div key={p.number} style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--weight-extrabold)", fontSize: "var(--text-2xl)", letterSpacing: "var(--tracking-normal)", color: "var(--surface-white)", whiteSpace: "nowrap" }}>
                {p.number}
              </span>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-base)", color: p.label ? "var(--ink-100-on-dark)" : "var(--blue-500)", textDecoration: p.label ? "none" : "underline", whiteSpace: "nowrap" }}>
                {p.label ?? "Заказать звонок"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

```
