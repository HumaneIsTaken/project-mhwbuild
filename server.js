const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());

// Routes set up
const apiOverview = require("./routes/overview");

app.use("/api/overview", apiOverview);

app.listen(4300, () => {
  console.log(`Server started on port 4300`);
});