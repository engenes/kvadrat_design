# PropertyCard

## Спецификация
The catalog's core unit — a real-estate listing card.

```jsx
<PropertyCard
  image="/assets/images/listing-thumb-1.png"
  title="3-комнатная квартира"
  address="ул. Революционная, 34"
  area="86 м²"
  floor="6/10"
  price="4 650 000 руб"
  status="Сдан"
/>
```

Cards are always laid out in a horizontal row/carousel, never a grid — pair with `IconBadge variant="ring"` prev/next arrows. `elevation` controls shadow intensity: use `featured` for the first/hero card in a row.


## Контракт пропсов (TypeScript)
```ts
import { CSSProperties } from "react";

export interface PropertyCardProps {
  image: string;
  title: string;
  address: string;
  area?: string;
  floor?: string;
  price: string;
  status?: string;
  elevation?: "resting" | "raised" | "featured";
  style?: CSSProperties;
}

export function PropertyCard(props: PropertyCardProps): JSX.Element;

```

## Референс-реализация (React/JSX — точные значения/структура; переносить логику на Vue SFC + Tailwind, не копировать файл как есть)
```jsx
import React from "react";
import { Badge } from "../core/Badge.jsx";

/**
 * Real-estate listing card — the core catalog unit. Photo on top, address +
 * price + specs beneath, white card on a brand-blue-tinted shadow.
 */
export function PropertyCard({
  image,
  title,
  address,
  area,
  floor,
  price,
  status,
  elevation = "resting",
  style,
  ...rest
}) {
  const shadow = {
    resting: "var(--shadow-card-resting)",
    raised: "var(--shadow-card-raised)",
    featured: "var(--shadow-card-featured)",
  }[elevation];

  return (
    <div
      style={{
        width: 270,
        background: "var(--surface-white)",
        boxShadow: shadow,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
      {...rest}
    >
      <div style={{ position: "relative", width: "100%", height: 169 }}>
        <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {status && (
          <Badge variant="solid" tone="blue" style={{ position: "absolute", top: 12, left: 12 }}>
            {status}
          </Badge>
        )}
      </div>
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-base)", color: "var(--ink-900)" }}>
          {title}
        </span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--ink-600)" }}>
          {address}
        </span>
        <div style={{ display: "flex", gap: 14, fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--ink-400)" }}>
          <span>{area}</span>
          <span>{floor}</span>
        </div>
        <span style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--weight-bold)", fontSize: "var(--text-lg)", color: "var(--ink-900)", marginTop: 4 }}>
          {price}
        </span>
      </div>
    </div>
  );
}

```
