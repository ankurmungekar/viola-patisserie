import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductCard } from "@/components/home/ProductCard";

const product = {
  id: 1,
  name: "Classic chocolate truffle cake",
  slug: "classic-chocolate-truffle-cake",
  description: "Rich chocolate cake",
  price: 1899,
  priceHtml: "₹ 1,899",
  image: {
    src: "/images/placeholders/product.svg",
    alt: "Classic chocolate truffle cake",
  },
  permalink: "/cakes/classic-chocolate-truffle-cake",
};

describe("ProductCard", () => {
  it("renders product name and price", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText("Classic chocolate truffle cake")).toBeInTheDocument();
    expect(screen.getByText("₹ 1,899")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Add to cart" })).toBeInTheDocument();
  });
});
