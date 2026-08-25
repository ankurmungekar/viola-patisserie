import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders primary button text", () => {
    render(<Button>Explore Collections</Button>);
    expect(
      screen.getByRole("button", { name: "Explore Collections" }),
    ).toBeInTheDocument();
  });

  it("renders outline link variant", () => {
    render(
      <Button variant="outline" href="/collections">
        Explore All Collections
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Explore All Collections" })).toHaveAttribute(
      "href",
      "/collections",
    );
  });
});
