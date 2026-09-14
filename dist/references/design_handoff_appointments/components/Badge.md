# Badge

## Спецификация
Small pill tag for filter chips, category labels and status flags.

```jsx
<Badge>Коммерческая недвижимость</Badge>
<Badge variant="solid" tone="blue">Сдан</Badge>
```

`outline` (white + 1px hairline) is the default — used for filters and category quick-links. `solid tone="blue"` is a filled gradient chip for status flags over imagery.


## Контракт пропсов (TypeScript)
```ts
import { ReactNode, CSSProperties } from "react";

export interface BadgeProps {
  children: ReactNode;
  variant?: "outline" | "solid";
  tone?: "neutral" | "blue";
  style?: CSSProperties;
}

export function Badge(props: BadgeProps): JSX.Element;

```

## Референс-реализация (React/JSX — точные значения/структура; переносить логику на Vue SFC + Tailwind, не копировать файл как есть)
```jsx
import React from "react";

/**
 * Small pill label. `outline` is the neutral filter/category chip seen across
 * the catalog and category quick-links ("Коммерческая недвижимость", "Только
 * акции"). `solid` is used sparingly for status labels on imagery.
 */
export function Badge({ children, variant = "outline", tone = "neutral", style, ...rest }) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: 23,
    paddingInline: 14,
    borderRadius: "var(--radius-pill)",
    fontFamily: "var(--font-sans)",
    fontWeight: "var(--weight-semibold)",
    fontSize: "var(--text-base)",
    letterSpacing: "var(--tracking-tight)",
    lineHeight: "130%",
    whiteSpace: "nowrap",
  };

  const tones = {
    neutral: { color: "var(--neutral-900)" },
    blue: { color: "var(--surface-white)" },
  };

  const variants = {
    outline: {
      background: "var(--surface-white)",
      boxShadow: "inset 0 0 0 1px var(--border-subtle)",
    },
    solid: {
      background: "linear-gradient(180deg, var(--blue-500) 0%, var(--blue-600) 100%)",
    },
  };

  return (
    <span style={{ ...base, ...tones[tone], ...variants[variant], ...style }} {...rest}>
      {children}
    </span>
  );
}

```
