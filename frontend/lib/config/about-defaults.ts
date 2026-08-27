import type { AboutContent } from "@/types/about";

export const aboutDefaults: AboutContent = {
  story: {
    eyebrow: "our Story",
    titleLine1: "A Story of Passion,",
    titleAccent: "Craftsmanship & Sweet Memories",
    paragraphs: [
      "Founded in 2021, Viola Patisserie was born from a passion for creating desserts that bring joy, spark connection, and turn everyday moments into lasting memories. What began as a love for baking has grown into a destination for handcrafted cakes and desserts that celebrate both exceptional flavour and thoughtful design.",
      "At the heart of everything we create is a commitment to craftsmanship. Every dessert is made in small batches using carefully selected ingredients, time-honoured baking techniques, and meticulous attention to detail.",
    ],
    image: {
      src: "/images/about-us.jpg",
      alt: "Chef decorating a celebration cake at Viola Patisserie",
    },
  },
  highlight: {
    paragraphs: [
      "Our style blends artisanal baking with modern elegance, resulting in creations that feel timeless yet contemporary. Whether it's a bespoke celebration cake, a box of delicate pastries, or a dessert shared over coffee, every piece is crafted with the same care and dedication.",
      "Since opening our doors, we've had the privilege of delivering over 6,000 orders, becoming a part of birthdays, weddings, anniversaries, festive celebrations, and countless everyday indulgences. Every order is a reminder of the trust our customers place in us, and it inspires us to continue creating desserts that make every occasion a little more special.",
    ],
    statValue: "6,000+",
    statLabel: "Orders Delivered",
    image: {
      src: "/images/order-delivered.jpg",
      alt: "Gift-boxed cakes from Viola Patisserie",
    },
  },
  founder: {
    eyebrow: "Meet the founder",
    titleLine1: "The Heart",
    titleAccent: "Behind Viola",
    paragraphs: [
      "Not every engineer ends up covered in flour—but that's exactly how Chef Aishwarya found her calling.",
      "After graduating in engineering, she chose to follow her passion for pastry and trained at the Academy of Pastry Arts, where she discovered that creating desserts brought her far more joy than solving equations. What followed were over three years of hands-on experience at some of Mumbai's renowned hotels and patisseries, refining her craft and learning from some of the industry's best.",
      "In 2021, she turned that dream into Viola Patisserie, a space where classic techniques meet modern creativity, and every dessert is made with intention. From developing new flavours to perfecting the tiniest finishing touches, she's involved in every step of the process, ensuring each creation reflects the quality and care that define the brand. Through Viola Patisserie, she hopes to create desserts that become a part of family traditions, heartfelt celebrations, and memories that people look back on with a smile.",
    ],
    signature: "Aishwarya Sinkar",
    signatureTitle: "Founder & Pastry Chef",
    image: {
      src: "/images/about-viola.jpg",
      alt: "Aishwarya Sinkar, Founder & Pastry Chef",
    },
  },
};
