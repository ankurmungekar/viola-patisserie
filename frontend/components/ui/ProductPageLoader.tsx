interface ProductPageLoaderProps {
  variant?: "collection" | "product";
  compact?: boolean;
}

function Pulse({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded bg-viola-topbar ${className}`} />
  );
}

export function ProductPageLoader({
  variant = "collection",
  compact = false,
}: ProductPageLoaderProps) {
  const label =
    variant === "product" ? "Loading product" : "Loading collection";

  return (
    <div
      className={
        compact
          ? "w-full"
          : "mx-auto w-full max-w-[1440px] px-4 py-12 md:px-8 md:py-16 xl:px-[100px]"
      }
      aria-busy="true"
      aria-live="polite"
      aria-label={label}
    >
      <div className={`flex flex-col items-center justify-center gap-3 ${compact ? "mb-8" : "mb-10"}`}>
        <span className="product-loader-ring" aria-hidden="true" />
        <p className="font-display text-lg text-viola-primary">{label}…</p>
      </div>

      {variant === "product" ? (
        <div className="grid gap-10 lg:grid-cols-[540px_minmax(0,1fr)] lg:gap-x-[68px]">
          <Pulse className="aspect-square w-full" />
          <div>
            <Pulse className="h-4 w-40" />
            <Pulse className="mt-5 h-10 w-3/4" />
            <Pulse className="mt-4 h-6 w-28" />
            <Pulse className="mt-8 h-20 w-full" />
            <Pulse className="mt-8 h-12 w-full max-w-xs" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index}>
              <Pulse className="aspect-square w-full" />
              <Pulse className="mt-3 h-4 w-3/4" />
              <Pulse className="mt-2 h-4 w-1/3" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
