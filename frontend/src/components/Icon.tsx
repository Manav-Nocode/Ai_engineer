type IconProps = {
  className?: string;
  name:
    | "agent"
    | "all"
    | "arrow"
    | "attach"
    | "browser"
    | "chevron"
    | "code"
    | "gear"
    | "github"
    | "grid"
    | "mail"
    | "menu"
    | "minus"
    | "more"
    | "plus"
    | "progress"
    | "search"
    | "send"
    | "shell"
    | "spark";
};

const paths: Record<IconProps["name"], string> = {
  agent: "M12 3v3m0 12v3M5.64 5.64l2.12 2.12m8.48 8.48 2.12 2.12M3 12h3m12 0h3M5.64 18.36l2.12-2.12m8.48-8.48 2.12-2.12",
  all: "M4 6h16M4 12h16M4 18h16",
  arrow: "M9 18l6-6-6-6",
  attach: "M21.44 11.05l-8.49 8.49a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 1 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48",
  browser: "M4 5h16v14H4zM4 9h16",
  chevron: "M6 9l6 6 6-6",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  gear: "M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5ZM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8.6 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 8.6a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15.4 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.37.2.78.3 1.2.29H21a2 2 0 1 1 0 4h-.09c-.42-.01-.83.09-1.2.29Z",
  github: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  mail: "M4 4h16v16H4zM22 6l-10 7L2 6",
  menu: "M4 7h16M4 12h16M4 17h16",
  minus: "M5 12h14",
  more: "M12 12h.01M19 12h.01M5 12h.01",
  plus: "M12 5v14M5 12h14",
  progress: "M4 19V5m0 14h16M8 17v-5m4 5V7m4 10v-8",
  search: "M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z",
  send: "M5 12h14M13 5l7 7-7 7",
  shell: "M4 17l6-5-6-5M12 19h8",
  spark: "M13 2l1.8 5.2L20 9l-5.2 1.8L13 16l-1.8-5.2L6 9l5.2-1.8L13 2ZM5 14l.9 2.6L8.5 18l-2.6.9L5 21.5l-.9-2.6L1.5 18l2.6-.9L5 14Z",
};

export function Icon({ className = "h-4 w-4", name }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d={paths[name]} />
    </svg>
  );
}
