interface CollectionTitleProps {
  categoryName?: string | null;
  className?: string;
}

export function CollectionTitle({
  categoryName,
  className = "",
}: CollectionTitleProps) {
  const prefix = categoryName ?? "All";

  return (
    <h1
      className={`font-display text-4xl font-semibold leading-tight text-viola-text md:text-5xl ${className}`}
    >
      <span>{prefix} </span>
      <span className="text-viola-accent">
        Signature Collection
      </span>
    </h1>
  );
}
