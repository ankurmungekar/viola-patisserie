import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;

  return (
    <Container className="py-16">
      <SectionHeading
        title={slug.replace(/-/g, " ")}
        description="Collection page coming soon."
        align="left"
      />
    </Container>
  );
}
