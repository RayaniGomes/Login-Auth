# Configuração de Rotas

Este diretório contém a configuração centralizada de rotas da aplicação.

## Arquivos

- `routes.config.ts` - Configuração principal das rotas
- `routes.example.ts` - Exemplos de diferentes configurações
- `README.md` - Esta documentação

## Como Usar

### Configuração Atual

A configuração atual define `/login` como a rota index:

```typescript
export const routesConfig: RoutesConfig = {
  index: "/login", // Rota principal (index)
  login: "/login", // Página de login
  dashboard: "/dashboard", // Página do dashboard
  notFound: "*", // Página 404
};
```

### Personalizando Rotas

Para alterar as rotas, edite o arquivo `routes.config.ts`:

```typescript
export const routesConfig: RoutesConfig = {
  index: "/entrar", // Muda a rota index para /entrar
  login: "/entrar", // Muda a rota de login para /entrar
  dashboard: "/painel", // Muda o dashboard para /painel
  notFound: "*", // Mantém a rota 404
};
```

### Exemplos de Configurações

Veja `routes.example.ts` para exemplos de diferentes configurações:

1. **Configuração Padrão**: `/login` como index
2. **Configuração Auth**: `/auth` como index
3. **Configuração Português**: `/entrar` como index
4. **Configuração Aninhada**: `/app/login` como index

### Benefícios

- ✅ **Centralização**: Todas as rotas em um local
- ✅ **Flexibilidade**: Fácil de alterar rotas
- ✅ **Consistência**: Mesma configuração em toda a aplicação
- ✅ **Manutenibilidade**: Mudanças em um só lugar
- ✅ **Type Safety**: TypeScript garante tipos corretos

### Arquivos que Usam a Configuração

- `App.tsx` - Definição das rotas do React Router
- `AuthGuard.tsx` - Redirecionamentos de autenticação
- `Login.tsx` - Navegação após login
- `api.ts` - Redirecionamento em caso de erro
- `auth.service.ts` - Redirecionamento após logout

### Como Alterar

1. Edite `src/config/routes.config.ts`
2. Altere os valores conforme necessário
3. Os testes continuarão funcionando
4. A aplicação usará automaticamente as novas rotas
