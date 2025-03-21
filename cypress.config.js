const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Get browser name from environment variable or default to "default"
      const browserName = process.env.BROWSER || "default";

      // Generate a unique folder for the current browser
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-"); // Avoid invalid folder characters
      const videoFolder = `cypress/videos/${browserName}-${timestamp}`;

      // Ensure the folder exists
      on("before:run", () => {
        if (!fs.existsSync(videoFolder)) {
          fs.mkdirSync(videoFolder, { recursive: true });
          console.log(`Created video folder: ${videoFolder}`);
        }
      });

      // Dynamically assign the video folder path to the config
      config.videoFolder = videoFolder;

      console.log(`Videos will be saved in: ${videoFolder}`);

      // Register the deleteDownloads task
      on("task", {
        checkPdfDownload({ downloadDirectory, pattern }) {
          console.log("Checking for PDF download"); 
          if (!fs.existsSync(downloadDirectory)) {
            fs.mkdirSync(downloadDirectory, { recursive: true });
            return [];
          }
           const files = fs.readdirSync(downloadDirectory);
           const matchingFiles = files.filter((file) => pattern.test(file));
          console.log(matchingFiles);
          console.log(files);
         // If there's at least one match, return true
          if (matchingFiles.length > 0) {
            return true;
          }
          return false; // No matching file found
      
        },

        // Optionally: Task to delete files from the download folder
        deleteDownloads() {
          const downloadFolder = path.join(__dirname, "cypress", "downloads");
          const files = fs.readdirSync(downloadFolder);

          // Delete all files in the download folder
          files.forEach((file) => {
            const filePath = path.join(downloadFolder, file);
            if (fs.lstatSync(filePath).isFile()) {
              fs.unlinkSync(filePath); // Remove the file
            }
          });

          return null; // Return null as task result
        },
      });

      return config;
    },
    specPattern: "cypress/e2e/**/*.cy.js",
    baseUrl: "https://admin.mediportal.com.au",
    ComposeURL: "https://compose.mediportal.com.au",
    video: true,
    screenshotOnRunFailure: true,
  },
});
