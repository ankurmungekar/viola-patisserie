import Link from "next/link";

export function AboutBreadcrumbs({ className = "" }: { className?: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-sm uppercase tracking-viola text-viola-text/70 ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <li>
          <Link href="/" className="hover:text-viola-primary">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-viola-text" aria-current="page">
          About Us
        </li>
      </ol>
    </nav>
  );
}
