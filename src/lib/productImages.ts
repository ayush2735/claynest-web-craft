import productCup from '@/assets/product-cup.jpg';
import productPlate from '@/assets/product-plate.jpg';
import productPot from '@/assets/product-pot.jpg';
import productBowl from '@/assets/product-bowl.jpg';
import productVase from '@/assets/product-vase.jpg';

const categoryImages: Record<string, string> = {
  cups: productCup,
  plates: productPlate,
  pots: productPot,
  bowls: productBowl,
  vases: productVase,
  other: productCup,
};

export const getProductImage = (category: string): string => {
  return categoryImages[category] || productCup;
};
