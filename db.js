const Sequelize = require("sequelize");
const pg = require("pg");

const { UUID, UUIDV4, STRING, DECIMAL } = Sequelize;

const uuidDefinition = {
  type: UUID,
  primaryKey: true,
  defaultValue: UUIDV4
};

const conn = new Sequelize(
  process.env.DATABASE || "postgres:localhost:/acme_product_offerings_api"
);

const Product = conn.define("product", {
  id: uuidDefinition,
  name: {
    type: STRING,
    unique: true,
    allowNull: false
  },
  suggestedPrice: {
    type: DECIMAL,
    allowNull: false
  }
});

const Company = conn.define("company", {
  id: uuidDefinition,
  name: {
    type: STRING,
    unique: true,
    allowNull: false
  }
});

const Offering = conn.define("offering", {
  price: {
    type: DECIMAL,
    allowNull: false
  }
});

Offering.belongsTo(Company);
Offering.belongsTo(Product);
Company.hasMany(Offering);
Product.hasMany(Offering);

const sync = async () => {
  await conn.sync({ force: true });

  const [Apple, Samsung, LG] = await Promise.all([
    Company.create({ name: "apple" }),
    Company.create({ name: "samsung" }),
    Company.create({ name: "lg" })
  ]);

  const [Laptop, Phone, Watch] = await Promise.all([
    Product.create({ name: "laptop", suggestedPrice: 5 }),
    Product.create({ name: "phone", suggestedPrice: 10 }),
    Product.create({ name: "watch", suggestedPrice: 15 })
  ]);

  const [Offering1, Offering2, Offering3] = await Promise.all([
    Offering.create({ price: 6, productId: Laptop.id, companyId: Apple.id }),
    Offering.create({ price: 11, productId: Phone.id, companyId: Samsung.id }),
    Offering.create({ price: 16, productId: Watch.id, companyId: LG.id })
  ]);

  const otherOffering = await Offering.create({ price: 1 });
  await otherOffering.setCompany(Apple);
  await otherOffering.setProduct(Watch);
};

module.exports = {
  sync,
  models: {
    Product,
    Company,
    Offering
  }
};
