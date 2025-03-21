describe("Finance Item Summary Tests", () => {
  beforeEach(() => {
    // Load both login and finance test data
    cy.fixture("loginData").then((loginData) => {
      cy.visit("/");
      cy.login(loginData.validUser.email, loginData.validUser.password);
    });

    // Load finance test data
    cy.fixture("financeData").as("financeData");

    cy.get("@financeData").then((financeData) => {
      const { menuText, linkText, pageTitle, pageDescription } = financeData.itemSummary.navigation;

      // Navigate to Finance Dashboard
      cy.get("mat-expansion-panel-header")
        .contains(menuText)
        .should("be.visible")
        .click();

      // Click on Item Summary link
      cy.get("mat-list-item")
        .contains(linkText)
        .should("be.visible")
        .click();

      // Verify user is on Item Summary page and description
      cy.get("h1")
        .should("be.visible")
        .and("contain", pageTitle);
      
      cy.get(".mb-3")
        .should("contain", pageDescription);
    });
  });

  // it("should display Item Summary grid with correct columns", () => {
  //   // Verify the table exists and is visible
  //   cy.get("[role='table']")
  //     .should("be.visible");

  //   // Verify header row exists
  //   cy.get("[role='rowgroup']")
  //     .first()
  //     .within(() => {
  //       // Verify each column header with proper sorting
  //       cy.get(".mat-sort-header")
  //         .should("have.length", 5) // 5 sortable columns excluding View
  //         .then(($headers) => {
  //           const expectedHeaders = [
  //             "Practitioner Name",
  //             "No. Of Patients",
  //             "Invoice Count", 
  //             "Service Count",
  //             "Total Fee"
  //           ];

  //           cy.wrap($headers).each(($header, index) => {
  //             cy.wrap($header)
  //               .find(".mat-sort-header-content")
  //               .should("contain", expectedHeaders[index]);
  //           });
  //         });

  //       // Verify View column (non-sortable)
  //       cy.get(".mat-header-cell")
  //         .last()
  //         .should("contain", "View");
  //     });

  //   // Verify column alignments
  //   cy.get(".mat-header-cell")
  //     .then(($cells) => {
  //       // First column (Practitioner Name) - left aligned
  //       cy.wrap($cells).first()
  //         .should("not.have.class", "text-end");

  //       // Middle columns (numeric values) - right aligned
  //       cy.wrap($cells).eq(1).should("have.class", "text-end");
  //       cy.wrap($cells).eq(2).should("have.class", "text-end");
  //       cy.wrap($cells).eq(3).should("have.class", "text-end");
  //       cy.wrap($cells).eq(4).should("have.class", "text-end");

  //       // Last column (View) - center aligned
  //       cy.wrap($cells).last()
  //         .should("have.class", "text-center");
  //     });
  // });

  // it("should allow filtering by medical centre", () => {
  //   // Click on medical centre dropdown
  //   cy.get("#slct_hospital")
  //     .should("be.visible")
  //     .click();

  //   // Get first available medical center and select it
  //   cy.get("mat-option")
  //     .first()
  //     .should("be.visible")
  //     .then(($option) => {
  //       const centerName = $option.text().trim();
  //       cy.wrap($option).click();
        
  //       // Verify the selection was made
  //       cy.get("#slct_hospital")
  //         .should("contain", centerName);
          
  //       // Verify table updates after selection
  //       cy.get("[role='table']")
  //         .should("be.visible");

  //       // Intercept the API call
  //       cy.intercept(
  //         "GET",
  //         `${Cypress.config("ComposeURL")}/api/viewEarningsAllDoctorSummary*`
  //       ).as("summaryData");

  //       // Wait for the API request to complete
  //       cy.wait("@summaryData", { timeout: 10000 }).then(
  //         (interception) => {
  //           // Ensure the API request was successful
  //           expect(interception.response.statusCode).to.eq(200);
  //           cy.log("API request completed successfully");
  //           console.log("API Response:", interception.response.body); // Log response for debugging
  //         }
  //       );
  //     });
  // });

  it("should allow searching for practitioners", () => {
    // Type in practitioner search box
    cy.get("#doctorName")
      .should("be.visible")
      .type("Kannan");

    // Verify search results contain the practitioner
    cy.get("table tbody tr")
      .should("contain", "Kannan Ramanathan");

    // Clear search
    cy.get("#doctorName").clear();
  });

  // it("should show date range and allow filtering", () => {
  //   // Verify default date range is visible
  //   cy.get(".w-50.mt-3")
  //     .should("contain", "Last 7 Days")
  //     .and("contain", "From")
  //     .and("contain", "to");

  //   // Click date filter
  //   cy.get("#txt_duration")
  //     .should("be.visible")
  //     .click();

  //   // Verify date picker opens
  //   cy.get("mat-menu-panel")
  //     .should("be.visible");
  // });

  // it("should allow exporting data", () => {
  //   // Click export button
  //   cy.get("#btn_export")
  //     .should("be.visible")
  //     .click();

  //   // Verify export menu appears
  //   cy.get("mat-menu")
  //     .should("be.visible");
  // });
});
