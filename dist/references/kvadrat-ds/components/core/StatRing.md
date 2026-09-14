# StatRing

## Спецификация
Circular glowing stat callout — used for rate/price highlights over the hero photo.

```jsx
<StatRing value="8,4" unit="%" size={214} />
<StatRing value="650" unit=" тыс. руб." size={102} />
```

Always rendered on a dark/photo background; the ring color and orbit dot are always brand blue.


## Контракт пропсов (TypeScript)
```ts
import { CSSProperties } from "react";

export interface StatRingProps {
  value: string;
  unit?: string;
  size?: number;
  strokeWidth?: number;
  style?: CSSProperties;
}

export function StatRing(props: StatRingProps): JSX.Element;

```

## Референс-реализация (React/JSX — точные значения/структура; переносить логику на Vue SFC + Tailwind, не копировать файл как есть)
```jsx
import React from "react";

/**
 * Circular percentage/progress ring used for the "8,4%" mortgage-rate and
 * "650 тыс. руб" stat callouts. A thin colored dot orbits the ring to imply
 * progress; the numeric value sits inside.
 */
export function StatRing({ value, unit, size = 102, strokeWidth = 1, style, ...rest }) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        boxShadow: `inset 0 0 0 ${strokeWidth}px var(--blue-500), var(--shadow-glow-blue)`,
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          position: "absolute",
          top: -2,
          right: size * 0.32,
          width: size * 0.098,
          height: size * 0.098,
          borderRadius: "50%",
          background: "var(--blue-500)",
          boxShadow: "var(--shadow-glow-blue)",
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: "var(--weight-bold)",
          fontSize: size * 0.22,
          color: "var(--surface-white)",
          lineHeight: 1,
        }}
      >
        {value}
        <span style={{ fontSize: size * 0.14, fontWeight: "var(--weight-regular)" }}>{unit}</span>
      </span>
    </div>
  );
}

```
