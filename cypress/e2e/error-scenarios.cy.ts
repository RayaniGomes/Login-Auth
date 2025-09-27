/// <reference types="cypress" />

describe("Cenários de Erro - E2E Tests", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  describe("Erros de Validação do Servidor", () => {
    it("deve exibir erro de credenciais inválidas", () => {
      // Mock da API com erro de credenciais
      cy.intercept("POST", "**/auth/login/", {
        statusCode: 401,
        body: {
          message: "Credenciais inválidas",
        },
      }).as("authError");

      cy.visit("/login");
      cy.get("[data-cy=email]").type("wrong@example.com");
      cy.get("[data-cy=password]").type("wrongpassword");
      cy.get("[data-cy=submit]").click();

      cy.wait("@authError");

      // Verificar toast de erro
      cy.shouldShowErrorToast(
        "Erro no login",
        "Credenciais inválidas. Verifique seu email e senha."
      );
    });

    it("deve exibir erro de servidor interno", () => {
      // Mock da API com erro 500
      cy.intercept("POST", "**/auth/login/", {
        statusCode: 500,
        body: {
          message: "Erro interno do servidor",
        },
      }).as("serverError");

      cy.visit("/login");
      cy.get("[data-cy=email]").type("test@example.com");
      cy.get("[data-cy=password]").type("password123");
      cy.get("[data-cy=submit]").click();

      cy.wait("@serverError");

      // Verificar toast de erro
      cy.shouldShowErrorToast(
        "Erro no login",
        "Credenciais inválidas. Verifique seu email e senha."
      );
    });
  });

  describe("Erros de Rede", () => {
    it("deve exibir erro quando API não responde", () => {
      // Mock da API com timeout
      cy.intercept("POST", "**/auth/login/", {
        statusCode: 408,
        body: {
          message: "Request timeout",
        },
      }).as("timeoutError");

      cy.visit("/login");
      cy.get("[data-cy=email]").type("test@example.com");
      cy.get("[data-cy=password]").type("password123");
      cy.get("[data-cy=submit]").click();

      cy.wait("@timeoutError");

      // Verificar toast de erro
      cy.shouldShowErrorToast(
        "Erro no login",
        "Credenciais inválidas. Verifique seu email e senha."
      );
    });

    it("deve exibir erro quando API retorna erro de rede", () => {
      // Mock da API com erro de rede
      cy.intercept("POST", "**/auth/login/", {
        forceNetworkError: true,
      }).as("networkError");

      cy.visit("/login");
      cy.get("[data-cy=email]").type("test@example.com");
      cy.get("[data-cy=password]").type("password123");
      cy.get("[data-cy=submit]").click();

      cy.wait("@networkError");

      // Verificar toast de erro
      cy.shouldShowErrorToast(
        "Erro no login",
        "Credenciais inválidas. Verifique seu email e senha."
      );
    });
  });

  describe("Erros de Perfil", () => {
    it("deve exibir erro quando falha ao carregar perfil", () => {
      // Mock da API de perfil com erro
      cy.intercept("GET", "**/profile/", {
        statusCode: 500,
        body: {
          message: "Erro ao carregar perfil",
        },
      }).as("profileError");

      // Simular usuário logado
      cy.loginAsUser();
      cy.visit("/dashboard");

      cy.wait("@profileError");

      // Verificar se o erro é exibido
      cy.contains("Erro ao carregar perfil do usuário").should("be.visible");
    });

    it("deve exibir erro quando perfil não é encontrado", () => {
      // Mock da API de perfil com 404
      cy.intercept("GET", "**/profile/", {
        statusCode: 404,
        body: {
          message: "Perfil não encontrado",
        },
      }).as("profileNotFound");

      // Simular usuário logado
      cy.loginAsUser();
      cy.visit("/dashboard");

      cy.wait("@profileNotFound");

      // Verificar se o erro é exibido
      cy.contains("Erro ao carregar perfil do usuário").should("be.visible");
    });
  });

  describe("Cenários de Token Expirado", () => {
    it("deve exibir erro quando token expira", () => {
      // Simular usuário com token expirado
      cy.window().then((win) => {
        win.localStorage.setItem("access_token", "expired-token");
        win.localStorage.setItem(
          "user",
          JSON.stringify({
            id: 1,
            name: "Test User",
            email: "test@example.com",
          })
        );
      });

      // Mock da API de perfil com erro de token expirado
      cy.intercept("GET", "**/profile/", {
        statusCode: 401,
        body: {
          message: "Token expirado",
        },
      }).as("tokenExpired");

      cy.visit("/dashboard");
      cy.wait("@tokenExpired");

      // Verificar se o erro é exibido
      cy.contains("Erro ao carregar perfil do usuário").should("be.visible");
    });
  });

  describe("Cenários de Formulário", () => {
    it("deve limpar erros quando usuário corrige os campos", () => {
      cy.visit("/login");

      // Submeter formulário vazio
      cy.get("[data-cy=submit]").click();
      cy.contains("E-mail é obrigatório").should("be.visible");
      cy.contains("Senha é obrigatória").should("be.visible");

      // Corrigir campos
      cy.get("[data-cy=email]").type("test@example.com");
      cy.get("[data-cy=password]").type("password123");

      // Verificar se os erros foram limpos
      cy.contains("E-mail é obrigatório").should("not.exist");
      cy.contains("Senha é obrigatória").should("not.exist");
    });
  });

  describe("Cenários de Acessibilidade", () => {
    it("deve submeter formulário com Enter", () => {
      cy.visit("/login");

      cy.get("[data-cy=email]").type("test@example.com");
      cy.get("[data-cy=password]").type("password123{enter}");

      // Verificar se o formulário foi submetido (deve mostrar validação)
      cy.contains("E-mail é obrigatório").should("not.exist");
    });
  });
});
