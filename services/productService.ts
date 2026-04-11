/**
 * Serviço de produtos — Billy Pet
 * Dados mockados. Futuramente: chamadas à API.
 */

import { ImageSourcePropType } from "react-native";

export interface Category {
  id: string;
  title: string;
  source: ImageSourcePropType;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  categoryId: string;
  source: ImageSourcePropType;
}

const CATEGORIES: Category[] = [
  { id: "racoes", title: "Rações", source: require("@/assets/categories/racoes.png") },
  { id: "petiscos", title: "Petiscos", source: require("@/assets/offers/osso.png") },
  { id: "brinquedos", title: "Brinquedos", source: require("@/assets/categories/brinquedo.png") },
  { id: "conforto", title: "Conforto", source: require("@/assets/categories/cama.png") },
  { id: "higiene", title: "Higiene", source: require("@/assets/categories/cama.png") },
  { id: "saude", title: "Saúde", source: require("@/assets/offers/racao.png") },
];

const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Ração Premium para Gatos",
    price: 89.9,
    oldPrice: 119.9,
    categoryId: "racoes",
    source: require("@/assets/offers/racao.png"),
  },
  {
    id: "p2",
    name: "Osso Natural para Cães",
    price: 24.9,
    oldPrice: 34.9,
    categoryId: "petiscos",
    source: require("@/assets/offers/osso.png"),
  },
  {
    id: "p3",
    name: "Brinquedo Interativo",
    price: 39.9,
    oldPrice: 49.9,
    categoryId: "brinquedos",
    source: require("@/assets/offers/gato1.png"),
  },
  {
    id: "p4",
    name: "Cama Confortável",
    price: 129.9,
    oldPrice: 159.9,
    categoryId: "conforto",
    source: require("@/assets/offers/gato2.png"),
  },
  {
    id: "p5",
    name: "Petisco Premium",
    price: 19.9,
    oldPrice: 24.9,
    categoryId: "petiscos",
    source: require("@/assets/offers/racao.png"),
  },
  {
    id: "p6",
    name: "Ração Filhote Cães",
    price: 109.9,
    categoryId: "racoes",
    source: require("@/assets/offers/racao.png"),
  },
  {
    id: "p7",
    name: "Bolinha de Borracha",
    price: 14.9,
    categoryId: "brinquedos",
    source: require("@/assets/offers/gato1.png"),
  },
  {
    id: "p8",
    name: "Shampoo Pet 500ml",
    price: 32.5,
    categoryId: "higiene",
    source: require("@/assets/offers/gato2.png"),
  },
];

export const productService = {
  listCategories(): Category[] {
    return CATEGORIES;
  },
  listProducts(): Product[] {
    return PRODUCTS;
  },
  searchProducts(query: string): Product[] {
    const term = query.trim().toLowerCase();
    if (!term) return PRODUCTS;
    return PRODUCTS.filter((product) =>
      product.name.toLowerCase().includes(term),
    );
  },
  listByCategory(categoryId: string): Product[] {
    return PRODUCTS.filter((product) => product.categoryId === categoryId);
  },
  findById(id: string): Product | undefined {
    return PRODUCTS.find((product) => product.id === id);
  },
};
