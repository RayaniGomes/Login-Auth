export interface RoutesConfig {
  index: string;
  login: string;
  dashboard: string;
  notFound: string;
}

export const routesConfig: RoutesConfig = {
  index: "/login", // Define "/login" como rota index
  login: "/login",
  dashboard: "/dashboard",
  notFound: "*",
};

// Função helper para obter a rota index
export const getIndexRoute = (): string => {
  return routesConfig.index;
};

// Função helper para verificar se uma rota é a index
export const isIndexRoute = (path: string): boolean => {
  return path === routesConfig.index || path === "/";
};
