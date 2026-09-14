# Logo

## Спецификация
The brand mark, always white/blue, for dark surfaces only (header bar, footer).

```jsx
<Logo variant="full" height={56} />
<Logo variant="mark" height={32} />
```

This is real vector artwork extracted from the source file — never recreate the wordmark with a web font, it is custom lettering.


## Контракт пропсов (TypeScript)
```ts
import { CSSProperties } from "react";

export interface LogoProps {
  /** full = mark + wordmark + tagline; mark = icon only */
  variant?: "full" | "mark";
  height?: number;
  style?: CSSProperties;
}

export function Logo(props: LogoProps): JSX.Element;

```

## Референс-реализация (React/JSX — точные значения/структура; переносить логику на Vue SFC + Tailwind, не копировать файл как есть)
```jsx
import React from "react";

/**
 * The Kvadrat wordmark + mark, extracted verbatim from the source Figma file
 * (vectorized letterforms, not live text — do not attempt to recreate with a
 * web font). White/blue, designed for dark surfaces (header, footer).
 */
export function Logo({ variant = "full", height = 40, style, ...rest }) {
  const src = variant === "mark"
    ? "../../assets/logo/kvadrat-mark.svg"
    : "../../assets/logo/kvadrat-logo-full.svg";
  const ratio = variant === "mark" ? 88.918 / 82.412 : 190 / 99;
  return (
    <img
      src={src}
      alt="Квадрат — Агентство недвижимости"
      style={{ height, width: height * ratio, display: "block", ...style }}
      {...rest}
    />
  );
}

```
