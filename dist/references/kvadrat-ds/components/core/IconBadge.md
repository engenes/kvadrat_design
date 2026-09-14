# IconBadge

## Спецификация
Circular frame for a glyph or carousel arrow.

```jsx
<IconBadge variant="ring"><ArrowIcon/></IconBadge>
<IconBadge variant="glow" size={214}><HomeIcon/></IconBadge>
```

`ring` — 1px gray hairline, used for prev/next carousel controls. `ring-dark` — same on dark/photo backgrounds. `glow` — inset blue hairline plus a blue drop-shadow, used to frame the big stat icons in the mortgage section.


## Контракт пропсов (TypeScript)
```ts
import { ReactNode, CSSProperties } from "react";

export interface IconBadgeProps {
  children: ReactNode;
  size?: number;
  variant?: "ring" | "ring-dark" | "glow";
  style?: CSSProperties;
}

export function IconBadge(props: IconBadgeProps): JSX.Element;

```

## Референс-реализация (React/JSX — точные значения/структура; переносить логику на Vue SFC + Tailwind, не копировать файл как есть)
```jsx
import React from "react";

/**
 * Circular icon container. Two flavors seen in the source: a plain hairline
 * ring used for carousel prev/next arrows, and a glowing blue ring (inset
 * hairline + blue drop-shadow) used to frame stat icons in the mortgage/hero
 * section.
 */
export function IconBadge({ children, size = 50, variant = "ring", style, ...rest }) {
  const base = {
    width: size,
    height: size,
    borderRadius: "var(--radius-circle)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  const variants = {
    ring: { boxShadow: "inset 0 0 0 1px var(--ink-600)" },
    "ring-dark": { boxShadow: "inset 0 0 0 1px var(--border-on-dark)" },
    glow: {
      boxShadow: "inset 0 0.5px 0 0 var(--blue-500), var(--shadow-glow-blue)",
    },
  };

  return (
    <div style={{ ...base, ...variants[variant], ...style }} {...rest}>
      {children}
    </div>
  );
}

```
