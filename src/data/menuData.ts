export const categories = [
  { key: "combos", label: "Combos", icon: "🍱" },
  { key: "clasicos", label: "Clásicos", icon: "🍣" },
  { key: "veggie", label: "Veggie", icon: "🥬" },
  { key: "bebidas", label: "Bebidas", icon: "🥤" }
];

export interface Product {
  id: number;
  category: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export const products: Product[] = [
  // Combos
  {
    id: 1,
    category: "combos",
    name: "Combo 20 piezas",
    description: "10 nigiris variados y 10 rolls surtidos con salsa especial y jengibre.",
    price: 5200,
    image: "src/assets/header1.jpg",
  },
  {
    id: 2,
    category: "combos",
    name: "Combo Vegano",
    description: "20 piezas sin ingredientes animales, incluye palta, pepino y zanahoria.",
    price: 4800,
    image: "src/assets/header2.jpg",
  },
  {
    id: 3,
    category: "combos",
    name: "Combo Familiar",
    description: "40 piezas surtidas para compartir, incluye nigiris, rolls y tempura.",
    price: 9800,
    image: "src/assets/header2.jpg",
  },

  // Clásicos
  {
    id: 4,
    category: "clasicos",
    name: "Salmón Roll",
    description: "Roll con arroz, salmón fresco, palta y semillas de sésamo tostado.",
    price: 2700,
    image: "src/assets/header2.jpg",
  },
  {
    id: 5,
    category: "clasicos",
    name: "Tuna Roll",
    description: "Atún rojo fresco, arroz, pepino y cebolla crispy.",
    price: 2900,
    image: "src/assets/header2.jpg",
  },
  {
    id: 6,
    category: "clasicos",
    name: "Ebi Tempura Roll",
    description: "Roll con camarón tempurizado, queso crema y salsa anguila.",
    price: 3100,
    image: "src/assets/header2.jpg",
  },

  // Veggie
  {
    id: 7,
    category: "veggie",
    name: "Veggie Maki",
    description: "Palta, pepino, zanahoria y queso crema en arroz y alga nori.",
    price: 2400,
    image: "src/assets/header2.jpg",
  },
  {
    id: 8,
    category: "veggie",
    name: "Tempura de Verduras",
    description: "Variedad de verduras tempurizadas, acompañadas con salsa ponzu.",
    price: 2200,
    image: "src/assets/header2.jpg",
  },
  {
    id: 9,
    category: "veggie",
    name: "Roll de Aguacate",
    description: "Roll fresco con aguacate, queso crema y semillas de sésamo.",
    price: 2500,
    image: "src/assets/header2.jpg",
  },

  // Bebidas
  {
    id: 10,
    category: "bebidas",
    name: "Agua sin gas",
    description: "Botella de 500ml de agua mineral sin gas.",
    price: 800,
    image: "src/assets/header2.jpg",
  },
  {
    id: 11,
    category: "bebidas",
    name: "Cerveza Artesanal",
    description: "Cerveza IPA artesanal local, botella de 330ml.",
    price: 1200,
    image: "src/assets/header2.jpg",
  },
  {
    id: 12,
    category: "bebidas",
    name: "Té Verde Helado",
    description: "Té verde frío, endulzado naturalmente con miel.",
    price: 900,
    image: "src/assets/header2.jpg",
  }
];
