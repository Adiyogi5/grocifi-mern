const cron = require("node-cron");

cron.schedule("0 0 * * *", async () => {
  try {
    

  } catch (error) {
    console.error("Error updating", error);
  }
});
    