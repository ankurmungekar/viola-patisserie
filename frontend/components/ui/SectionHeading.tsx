interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-3xl ${alignment} ${className}`}>
      {eyebrow ? (
        <p className="mb-3 text-sm uppercase tracking-viola text-viola-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-4xl font-semibold leading-tight text-viola-text md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-5 tracking-viola-wide text-viola-text">
          {description}
        </p>
      ) : null}
    </div>
  );
}
