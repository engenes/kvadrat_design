# Button

## Спецификация
The single pill-shaped button used everywhere in Kvadrat — CTAs, filters, carousel controls.

```jsx
<Button variant="primary">Оставить заявку</Button>
<Button variant="outline">Все объекты</Button>
<Button variant="outline-dark">Заказать консультацию</Button>
<Button variant="text">Все статьи →</Button>
```

Variants: `primary` (blue gradient, dark drop-shadow — main CTAs), `outline` (white fill, 1px gray hairline — secondary actions on light surfaces), `outline-dark` (transparent, white hairline — over photography/dark panels), `text` (underlined blue link, no padding — "see all" links). Sizes: `md` (50px tall, default), `sm` (40px tall).


## Контракт пропсов (TypeScript)
```ts
import { ReactNode, CSSProperties, MouseEventHandler } from "react";

export interface ButtonProps {
  children: ReactNode;
  /** primary = blue gradient pill; outline = white hairline pill; outline-dark = bordered pill for dark/photo backgrounds; text = underlined link-style */
  variant?: "primary" | "outline" | "outline-dark" | "text";
  size?: "md" | "sm";
  icon?: ReactNode;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;

```

## Референс-реализация (React/JSX — точные значения/структура; переносить логику на Vue SFC + Tailwind, не копировать файл как есть)
```jsx
import React from "react";

const SIZES = {
  md: { height: 50, paddingInline: 24, fontSize: "var(--text-xs)" },
  sm: { height: 40, paddingInline: 20, fontSize: "var(--text-xs)" },
};

/**
 * Kvadrat's single button shape: a fully-rounded pill. Primary is the brand
 * blue gradient with a soft dark drop-shadow (used on hero CTAs, card CTAs,
 * filter "apply" actions). Outline is a 1px hairline pill used for secondary
 * actions on white surfaces ("Все объекты", category filters). Ghost-on-dark
 * is a bordered pill for use over photography/dark panels (carousel arrows
 * use a circular version of the same style, see IconBadge).
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  icon = null,
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const dim = SIZES[size] || SIZES.md;

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: dim.height,
    paddingInline: dim.paddingInline,
    borderRadius: "var(--radius-pill)",
    fontFamily: "var(--font-sans)",
    fontWeight: "var(--weight-semibold)",
    fontSize: dim.fontSize,
    letterSpacing: "var(--tracking-tight)",
    lineHeight: "130%",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "filter 0.15s ease, transform 0.05s ease",
    whiteSpace: "nowrap",
  };

  const variants = {
    primary: {
      background: "linear-gradient(180deg, var(--blue-500) 0%, var(--blue-600) 100%)",
      color: "var(--surface-white)",
      boxShadow: "var(--shadow-button)",
    },
    outline: {
      background: "var(--surface-white)",
      color: "var(--neutral-900)",
      boxShadow: "inset 0 0 0 1px var(--border-subtle)",
    },
    "outline-dark": {
      background: "transparent",
      color: "var(--surface-white)",
      boxShadow: "inset 0 0 0 1px var(--border-on-dark)",
    },
    text: {
      background: "transparent",
      color: "var(--blue-500)",
      textDecoration: "underline",
      boxShadow: "none",
      paddingInline: 0,
      height: "auto",
    },
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.filter = "brightness(1.08)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

```
