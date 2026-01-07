export type IconName =
  | "calendar"
  | "crown"
  | "pin"
  | "users"
  | "bolt"
  | "spark"
  | "theme"
  | "effect"
  | "settings"
  | "preview";

export function Icon({ name }: { name: IconName }) {
  const common = { width: 16, height: 16, viewBox: "0 0 24 24" };

  switch (name) {
    case "calendar":
      return (
        <svg {...common} fill="none">
          <path
            d="M7 3v3M17 3v3M4 8h16M6 6h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "crown":
      return (
        <svg {...common} fill="none">
          <path
            d="M5 18h14M6 18l-1-9 5 4 2-7 2 7 5-4-1 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      );
    case "pin":
      return (
        <svg {...common} fill="none">
          <path
            d="M12 22s7-4.5 7-12a7 7 0 1 0-14 0c0 7.5 7 12 7 12Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 10.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      );
    case "users":
      return (
        <svg {...common} fill="none">
          <path
            d="M16 11a4 4 0 1 0-8 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M3 21a8.5 8.5 0 0 1 18 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common} fill="none">
          <path
            d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "spark":
      return (
        <svg {...common} fill="none">
          <path
            d="M12 2l1.2 5.2L18 9l-4.8 1.8L12 16l-1.2-5.2L6 9l4.8-1.8L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M5 14l.6 2.5L8 17l-2.4.5L5 20l-.6-2.5L2 17l2.4-.5L5 14Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "theme":
      return (
        <svg {...common} fill="none">
          <path
            d="M12 22a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 7a3 3 0 0 0 0 6h4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "effect":
      return (
        <svg {...common} fill="none">
          <path
            d="M12 2l2.2 6.2L21 10l-6.8 1.8L12 18l-2.2-6.2L3 10l6.8-1.8L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "settings":
      return (
        <svg {...common} fill="none">
          <path
            d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M19.4 15a7.9 7.9 0 0 0 .1-2l2-1.5-2-3.5-2.4.6a7.8 7.8 0 0 0-1.7-1l-.4-2.5h-4l-.4 2.5a7.8 7.8 0 0 0-1.7 1L4.5 8 2.5 11.5l2 1.5a7.9 7.9 0 0 0 .1 2l-2 1.5 2 3.5 2.4-.6c.5.4 1.1.7 1.7 1l.4 2.5h4l.4-2.5c.6-.3 1.2-.6 1.7-1l2.4.6 2-3.5-2-1.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "preview":
      return (
        <svg {...common} fill="none">
          <path
            d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      );
  }
}
