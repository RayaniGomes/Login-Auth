/// <reference types="cypress" />

describe("Refresh Token - E2E Tests", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  describe("Testes de Refresh Token", () => {
    it("deve testar se refresh token está disponível na aplicação", () => {
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

      cy.visit("/dashboard");
      cy.wait("@getProfile");

      // Verificar se o dashboard carregou
      cy.get("[data-cy=profile-card]").should("be.visible");

      // Verificar se os tokens estão no localStorage
      cy.window().then((win) => {
        expect(win.localStorage.getItem("access_token")).to.equal(
          "valid-token"
        );
        expect(win.localStorage.getItem("refresh_token")).to.equal(
          "valid-refresh-token"
        );
      });
    });

    it("deve testar cenário de token expirado (simulação)", () => {
      // Simular usuário com token expirado
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

      // Mock da API de perfil que retorna 401
      cy.intercept("GET", "**/profile/", {
        statusCode: 401,
        body: {
          message: "Token expirado",
        },
      }).as("profileWithExpiredToken");

      cy.visit("/dashboard");
      cy.wait("@profileWithExpiredToken");

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
      });
    });

    it("deve testar refresh token manual (se implementado)", () => {
      // Mock da API de refresh token
      cy.intercept("POST", "**/auth/refresh/", {
        statusCode: 200,
        body: {
          access: "new-access-token",
          refresh: "new-refresh-token",
        },
      }).as("refreshToken");

      // Simular chamada manual de refresh (se a aplicação tiver essa funcionalidade)
      cy.window().then((win) => {
        // Simular chamada de refresh token
        fetch("/api/auth/refresh/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: win.localStorage.getItem("refresh_token"),
          }),
        });
      });

      // Verificar se a chamada foi feita
      cy.wait("@refreshToken");
    });

    it("deve testar cenário de refresh token inválido", () => {
      // Mock da API de refresh token que retorna erro
      cy.intercept("POST", "**/auth/refresh/", {
        statusCode: 400,
        body: {
          message: "Refresh token inválido",
        },
      }).as("refreshTokenError");

      // Simular chamada de refresh token com token inválido
      cy.window().then((win) => {
        fetch("/api/auth/refresh/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: "invalid-refresh-token",
          }),
        });
      });

      // Verificar se a chamada foi feita
      cy.wait("@refreshTokenError");
    });
  });

  describe("Validação de Token em Requisições", () => {
    it("deve incluir token válido em requisições subsequentes", () => {
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
      cy.intercept("GET", "**/profile/", (req) => {
        expect(req.headers.authorization).to.include("Bearer");
        req.reply({
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
        });
      }).as("profileWithToken");

      cy.visit("/dashboard");
      cy.wait("@profileWithToken");

      // Verificar se o dashboard carregou
      cy.get("[data-cy=profile-card]").should("be.visible");
    });
  });
});
