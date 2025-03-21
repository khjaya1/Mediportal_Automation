describe("Mediportal Login Tests", () => {
  beforeEach(() => {
    cy.visit("/sign-in");
  });

  it("should log in successfully with valid credentials", () => {
    cy.fixture("loginData").then((data) => {
      cy.login(data.validUser.email, data.validUser.password);

      // Assert successful login (modify based on app behavior)
      cy.url().should("not.include", "/sign-in"); // Redirected URL
      cy.contains("Welcome to Mediportal").should("be.visible"); // Example assertion
    });
  });

  it("should show an error for invalid credentials", () => {
    cy.fixture("loginData").then((data) => {
      cy.login(data.invalidUser.email, data.invalidUser.password);

      // Assert error message
      cy.contains(
        "Your username or password is incorrect. Please try again."
      ).should("be.visible");
    });
  });

  it("should show validation errors for empty fields", () => {
    cy.get(
      "button.mat-focus-indicator.mt-2.mat-flat-button.mat-button-base.mat-primary._mat-animation-noopable.ng-star-inserted"
    ).click();

    // Assert field validation errors
    cy.contains("Please enter a username to sign in to your account").should(
      "be.visible"
    );
    cy.contains("Please enter a password to sign in to your account").should(
      "be.visible"
    );
  });
});
