# ServiceCard

## Спецификация
Service offering tile for the "Услуги агентства" grid.

```jsx
<ServiceCard title="Продажа недвижимости" image="/assets/images/listing-thumb-1.png" />
```

Lay 5-6 of these out in a 3-column grid with `gap: 24px`. The corner graphic is optional — omit for icon-only tiles (mortgage programs section uses plain dark variants, see readme Visual Foundations).


## Контракт пропсов (TypeScript)
```ts
import { CSSProperties } from "react";

export interface ServiceCardProps {
  title: string;
  description?: string;
  image?: string;
  style?: CSSProperties;
}

export function ServiceCard(props: ServiceCardProps): JSX.Element;

```

## Референс-реализация (React/JSX — точные значения/структура; переносить логику на Vue SFC + Tailwind, не копировать файл как есть)
```jsx
import React from "react";

/**
 * Service tile — used for the "Услуги агентства" 2x3 grid (Продажа, Покупка,
 * Аренда, Оценка, Юр. сопровождение...). Light blue-wash background with a
 * small illustrative photo/graphic anchored to one corner.
 */
export function ServiceCard({ title, description, image, style, ...rest }) {
  return (
    <div
      style={{
        position: "relative",
        width: 270,
        height: 214,
        background: "var(--surface-wash)",
        overflow: "hidden",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        ...style,
      }}
      {...rest}
    >
      <span style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--weight-bold)", fontSize: "var(--text-lg)", color: "var(--ink-900)", lineHeight: 1.2, maxWidth: "60%" }}>
        {title}
      </span>
      {description && (
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--ink-600)", maxWidth: "60%" }}>
          {description}
        </span>
      )}
      {image && (
        <img
          src={image}
          alt=""
          style={{ position: "absolute", right: 0, bottom: 0, width: "48%", height: "60%", objectFit: "cover" }}
        />
      )}
    </div>
  );
}

```
