
export const BRAND = {
  darkRed: '#91000E',
  red: '#DE000C',
  orange: '#FFB500',
  gold: '#F4C71D',
  blue: '#00416B',
  bg: '#F8FAFC'
};

/**
 * Função auxiliar para acessar variáveis de ambiente de forma segura,
 * evitando erros caso o objeto import.meta.env não esteja definido.
 */
const getEnv = (key: string, fallback: number): number => {
  try {
    // @ts-ignore - O objeto import.meta.env é injetado pelo Vite
    const value = import.meta.env ? import.meta.env[key] : undefined;
    return value !== undefined ? Number(value) : fallback;
  } catch (e) {
    return fallback;
  }
};

// Integração com Variáveis de Ambiente da Vercel (Valores padrão atualizados para produção)
export const DEFAULT_MARKET_PRICES: Record<string, number> = {
  'Sal': getEnv('VITE_PRECO_SAL', 2.50),
  'Caldo de Carne': getEnv('VITE_PRECO_CALDO_CARNE', 35.00),
  'Caldo de Frango': getEnv('VITE_PRECO_CALDO_FRANGO', 32.00),
  'Tempero Seco': getEnv('VITE_PRECO_TEMPERO_SECO', 45.00)
};

export const DEFAULT_OPERATIONAL = {
  fixedCosts: getEnv('VITE_LOGISTICA_SERVICO', 39.40),
  labor: getEnv('VITE_LOGISTICA_MAO_PROPRIA', 8.75),
  packaging: getEnv('VITE_LOGISTICA_EMBALAGEM', 8.90),
  batchDivisor: getEnv('VITE_LOGISTICA_CAPACIDADE', 64)
};

export const DEFAULT_STRATEGY = {
  markup: 1.55,
  batchSize: 2.0
};
