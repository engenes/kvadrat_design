# ArticleCard

## Спецификация
Editorial card for blog posts, news items, and promotions.

```jsx
<ArticleCard
  image="/assets/images/news-thumb-1.jpg"
  category="Застройщики"
  title="Тестовый заголовок новости для примера"
  meta="21 ноября 2018"
/>
```

The category label is always uppercase brand-blue with wide tracking. `elevation="featured"` gives the stronger drop-shadow used on the leftmost card in a row.


## Контракт пропсов (TypeScript)
```ts
import { CSSProperties } from "react";

export interface ArticleCardProps {
  image: string;
  category: string;
  title: string;
  meta?: string;
  elevation?: "resting" | "featured";
  style?: CSSProperties;
}

export function ArticleCard(props: ArticleCardProps): JSX.Element;

```

## Референс-реализация (React/JSX — точные значения/структура; переносить логику на Vue SFC + Tailwind, не копировать файл как есть)
```jsx
import React from "react";

/**
 * Blog/news/promo card — square photo, category label, headline, byline.
 * Used for "Наш блог", "Новости" and "Только акции" sections.
 */
export function ArticleCard({ image, category, title, meta, elevation = "resting", style, ...rest }) {
  const shadow = {
    resting: "var(--shadow-card-resting)",
    featured: "var(--shadow-card-featured)",
  }[elevation];

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        width: 564,
        background: "var(--surface-white)",
        boxShadow: shadow,
        padding: 24,
        alignItems: "flex-start",
        ...style,
      }}
      {...rest}
    >
      <img src={image} alt={title} style={{ width: 231, height: 231, objectFit: "cover", flexShrink: 0 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 8 }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", letterSpacing: "var(--tracking-wide)", color: "var(--blue-500)", textTransform: "uppercase" }}>
          {category}
        </span>
        <span style={{ fontFamily: "var(--font-sans)", fontWeight: "var(--weight-bold)", fontSize: "var(--text-lg)", color: "var(--ink-900)", lineHeight: 1.3 }}>
          {title}
        </span>
        {meta && (
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--ink-600)" }}>{meta}</span>
        )}
      </div>
    </div>
  );
}

```
