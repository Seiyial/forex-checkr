const app = require("express")();
require("dotenv").config();

// ----------------------------------------------------

app.get("/", (req, res) => {
  res.send("Hi you can set forex levels with me!");
});

// ----------------------------------------------------

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("FixerIO API Key",
    `${process.env.FIXER_API_ACCESS_KEY} (OK)` || "(NOT PRESENT)");
  console.log("Listening on " + port);
});
