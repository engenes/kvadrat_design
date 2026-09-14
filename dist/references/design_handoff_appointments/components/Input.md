# Input

## Спецификация
Pill-shaped text field.

```jsx
<Input placeholder="Город, район, ЖК..." />
```

Always full pill radius, white fill, 1px gray hairline border — no focus-color change in the source design.


## Контракт пропсов (TypeScript)
```ts
import { ReactNode, ChangeEventHandler, CSSProperties } from "react";

export interface InputProps {
  placeholder?: string;
  icon?: ReactNode;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  style?: CSSProperties;
}

export function Input(props: InputProps): JSX.Element;

```

## Референс-реализация (React/JSX — точные значения/структура; переносить логику на Vue SFC + Tailwind, не копировать файл как есть)
```jsx
import React from "react";

/**
 * Pill text input, always white with a 1px hairline (no fill-focus glow in
 * source). Used inside the "Найдем объект по вашим пожеланиям" filter bar.
 */
export function Input({ placeholder, icon = null, value, onChange, style, ...rest }) {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        height: 60,
        paddingInline: 24,
        borderRadius: "var(--radius-pill)",
        background: "var(--surface-white)",
        boxShadow: "inset 0 0 0 1px var(--border-subtle)",
        ...style,
      }}
    >
      {icon}
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-base)",
          color: "var(--neutral-900)",
          width: "100%",
        }}
        {...rest}
      />
    </label>
  );
}

```
