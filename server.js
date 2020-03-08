const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
const db = require("./db");
const { Company, Product, Offering } = db.models;

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/products", (req, res, next) => {
  Product.findAll()
    .then(products => res.send(products))
    .catch(next);
});

app.get("/api/companies", (req, res, next) => {
  Company.findAll()
    .then(companies => res.send(companies))
    .catch(next);
});

app.get("/api/offerings", (req, res, next) => {
  Offering.findAll()
    .then(offerings => res.send(offerings))
    .catch(next);
});

const port = process.env.PORT || 3000;
db.sync().then(() => {
  app.listen(port, () => console.log(`listening on port${port}`));
});
