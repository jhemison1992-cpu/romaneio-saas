/**
 * Stripe Products and Prices Configuration
 * These are the product IDs and price IDs from Stripe
 * In production, these should be fetched from Stripe API or environment variables
 */

export const STRIPE_PRODUCTS = {
  STARTER: {
    name: "Starter",
    slug: "starter",
    monthlyPrice: 79.90,
    features: [
      "Até 50 romaneios por mês",
      "1 usuário",
      "Suporte por email",
      "Relatórios básicos",
    ],
    maxRomaneios: 50,
    maxUsers: 1,
  },
  PROFESSIONAL: {
    name: "Professional",
    slug: "professional",
    monthlyPrice: 159.80,
    features: [
      "Até 500 romaneios por mês",
      "Até 5 usuários",
      "Suporte prioritário",
      "Relatórios avançados",
      "Integração API",
      "Backup automático",
    ],
    maxRomaneios: 500,
    maxUsers: 5,
  },
  ENTERPRISE: {
    name: "Enterprise",
    slug: "enterprise",
    monthlyPrice: 0, // Custom pricing
    features: [
      "Romaneios ilimitados",
      "Usuários ilimitados",
      "Suporte 24/7 dedicado",
      "Relatórios customizados",
      "Integração API completa",
      "Backup em tempo real",
      "Treinamento incluído",
      "SLA garantido",
    ],
    maxRomaneios: 999999,
    maxUsers: 999999,
  },
};

export const getProductBySlug = (slug: string) => {
  const product = Object.values(STRIPE_PRODUCTS).find((p) => p.slug === slug);
  return product;
};

export const getAllProducts = () => {
  return Object.values(STRIPE_PRODUCTS).filter((p) => p.monthlyPrice > 0);
};
