/// <reference types="cypress" />

// ***********************************************
// Custom Commands
// ***********************************************

// Comando para fazer login
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/login");
  cy.get("[data-cy=email]").type(email);
  cy.get("[data-cy=password]").type(password);
  cy.get("[data-cy=submit]").click();
});

// Comando para simular usuário logado
Cypress.Commands.add("loginAsUser", (userData?: any) => {
  const defaultUser = {
    id: 1,
    name: "Test User",
    email: "test@example.com",
    avatar: null,
  };

  const user = userData || defaultUser;

  cy.window().then((win) => {
    win.localStorage.setItem("access_token", "mock-token");
    win.localStorage.setItem("refresh_token", "mock-refresh-token");
    win.localStorage.setItem("user", JSON.stringify(user));
  });
});

// Comando para fazer logout
Cypress.Commands.add("logout", () => {
  cy.get("[data-cy=logout-button]").click();
});

// Comando para verificar se está na página de login
Cypress.Commands.add("shouldBeOnLoginPage", () => {
  cy.url().should("include", "/login");
  cy.get("[data-cy=email]").should("be.visible");
});

// Comando para verificar se está na página do dashboard
Cypress.Commands.add("shouldBeOnDashboard", () => {
  cy.url().should("include", "/dashboard");
  cy.get("[data-cy=profile-card]").should("be.visible");
});

// Comando para verificar toast de sucesso
Cypress.Commands.add(
  "shouldShowSuccessToast",
  (title: string, description?: string) => {
    cy.contains(title).should("be.visible");
    if (description) {
      cy.contains(description).should("be.visible");
    }
  }
);

// Comando para verificar toast de erro
Cypress.Commands.add(
  "shouldShowErrorToast",
  (title: string, description?: string) => {
    cy.contains(title).should("be.visible");
    if (description) {
      cy.contains(description).should("be.visible");
    }
  }
);

// Comando para mockar API de login
Cypress.Commands.add(
  "mockLoginAPI",
  (statusCode: number = 200, response?: any) => {
    const defaultResponse = {
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
    };

    cy.intercept("POST", "**/auth/login/", {
      statusCode,
      body: response || defaultResponse,
    }).as("loginRequest");
  }
);

// Comando para mockar API de perfil
Cypress.Commands.add(
  "mockProfileAPI",
  (statusCode: number = 200, response?: any) => {
    const defaultResponse = {
      id: 1,
      name: "Test User",
      last_name: "Silva",
      email: "test@example.com",
      avatar: {
        high: "https://example.com/avatar.jpg",
      },
    };

    cy.intercept("GET", "**/profile/", {
      statusCode,
      body: response || defaultResponse,
    }).as("getProfile");
  }
);

// Declaração de tipos TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      loginAsUser(userData?: any): Chainable<void>;
      logout(): Chainable<void>;
      shouldBeOnLoginPage(): Chainable<void>;
      shouldBeOnDashboard(): Chainable<void>;
      shouldShowSuccessToast(
        title: string,
        description?: string
      ): Chainable<void>;
      shouldShowErrorToast(
        title: string,
        description?: string
      ): Chainable<void>;
      mockLoginAPI(statusCode?: number, response?: any): Chainable<void>;
      mockProfileAPI(statusCode?: number, response?: any): Chainable<void>;
    }
  }
}
