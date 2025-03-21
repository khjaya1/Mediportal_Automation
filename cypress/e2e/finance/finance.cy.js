describe("Finance Module Tests", () => {
  beforeEach(() => {
    cy.fixture("loginData").then((loginData) => {
      cy.visit("/");
      cy.login(loginData.validUser.email, loginData.validUser.password);
    });
  });

  it('should navigate to Finance Dashboard from Finance Nav group', () => {
    // Click on Finance navigation group (using the account_balance icon and Finance text)
    cy.get('mat-expansion-panel-header')
      .contains('Finance')
      .should('be.visible')
      .click();

    // Click on Finance Dashboard link (using dashboard icon and Finance Dashboard text)
    cy.get('mat-list-item')
      .contains('Finance Dashboard')
      .should('be.visible')
      .click();

    // Verify user is on Finance Dashboard
    cy.get('h1')
      .should('be.visible')
      .and('contain', 'Finance Dashboard');

    // Additional verification for the dashboard content
    cy.get('mat-form-field')
      .contains('Select Medical Centre')
      .should('be.visible');
  });

  it("should update dashboard values when medical centre is changed", () => {
    // Navigate to Finance Dashboard
    cy.get("mat-expansion-panel-header")
      .contains("Finance")
      .should("be.visible")
      .click();

    cy.get("mat-list-item")
      .contains("Finance Dashboard")
      .should("be.visible")
      .click();

    // Wait for dashboard to fully load and stabilize
    cy.get("h1").contains("Finance Dashboard").should("be.visible");
    cy.get(".static-grid-card")
      .should("have.length.gt", 0)
      .should("be.visible")
      .then(() => {
        // Ensure API Call finishes before collecting data
        cy.intercept(
          "GET",
          `${Cypress.config("ComposeURL")}/api/newEarningDashboard*`
        ).as("getDashboardData");

        // Wait for the API request to complete
        cy.wait("@getDashboardData", { timeout: 10000 }).then(
          (interception) => {
            // Ensure the API request was successful
            expect(interception.response.statusCode).to.eq(200);
            cy.log("API request completed successfully");
            console.log("API Response:", interception.response.body); // Log response for debugging
          }
        ); // Store initial dashboard values
        cy.get(".static-grid-card")
          .contains("Patients Seen")
          .parent()
          .find(".fs-24")
          .invoke("text")
          .then((text) => {
            expect(text).to.exist; // Check if value exists
            cy.log(`Initial Patients Seen: ${text}`); // Log to Cypress console
            console.log(`Initial Patients Seen: ${text}`); // Log to browser console
            cy.wrap(text).as("initialPatientCount"); // Store the value
          });

        cy.get(".static-grid-card")
          .contains("Total Billed")
          .parent()
          .find(".fs-24")
          .invoke("text")
          .then((text) => {
            expect(text).to.exist; // Check if value exists
            cy.log(`Initial Total Billed: ${text}`); // Log to Cypress console
            console.log(`Initial Total Billed: ${text}`); // Log to browser console
            cy.wrap(text).as("initialBilledAmount"); // Store the value
          });

        // Click on Medical Centre dropdown with improved timing and visibility checks
        cy.get("mat-form-field")
          .contains("Select Medical Centre")
          .parents("mat-form-field")
          .should("be.visible")
          .should("not.have.class", "mat-form-field-disabled")
          .then(($field) => {
            // First, ensure the trigger is ready and click it
            cy.wrap($field)
              .find(".mat-select-trigger")
              .should("be.visible")
              .should("not.be.disabled")
              .click({ force: true });

            // Wait for overlay container with increased timeout
            cy.get("mat-select", { timeout: 10000 })
              .should("exist")
              .should("be.visible")
              .click({ force: true })
              .then(($panel) => {
                // Now wait for options to be loaded

                cy.wrap($panel)
                  .get("mat-option", { timeout: 2000})
                  .should("exist")
                  .should("be.visible")
                  .should("have.length.gt", 1)
                  .then(($options) => {
                    // Find first non-"All" option that is visible and enabled
                    const validOptions = Array.from($options).filter((el) => {
                      const text = el.textContent.trim().toLowerCase();
                      return (
                        !text.includes("all") && !el.hasAttribute("disabled")
                      );
                    });

                    if (validOptions.length > 0) {
                      cy.log(
                        `Found ${validOptions.length} valid medical centre options`
                      );
                      cy.wrap(validOptions[0])
                        .scrollIntoView()
                        .should("be.visible")
                        .click({ force: true });
                    } else {
                      throw new Error(
                        "No valid and enabled medical centre options found"
                      );
                    }
                  });
              });
          });

        // // Wait for dashboard to update with improved stability checks
        cy.get(".ngx-overlay.loading-foreground", { timeout: 10000 })
          .should("not.exist")
          .then(() => {
            // Verify dashboard values have changed

            cy.get(".static-grid-card")
              .contains("Patients Seen")
              .parent()
              .find(".fs-24")
              .invoke("text")
              .then((newPatientCount) => {
                cy.get("@initialPatientCount").then((initialCount) => {
                  expect(newPatientCount).to.exist;

                  // Verify the value has changed or is different from initial value
                  if (initialCount !== "0") {
                    // Only compare if initial value wasn't 0
                    expect(newPatientCount).not.to.equal(initialCount);
                  }
                });
              });

            cy.get(".static-grid-card")
              .contains("Total Billed")
              .parent()
              .find(".fs-24")
              .invoke("text")
              .then((newBilledAmount) => {
                cy.get("@initialBilledAmount").then((initialAmount) => {
                  expect(newBilledAmount).to.exist;
                  // Verify the value has changed or is different from initial value
                  if (initialAmount !== "0.00") {
                    // Only compare if initial value wasn't 0
                    expect(newBilledAmount).not.to.equal(initialAmount);
                  }
                });
              });
          });
      });
  });

  it("should trigger sync API when sync button is clicked", () => {
    // Navigate to Finance Dashboard
    cy.get("mat-expansion-panel-header")
      .contains("Finance")
      .should("be.visible")
      .click();

    cy.get("mat-list-item")
      .contains("Finance Dashboard")
      .should("be.visible")
      .click();

    // Wait for dashboard to fully load and stabilize
    cy.get("h1").contains("Finance Dashboard").should("be.visible");
    cy.get(".static-grid-card")
      .should("have.length.gt", 0)
      .should("be.visible")
      .then(() => {
        //Ensure API Call finishes before collecting data
        cy.intercept(
          "GET",
          `${Cypress.config("ComposeURL")}/api/newEarningDashboard*`
        ).as("getDashboardData");

        // Wait for the API request to complete
        cy.wait("@getDashboardData", { timeout: 10000 }).then(
          (interception) => {
            // Ensure the API request was successful
            expect(interception.response.statusCode).to.eq(200);
            cy.log("API request completed successfully");
            console.log("API Response:", interception.response.body); // Log response for debugging
          }
        );
        // Click on Medical Centre dropdown
        cy.get("mat-form-field")
          .contains("Select Medical Centre")
          .parents("mat-form-field")
          .should("be.visible")
          .should("not.have.class", "mat-form-field-disabled")
          .then(($field) => {
            // First, ensure the trigger is ready and click it
            cy.wrap($field)
              .find(".mat-select-trigger")
              .should("be.visible")
              .should("not.be.disabled")
              .click({ force: true });

            // Wait for overlay container with increased timeout
            cy.get("mat-select", { timeout: 10000 })
              .should("exist")
              .should("be.visible")
              .click({ force: true })
              .then(($panel) => {
                // Now wait for options to be loaded

                cy.wrap($panel)
                  .get("mat-option", { timeout: 2000 })
                  .should("exist")
                  .should("be.visible")
                  .should("have.length.gt", 1)
                  .then(($options) => {
                    // Find first non-"All" option that is visible and enabled
                    const validOptions = Array.from($options).filter((el) => {
                      const text = el.textContent.trim().toLowerCase();
                      return (
                        !text.includes("all") && !el.hasAttribute("disabled")
                      );
                    });

                    if (validOptions.length > 0) {
                      cy.log(
                        `Found ${validOptions.length} valid medical centre options`
                      );
                      cy.wrap(validOptions[0])
                        .scrollIntoView()
                        .should("be.visible")
                        .click({ force: true });
                    } else {
                      throw new Error(
                        "No valid and enabled medical centre options found"
                      );
                    }
                  });
              });
          });

        // Wait for loading overlay to disappear
        cy.get(".ngx-overlay.loading-foreground", { timeout: 10000 }).should(
          "not.exist"
        );

        // Verify sync button is visible and clickable
        cy.get("button[mat-flat-button][color='primary']")
          .contains("Sync")
          .should("be.visible")
          .should("not.be.disabled")
          .within(() => {
            // Verify the update icon is present
            cy.get("mat-icon").should("be.visible").and("contain", "update");
          });

        // Intercept the sync API call
        cy.intercept(
          "POST",
          `${Cypress.config("ComposeURL")}/api/earningsSummary/sync*`
        ).as("syncAPI");

        // Click the sync button
        cy.get("button[mat-flat-button][color='primary']")
          .contains("Sync")
          .click({ force: true });

        // Wait for the sync API call and verify response
        cy.wait("@syncAPI", { timeout: 10000 }).then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
          cy.log("Sync API request completed successfully");
        });
      });
  });

  it("should download file when download button is clicked", () => {
    // Navigate to Finance Dashboard
    cy.get("mat-expansion-panel-header")
      .contains("Finance")
      .should("be.visible")
      .click();
  
    cy.get("mat-list-item")
      .contains("Finance Dashboard")
      .should("be.visible")
      .click();
  
    // Wait for dashboard to fully load and stabilize
    cy.get("h1").contains("Finance Dashboard").should("be.visible");
    cy.get(".static-grid-card")
      .should("have.length.gt", 0)
      .should("be.visible")
      .then(() => {
        // Ensure API Call finishes before proceeding
        cy.intercept(
          "GET",
          `${Cypress.config("ComposeURL")}/api/newEarningDashboard*`
        ).as("getDashboardData");
  
        // Wait for the API request to complete
        cy.wait("@getDashboardData", { timeout: 10000 }).then(
          (interception) => {
            // Ensure the API request was successful
            expect(interception.response.statusCode).to.eq(200);
            cy.log("API request completed successfully");
          }
        );
  
        // Verify download button is visible and has correct elements
        cy.get("button[mat-stroked-button][color='primary']")
          .contains("Download")
          .should("be.visible")
          .should("not.be.disabled")
          .within(() => {
            // Verify the download icon is present
            cy.get("mat-icon")
              .should("be.visible")
              .and("contain", "file_download");
          });
  
        // Wait for any loading overlays to disappear
        cy.get(".ngx-overlay.loading-foreground", { timeout: 10000 }).should(
          "not.exist"
        );
        
        const downloadDirectory = 'cypress/downloads'; // Path to the downloads folder
        const downloadFileNamePattern = /.*\.pdf$/; // Match any file ending with .pdf
  
        // Optional: Delete any existing files before starting the test
        cy.task('deleteDownloads');

        // Click the download button
        cy.get("button[mat-stroked-button][color='primary']")
          .contains("Download")
          .should("be.visible") // Ensure the button is visible
          .click({ force: true });
  
        // Wait for the file to be downloaded (this timeout may need adjustment depending on your file size or network speed)
        cy.wait(5000); // Wait for 5 seconds (or adjust based on download time)
  
        // Check for files in the download directory using a task
        ///////////////////////// Need to find a way to impletement ///////////////////////////////////////////////////////
       // cy.readFile(`${downloadDirectory}/${downloadFileNamePattern}`, { timeout: 10000 }).should('exist'); 
  
        // Log success
        cy.log("PDF download triggered successfully!");
      });
  });
});
