# Select

## Спецификация
Pill dropdown used to chain search filters (deal type, property type, rooms, price).

```jsx
<Select label="Купить" options={["Купить", "Снять"]} />
```

Chain 4-5 of these plus an `Input` and a circular primary `Button` (search icon) inside one long pill container for the property-finder bar.


## Контракт пропсов (TypeScript)
```ts
import { ChangeEventHandler, CSSProperties } from "react";

export interface SelectProps {
  label: string;
  options?: string[];
  value?: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  style?: CSSProperties;
}

export function Select(props: SelectProps): JSX.Element;

```

## Референс-реализация (React/JSX — точные значения/структура; переносить логику на Vue SFC + Tailwind, не копировать файл как есть)
```jsx
import React from "react";

/**
 * Pill dropdown/filter select — same shell as Input but with a chevron.
 * Used for "Купить / Снять", property type, rooms, price filters.
 */
export function Select({ label, options = [], value, onChange, style, ...rest }) {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        height: 60,
        paddingInline: 24,
        borderRadius: "var(--radius-pill)",
        background: "var(--surface-white)",
        boxShadow: "inset 0 0 0 1px var(--border-subtle)",
        cursor: "pointer",
        ...style,
      }}
    >
      <select
        value={value}
        onChange={onChange}
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          appearance: "none",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-base)",
          color: "var(--neutral-900)",
          width: "100%",
        }}
        {...rest}
      >
        {!value && <option value="">{label}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ flexShrink: 0 }}>
        <path d="M1 1L5 5L9 1" stroke="var(--ink-600)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}

```
