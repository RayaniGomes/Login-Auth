// Exemplo de como personalizar as rotas
import { RoutesConfig } from "./routes.config";

// Exemplo 1: Configuração padrão com "/login" como index
export const defaultRoutes: RoutesConfig = {
  index: "/login",
  login: "/login",
  dashboard: "/dashboard",
  notFound: "*",
};

// Exemplo 2: Configuração alternativa com "/auth" como index
export const authRoutes: RoutesConfig = {
  index: "/auth",
  login: "/auth",
  dashboard: "/home",
  notFound: "*",
};

// Exemplo 3: Configuração com rotas em português
export const portugueseRoutes: RoutesConfig = {
  index: "/entrar",
  login: "/entrar",
  dashboard: "/painel",
  notFound: "*",
};

// Exemplo 4: Configuração com rotas aninhadas
export const nestedRoutes: RoutesConfig = {
  index: "/app/login",
  login: "/app/login",
  dashboard: "/app/dashboard",
  notFound: "*",
};

// Função para alternar entre configurações
export const switchRouteConfig = (config: RoutesConfig) => {
  // Esta função poderia ser usada para alternar configurações em tempo de execução
  // ou para diferentes ambientes (dev, staging, prod)
  return config;
};
