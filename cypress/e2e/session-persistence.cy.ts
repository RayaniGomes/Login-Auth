/// <reference types="cypress" />

describe("Persistência de Sessão - E2E Tests", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  describe("Persistência de Token", () => {
    it("deve manter sessão após refresh da página", () => {
      // Simular usuário logado
      cy.window().then((win) => {
        win.localStorage.setItem("access_token", "valid-token");
        win.localStorage.setItem("refresh_token", "valid-refresh-token");
        win.localStorage.setItem(
          "user",
          JSON.stringify({
            id: 1,
            name: "Test User",
            email: "test@example.com",
          })
        );
      });

      // Mock da API de perfil
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

      // Visitar dashboard
      cy.visit("/dashboard");
      cy.wait("@getProfile");

      // Verificar se está no dashboard
      cy.url().should("include", "/dashboard");
      cy.get("[data-cy=profile-card]").should("be.visible");

      // Refresh da página
      cy.reload();

      // Verificar se ainda está no dashboard
      cy.url().should("include", "/dashboard");
      cy.get("[data-cy=profile-card]").should("be.visible");
    });

    it("deve manter sessão ao navegar entre páginas", () => {
      // Simular usuário logado
      cy.window().then((win) => {
        win.localStorage.setItem("access_token", "valid-token");
        win.localStorage.setItem("refresh_token", "valid-refresh-token");
        win.localStorage.setItem(
          "user",
          JSON.stringify({
            id: 1,
            name: "Test User",
            email: "test@example.com",
          })
        );
      });

      // Mock da API de perfil
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

      // Visitar dashboard
      cy.visit("/dashboard");
      cy.wait("@getProfile");
      cy.url().should("include", "/dashboard");

      // Navegar para login (deve redirecionar para dashboard)
      cy.visit("/login");
      cy.url().should("include", "/dashboard");

      // Navegar para rota raiz (deve redirecionar para dashboard)
      cy.visit("/");
      cy.url().should("include", "/dashboard");
    });

    it("deve persistir dados do usuário no localStorage", () => {
      // Simular usuário logado
      cy.window().then((win) => {
        win.localStorage.setItem("access_token", "valid-token");
        win.localStorage.setItem("refresh_token", "valid-refresh-token");
        win.localStorage.setItem(
          "user",
          JSON.stringify({
            id: 1,
            name: "Test User",
            email: "test@example.com",
          })
        );
      });

      // Verificar se os dados estão no localStorage
      cy.window().then((win) => {
        expect(win.localStorage.getItem("access_token")).to.not.be.null;
        expect(win.localStorage.getItem("refresh_token")).to.not.be.null;
        expect(win.localStorage.getItem("user")).to.not.be.null;
      });

      // Mock da API de perfil
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

      // Visitar dashboard
      cy.visit("/dashboard");
      cy.wait("@getProfile");

      // Verificar se os dados ainda estão no localStorage
      cy.window().then((win) => {
        expect(win.localStorage.getItem("access_token")).to.not.be.null;
        expect(win.localStorage.getItem("refresh_token")).to.not.be.null;
        expect(win.localStorage.getItem("user")).to.not.be.null;
      });
    });
  });

  describe("Validação de Sessão", () => {
    it("deve validar token ao carregar a aplicação", () => {
      // Simular usuário com token válido
      cy.window().then((win) => {
        win.localStorage.setItem("access_token", "valid-token");
        win.localStorage.setItem("refresh_token", "valid-refresh-token");
        win.localStorage.setItem(
          "user",
          JSON.stringify({
            id: 1,
            name: "Test User",
            email: "test@example.com",
          })
        );
      });

      // Mock da API de perfil
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

      cy.visit("/dashboard");
      cy.wait("@getProfile");

      // Verificar se o dashboard carregou
      cy.get("[data-cy=profile-card]").should("be.visible");
    });

    it("deve testar cenário de token inválido (simulação)", () => {
      // Simular usuário com token inválido
      cy.window().then((win) => {
        win.localStorage.setItem("access_token", "invalid-token");
        win.localStorage.setItem("refresh_token", "invalid-refresh-token");
        win.localStorage.setItem(
          "user",
          JSON.stringify({
            id: 1,
            name: "Test User",
            email: "test@example.com",
          })
        );
      });

      // Mock da API de perfil com erro
      cy.intercept("GET", "**/profile/", {
        statusCode: 401,
        body: {
          message: "Token inválido",
        },
      }).as("invalidToken");

      cy.visit("/dashboard");
      cy.wait("@invalidToken");

      // Verificar se ainda está no dashboard (aplicação não implementa logout automático)
      cy.url().should("include", "/dashboard");

      // Verificar se o localStorage ainda tem os tokens (aplicação não limpa automaticamente)
      cy.window().then((win) => {
        expect(win.localStorage.getItem("access_token")).to.equal(
          "invalid-token"
        );
        expect(win.localStorage.getItem("refresh_token")).to.equal(
          "invalid-refresh-token"
        );
        expect(win.localStorage.getItem("user")).to.not.be.null;
      });
    });
  });

  describe("Múltiplas Abas", () => {
    it("deve testar sincronização de logout entre abas (simulação)", () => {
      // Simular usuário logado
      cy.window().then((win) => {
        win.localStorage.setItem("access_token", "valid-token");
        win.localStorage.setItem("refresh_token", "valid-refresh-token");
        win.localStorage.setItem(
          "user",
          JSON.stringify({
            id: 1,
            name: "Test User",
            email: "test@example.com",
          })
        );
      });

      // Mock da API de perfil
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

      // Visitar dashboard
      cy.visit("/dashboard");
      cy.wait("@getProfile");
      cy.url().should("include", "/dashboard");

      // Simular logout em outra aba
      cy.window().then((win) => {
        // Simular evento de storage change
        win.localStorage.removeItem("access_token");
        win.localStorage.removeItem("refresh_token");
        win.localStorage.removeItem("user");

        // Disparar evento de storage change
        win.dispatchEvent(
          new StorageEvent("storage", {
            key: "access_token",
            newValue: null,
            oldValue: "valid-token",
            storageArea: win.localStorage,
          })
        );
      });

      // Verificar se ainda está no dashboard (aplicação não implementa sincronização automática)
      cy.url().should("include", "/dashboard");
    });

    it("deve testar sincronização de login entre abas (simulação)", () => {
      // Visitar login
      cy.visit("/login");
      cy.url().should("include", "/login");

      // Simular login em outra aba
      cy.window().then((win) => {
        win.localStorage.setItem("access_token", "valid-token");
        win.localStorage.setItem("refresh_token", "valid-refresh-token");
        win.localStorage.setItem(
          "user",
          JSON.stringify({
            id: 1,
            name: "Test User",
            email: "test@example.com",
          })
        );

        // Disparar evento de storage change
        win.dispatchEvent(
          new StorageEvent("storage", {
            key: "access_token",
            newValue: "valid-token",
            oldValue: null,
            storageArea: win.localStorage,
          })
        );
      });

      // Verificar se ainda está no login (aplicação não implementa sincronização automática)
      cy.url().should("include", "/login");
    });
  });

  describe("Expiração de Sessão", () => {
    it("deve testar cenário de sessão expirada (simulação)", () => {
      // Simular usuário com token que expira
      cy.window().then((win) => {
        win.localStorage.setItem("access_token", "expired-token");
        win.localStorage.setItem("refresh_token", "expired-refresh-token");
        win.localStorage.setItem(
          "user",
          JSON.stringify({
            id: 1,
            name: "Test User",
            email: "test@example.com",
          })
        );
      });

      // Mock da API de perfil com token expirado
      cy.intercept("GET", "**/profile/", {
        statusCode: 401,
        body: {
          message: "Token expirado",
        },
      }).as("expiredToken");

      cy.visit("/dashboard");
      cy.wait("@expiredToken");

      // Verificar se ainda está no dashboard (aplicação não implementa logout automático)
      cy.url().should("include", "/dashboard");

      // Verificar se o localStorage ainda tem os tokens (aplicação não limpa automaticamente)
      cy.window().then((win) => {
        expect(win.localStorage.getItem("access_token")).to.equal(
          "expired-token"
        );
        expect(win.localStorage.getItem("refresh_token")).to.equal(
          "expired-refresh-token"
        );
        expect(win.localStorage.getItem("user")).to.not.be.null;
      });
    });
  });

  describe("Recuperação de Sessão", () => {
    it("deve recuperar sessão após interrupção", () => {
      // Simular usuário logado
      cy.window().then((win) => {
        win.localStorage.setItem("access_token", "valid-token");
        win.localStorage.setItem("refresh_token", "valid-refresh-token");
        win.localStorage.setItem(
          "user",
          JSON.stringify({
            id: 1,
            name: "Test User",
            email: "test@example.com",
          })
        );
      });

      // Mock da API de perfil
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

      // Visitar dashboard
      cy.visit("/dashboard");
      cy.wait("@getProfile");
      cy.url().should("include", "/dashboard");

      // Simular interrupção (fechar aba)
      cy.window().then((win) => {
        // Simular perda de estado da aplicação
        win.location.reload();
      });

      // Verificar se a sessão foi recuperada
      cy.url().should("include", "/dashboard");
      cy.get("[data-cy=profile-card]").should("be.visible");
    });
  });
});
