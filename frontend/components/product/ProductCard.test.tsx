import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductCard } from "@/components/product/ProductCard";

const product = {
  id: 1,
  name: "Classic chocolate truffle cake",
  slug: "classic-chocolate-truffle-cake",
  description: "Rich chocolate cake",
  price: 1899,
  priceHtml: "₹ 1899",
  image: {
    src: "/images/bestseller-1.jpg",
    alt: "Classic chocolate truffle cake",
  },
  permalink: "/cakes/classic-chocolate-truffle-cake",
};

describe("ProductCard", () => {
  it("renders product name and price", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText("Classic chocolate truffle cake")).toBeInTheDocument();
    expect(screen.getByText("₹ 1899")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Add to cart" })).toBeInTheDocument();
  });
});
