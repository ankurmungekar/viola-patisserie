import { Container } from "@/components/layout/Container";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-viola-topbar ${className}`}
      aria-hidden="true"
    />
  );
}

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading homepage">
      <SkeletonBlock className="h-[420px] w-full md:h-[560px]" />
      <Container className="py-16">
        <SkeletonBlock className="mx-auto h-6 w-48" />
        <SkeletonBlock className="mx-auto mt-4 h-12 w-80" />
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonBlock key={index} className="aspect-[190/289] w-full" />
          ))}
        </div>
      </Container>
    </div>
  );
}
