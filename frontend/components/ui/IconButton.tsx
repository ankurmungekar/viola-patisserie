import type { ReactNode } from "react";

interface IconButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  children: ReactNode;
}

export function IconButton({ label, href, onClick, children }: IconButtonProps) {
  const className =
    "inline-flex h-6 w-6 items-center justify-center text-viola-text transition-colors hover:text-viola-primary";

  if (href) {
    return (
      <a href={href} aria-label={label} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}
