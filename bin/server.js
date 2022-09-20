const app = require("../app");
const db = require("../model/db");

const PORT = process.env.PORT || 5055;

db.then(() => {
  try {
    app.listen(PORT, () => {
      console.log("Database connection successful");
    });
  } catch (err) {
    console.log("Server is not running");
  }
});
