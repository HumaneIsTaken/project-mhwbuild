const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());

// Routes set up
const apiOverview = require("./routes/overview");
const apiItems = require("./routes/items");
const apiSkills = require("./routes/skills");

app.use(express.static("public"));

app.use("/api/overview", apiOverview);
app.use("/api/items", apiItems);
app.use("/api/skills", apiSkills);

app.listen(4300, () => {
  console.log(`Server started on port 4300`);
});
