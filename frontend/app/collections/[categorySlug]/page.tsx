import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface CollectionPageProps {
  params: Promise<{ categorySlug: string }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { categorySlug } = await params;

  return (
    <Container className="py-16">
      <SectionHeading
        title={categorySlug.replace(/-/g, " ")}
        description="Collection page coming soon."
        align="left"
      />
    </Container>
  );
}
