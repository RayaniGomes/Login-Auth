/// <reference types="cypress" />

describe("Sistema de Autenticação - E2E Tests", () => {
  beforeEach(() => {
    // Limpar localStorage antes de cada teste
    cy.clearLocalStorage();
  });

  describe("Página de Login", () => {
    it("deve exibir a página de login corretamente", () => {
      cy.visit("/login");

      // Verificar elementos da página
      cy.get("[data-cy=email]").should("be.visible");
      cy.get("[data-cy=password]").should("be.visible");
      cy.get("[data-cy=submit]").should("be.visible");

      // Verificar se o botão está desabilitado inicialmente
      cy.get("[data-cy=submit]").should("contain", "Sign In");
    });

    it("deve validar campos obrigatórios", () => {
      cy.visit("/login");

      // Tentar submeter formulário vazio
      cy.get("[data-cy=submit]").click();

      // Verificar mensagens de erro
      cy.contains("E-mail é obrigatório").should("be.visible");
      cy.contains("Senha é obrigatória").should("be.visible");
    });

    it("deve validar tamanho mínimo da senha", () => {
      cy.visit("/login");

      // Inserir senha muito curta
      cy.get("[data-cy=email]").type("test@example.com");
      cy.get("[data-cy=password]").type("123");
      cy.get("[data-cy=submit]").click();

      // Verificar mensagem de erro
      cy.contains("Senha deve ter pelo menos 6 caracteres").should(
        "be.visible"
      );
    });

    it("deve limpar erros quando usuário começa a digitar", () => {
      cy.visit("/login");

      // Submeter formulário vazio
      cy.get("[data-cy=submit]").click();
      cy.contains("E-mail é obrigatório").should("be.visible");

      // Começar a digitar no campo email
      cy.get("[data-cy=email]").type("test");
      cy.contains("E-mail é obrigatório").should("not.exist");
    });
  });

  describe("Fluxo de Autenticação", () => {
    it("deve redirecionar para login quando não autenticado", () => {
      cy.visit("/dashboard");
      cy.url().should("include", "/");
    });

    it("deve redirecionar para dashboard após login bem-sucedido", () => {
      // Mock da API de login
      cy.intercept("POST", "**/auth/login/", {
        statusCode: 200,
        body: {
          user: {
            id: 1,
            name: "Test User",
            email: "test@example.com",
            avatar: null,
          },
          tokens: {
            access: "mock-access-token",
            refresh: "mock-refresh-token",
          },
        },
      }).as("loginRequest");

      cy.visit("/login");
      cy.get("[data-cy=email]").type("test@example.com");
      cy.get("[data-cy=password]").type("password123");
      cy.get("[data-cy=submit]").click();

      // Verificar se a requisição foi feita
      cy.wait("@loginRequest");

      // Verificar redirecionamento
      cy.url().should("include", "/dashboard");
    });

    it("deve exibir toast de sucesso após login", () => {
      // Mock da API de login
      cy.intercept("POST", "**/auth/login/", {
        statusCode: 200,
        body: {
          user: {
            id: 1,
            name: "Test User",
            email: "test@example.com",
            avatar: null,
          },
          tokens: {
            access: "mock-access-token",
            refresh: "mock-refresh-token",
          },
        },
      }).as("loginRequest");

      cy.visit("/login");
      cy.get("[data-cy=email]").type("test@example.com");
      cy.get("[data-cy=password]").type("password123");
      cy.get("[data-cy=submit]").click();

      cy.wait("@loginRequest");

      // Verificar toast de sucesso
      cy.contains("Login realizado com sucesso!").should("be.visible");
    });

    it("deve exibir toast de erro para credenciais inválidas", () => {
      // Mock da API de login com erro
      cy.intercept("POST", "**/auth/login/", {
        statusCode: 401,
        body: {
          message: "Credenciais inválidas",
        },
      }).as("loginError");

      cy.visit("/login");
      cy.get("[data-cy=email]").type("test@example.com");
      cy.get("[data-cy=password]").type("wrongpassword");
      cy.get("[data-cy=submit]").click();

      cy.wait("@loginError");

      // Verificar toast de erro
      cy.contains("Erro no login").should("be.visible");
      cy.contains("Credenciais inválidas. Verifique seu email e senha.").should(
        "be.visible"
      );
    });
  });

  describe("Página do Dashboard", () => {
    beforeEach(() => {
      // Mock do perfil do usuário
      cy.intercept("GET", "**/profile/", {
        statusCode: 200,
        body: {
          id: 1,
          name: "Test User",
          last_name: "Silva",
          email: "test@example.com",
          avatar: {
            high: "https://example.com/avatar.jpg",
          },
        },
      }).as("getProfile");
    });

    it("deve exibir informações do perfil corretamente", () => {
      // Simular usuário logado
      cy.window().then((win) => {
        win.localStorage.setItem("access_token", "mock-token");
        win.localStorage.setItem(
          "user",
          JSON.stringify({
            id: 1,
            name: "Test User",
            email: "test@example.com",
          })
        );
      });

      cy.visit("/dashboard");
      cy.wait("@getProfile");

      // Verificar elementos do dashboard
      cy.get("[data-cy=profile-card]").should("be.visible");
      cy.get("[data-cy=profile-avatar]").should("be.visible");
      cy.get("[data-cy=profile-name]").should("have.value", "Test User");
      cy.get("[data-cy=profile-email]").should(
        "have.value",
        "test@example.com"
      );
      cy.get("[data-cy=logout-button]").should("be.visible");
    });

    it("deve fazer logout corretamente", () => {
      // Simular usuário logado
      cy.window().then((win) => {
        win.localStorage.setItem("access_token", "mock-token");
        win.localStorage.setItem(
          "user",
          JSON.stringify({
            id: 1,
            name: "Test User",
            email: "test@example.com",
          })
        );
      });

      cy.visit("/dashboard");
      cy.wait("@getProfile");

      // Clicar no botão de logout
      cy.get("[data-cy=logout-button]").click();

      // Verificar redirecionamento para login
      cy.url().should("include", "/login");

      // Verificar se o localStorage foi limpo
      cy.window().then((win) => {
        expect(win.localStorage.getItem("access_token")).to.be.null;
        expect(win.localStorage.getItem("user")).to.be.null;
      });
    });

    it("deve fazer logout e redirecionar para login", () => {
      // Simular usuário logado
      cy.window().then((win) => {
        win.localStorage.setItem("access_token", "mock-token");
        win.localStorage.setItem(
          "user",
          JSON.stringify({
            id: 1,
            name: "Test User",
            email: "test@example.com",
          })
        );
      });

      cy.visit("/dashboard");
      cy.wait("@getProfile");

      // Clicar no botão de logout
      cy.get("[data-cy=logout-button]").click();

      // Verificar redirecionamento para login
      cy.url().should("include", "/login");
    });
  });

  describe("Navegação e Roteamento", () => {
    it("deve redirecionar para dashboard quando acessar rota raiz com usuário autenticado", () => {
      // Simular usuário logado
      cy.loginAsUser();
      cy.visit("/");
      cy.url().should("include", "/dashboard");
    });
  });
});
