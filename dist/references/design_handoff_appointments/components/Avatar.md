# Avatar

## Спецификация
Realtor/agent headshot with the brand's signature glow + shield clip.

```jsx
<Avatar src="/assets/images/avatar-photo-1.png" size={80} />
```

Always pair with a name + role caption beneath it (see the "Лучший риэлтор" cards in the homepage UI kit).


## Контракт пропсов (TypeScript)
```ts
import { CSSProperties } from "react";

export interface AvatarProps {
  src: string;
  alt?: string;
  size?: number;
  style?: CSSProperties;
}

export function Avatar(props: AvatarProps): JSX.Element;

```

## Референс-реализация (React/JSX — точные значения/структура; переносить логику на Vue SFC + Tailwind, не копировать файл как есть)
```jsx
import React from "react";

/**
 * Realtor headshot treatment: a circular white backdrop with a strong blue
 * glow shadow, with the photo itself clipped to a rounded-bottom "shield"
 * shape (a circle whose top is squared off) rather than a plain circle.
 * Seen on "лучший риэлтор месяца/недели" cards.
 */
export function Avatar({ src, alt = "", size = 80, style, ...rest }) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size * 1.09,
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          top: size * 0.09,
          borderRadius: "50%",
          background: "var(--surface-white)",
          boxShadow: "var(--shadow-avatar)",
        }}
      />
      <img
        src={src}
        alt={alt}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          clipPath: "path('M 0 38 C 0.2 62 18 79 40 79 C 62 79 79.8 62 80 38 L 80 0 L 0 0 Z')",
        }}
      />
    </div>
  );
}

```
