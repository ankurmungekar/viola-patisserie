import { DEFAULT_STORAGE_INSTRUCTIONS } from "@/lib/config/product-defaults";

interface StorageInstructionsProps {
  instructions?: string;
}

export function StorageInstructions({
  instructions = DEFAULT_STORAGE_INSTRUCTIONS,
}: StorageInstructionsProps) {
  const text = instructions.trim() || DEFAULT_STORAGE_INSTRUCTIONS;

  return (
    <div className="mt-8 border-t border-viola-border pt-6">
      <h3 className="text-sm uppercase tracking-viola text-viola-accent">
        Consumption and Storage
      </h3>
      <p className="mt-3 whitespace-pre-line text-base leading-5 tracking-viola-wide text-viola-text">
        {text}
      </p>
    </div>
  );
}
