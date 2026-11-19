import type { ProductColor } from "@/lib/types";

// Colour names shoppers use here. The colour filter groups products by these names.
export const colors = {
  maroon: { name: "Maroon", hex: "#650D19" },
  wine: { name: "Wine", hex: "#722F37" },
  raniPink: { name: "Rani Pink", hex: "#C8155F" },
  blushPink: { name: "Blush Pink", hex: "#E8A5B0" },
  peach: { name: "Peach", hex: "#F2B38D" },
  coral: { name: "Coral", hex: "#E26A55" },
  rust: { name: "Rust", hex: "#A9502A" },
  mustard: { name: "Mustard", hex: "#C99124" },
  haldi: { name: "Haldi Yellow", hex: "#E5AF1E" },
  gold: { name: "Gold", hex: "#D4A64A" },
  ivory: { name: "Ivory", hex: "#F3ECDC" },
  mint: { name: "Mint", hex: "#A8D5BA" },
  mehendi: { name: "Mehendi Green", hex: "#6F7F33" },
  bottleGreen: { name: "Bottle Green", hex: "#1F4D3A" },
  teal: { name: "Teal", hex: "#1F6F78" },
  powderBlue: { name: "Powder Blue", hex: "#A9C4DE" },
  indigo: { name: "Indigo", hex: "#2E3A6E" },
  lavender: { name: "Lavender", hex: "#B9A6D3" },
  black: { name: "Black", hex: "#1E1B1B" },
} satisfies Record<string, ProductColor>;
