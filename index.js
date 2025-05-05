const express = require("express");
const { connectToDb } = require("./db");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Sample route
app.get("/", (req, res) => res.send("CrediKhaata API Running"));

app.use("/api/auth", require("./routes/auth"));
app.use("/customers", require("./routes/customers"));
app.use("/loans", require("./routes/loans"));

connectToDb().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
