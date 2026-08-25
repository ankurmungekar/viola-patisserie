import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function CollectionsIndexPage() {
  return (
    <Container className="py-16">
      <SectionHeading
        title="Signature Collections"
        description="Browse all Viola Patisserie collections."
        align="left"
      />
    </Container>
  );
}
