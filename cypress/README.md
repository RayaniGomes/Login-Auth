# Testes E2E com Cypress

Este diretório contém os testes end-to-end (E2E) para o sistema de autenticação.

## Estrutura dos Testes

```
cypress/
├── e2e/
│   ├── spec.cy.ts                    # Testes principais do fluxo de autenticação
│   ├── error-scenarios.cy.ts         # Testes de cenários de erro
│   ├── refresh-token.cy.ts           # Testes de refresh token
│   └── session-persistence.cy.ts     # Testes de persistência de sessão
├── fixtures/
│   └── users.json                    # Dados de teste para usuários
├── support/
│   ├── commands.ts                   # Comandos customizados do Cypress
│   └── e2e.ts                        # Configuração de suporte
└── README.md                         # Este arquivo
```

## Comandos Disponíveis

### Executar Testes

```bash
# Abrir interface do Cypress
npm run test:e2e

# Executar testes em modo headless
npm run test:e2e:run
```

### Comandos Customizados

Os seguintes comandos customizados estão disponíveis:

- `cy.login(email, password)` - Faz login com email e senha
- `cy.loginAsUser(userData?)` - Simula usuário logado no localStorage
- `cy.logout()` - Faz logout
- `cy.shouldBeOnLoginPage()` - Verifica se está na página de login
- `cy.shouldBeOnDashboard()` - Verifica se está na página do dashboard
- `cy.shouldShowSuccessToast(title, description?)` - Verifica toast de sucesso
- `cy.shouldShowErrorToast(title, description?)` - Verifica toast de erro
- `cy.mockLoginAPI(statusCode?, response?)` - Mocka API de login
- `cy.mockProfileAPI(statusCode?, response?)` - Mocka API de perfil

## Cenários de Teste

### Testes Principais (spec.cy.ts)

1. **Página de Login**

   - Exibição correta dos elementos
   - Validação de campos obrigatórios
   - Validação de formato de email
   - Validação de tamanho mínimo da senha
   - Limpeza de erros ao digitar

2. **Fluxo de Autenticação**

   - Redirecionamento para login quando não autenticado
   - Login bem-sucedido com redirecionamento
   - Exibição de toast de sucesso
   - Tratamento de credenciais inválidas

3. **Página do Dashboard**

   - Exibição de informações do perfil
   - Funcionamento do logout
   - Toast de sucesso após logout

4. **Navegação e Roteamento**
   - Redirecionamento de rotas protegidas
   - Tratamento de rotas inexistentes

### Cenários de Erro (error-scenarios.cy.ts)

1. **Erros de Validação do Servidor**

   - Erros de validação 400
   - Credenciais inválidas 401
   - Erro interno do servidor 500

2. **Erros de Rede**

   - Timeout de requisição
   - Erro de conexão

3. **Erros de Perfil**

   - Falha ao carregar perfil
   - Perfil não encontrado

4. **Token Expirado**

   - Redirecionamento quando token expira

5. **Cenários de Formulário**

   - Desabilitação do botão durante carregamento
   - Limpeza de erros ao corrigir campos

6. **Acessibilidade**
   - Navegação por Tab
   - Submissão com Enter

### Testes de Refresh Token (refresh-token.cy.ts)

1. **Renovação Automática**

   - Renovação quando access token expira
   - Logout quando refresh token expira
   - Tratamento de erros de refresh

2. **Validação de Token**
   - Inclusão de token em requisições
   - Validação de headers de autorização

### Testes de Persistência de Sessão (session-persistence.cy.ts)

1. **Persistência de Token**

   - Manutenção após refresh da página
   - Navegação entre páginas
   - Persistência em nova aba

2. **Validação de Sessão**

   - Validação ao carregar aplicação
   - Logout quando token inválido

3. **Múltiplas Abas**

   - Sincronização de logout
   - Sincronização de login

4. **Expiração de Sessão**
   - Logout quando sessão expira
   - Recuperação de sessão

## Configuração

Os testes estão configurados para:

- **Base URL**: `http://localhost:5173`
- **Viewport**: 1280x720
- **Timeout**: 10 segundos
- **Video**: Desabilitado
- **Screenshots**: Habilitado em falhas

## Dados de Teste

Os dados de teste estão em `cypress/fixtures/users.json` e incluem:

- `validUser`: Usuário válido para testes de sucesso
- `invalidUser`: Usuário inválido para testes de erro
- `adminUser`: Usuário administrador
- `userWithAvatar`: Usuário com avatar para testes de perfil

## Executando Testes Específicos

```bash
# Executar apenas testes de login
npx cypress run --spec "cypress/e2e/spec.cy.ts"

# Executar apenas cenários de erro
npx cypress run --spec "cypress/e2e/error-scenarios.cy.ts"

# Executar testes de refresh token
npm run test:e2e:refresh-token

# Executar testes de persistência de sessão
npm run test:e2e:session

# Executar teste específico
npx cypress run --spec "cypress/e2e/spec.cy.ts" --grep "deve validar campos obrigatórios"
```

## Debugging

Para debugar os testes:

1. Abra o Cypress com `npm run test:e2e`
2. Selecione o teste que deseja debugar
3. Use `cy.pause()` no código do teste para pausar a execução
4. Use `cy.debug()` para inspecionar elementos

## Boas Práticas

1. **Use data-cy attributes**: Sempre use `data-cy` para selecionar elementos
2. **Mock APIs**: Use mocks para simular respostas da API
3. **Limpe estado**: Use `cy.clearLocalStorage()` no `beforeEach`
4. **Comandos customizados**: Use comandos customizados para reutilizar código
5. **Asserções claras**: Use asserções específicas e descritivas
6. **Dados de teste**: Use fixtures para dados consistentes
