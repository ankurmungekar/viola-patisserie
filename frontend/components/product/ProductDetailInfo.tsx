import type { ProductDetail } from "@/types/product";

type ProductDetailField = "allergens" | "consumption" | "storageInfo";

interface ProductDetailInfoProps {
  product: ProductDetail;
  fields: ProductDetailField[];
  className?: string;
}

const FIELD_LABELS: Record<ProductDetailField, string> = {
  allergens: "Allergens",
  consumption: "Consumption",
  storageInfo: "Storage Info",
};

function InfoBlock({ label, value }: { label: string; value: string }) {
  const text = value.trim();
  if (!text) {
    return null;
  }

  return (
    <div>
      <p className="text-sm uppercase tracking-viola text-viola-accent">{label}</p>
      <p className="mt-3 whitespace-pre-line text-base leading-5 tracking-viola-wide text-viola-text">
        {text}
      </p>
    </div>
  );
}

export function ProductDetailInfo({
  product,
  fields,
  className = "",
}: ProductDetailInfoProps) {
  const blocks = fields
    .map((field) => (
      <InfoBlock
        key={field}
        label={FIELD_LABELS[field]}
        value={product[field]}
      />
    ))
    .filter(Boolean);

  if (blocks.length === 0) {
    return null;
  }

  return <div className={`space-y-6 ${className}`}>{blocks}</div>;
}
