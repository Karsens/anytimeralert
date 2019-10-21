import { Debug } from "./import";

const Sequelize = require("sequelize");
require("dotenv").config();

/*
 *
 *
 *
 *
 *
 * -------------
 * 2) Connectors
 * --------------
 * Here I make a connection with the model.
 * For this I use an ORM called Sequelize.
 * This, in its turn, automatically creates or connects to a database.
 * I can choose what type of database.
 * In this case, I choose for SQLite, which is incredibly powerful.
 *
 *
 *
 *
 *
 *
 */

// initialize our database

const database = process.env.DB_NAME;
const user = process.env.DB_USER;
const host = process.env.DB_HOST;
const password = process.env.DB_PASS;
const dialect = "sqlite";

const sequelize = new Sequelize(database, user, password, {
  host,
  dialect,
  storage: "database.sqlite",
  logging: Debug.sql ? console.log : undefined,

  define: {
    charset: "utf8mb4",
    dialectOptions: { collate: "utf8mb4_unicode_ci" }
  }
});

sequelize
  .authenticate()
  .then(() => {
    if (Debug.sql) {
      console.log("Connection has been established successfully.");
    }
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

const Group = sequelize.define("group", {
  creator: { type: Sequelize.STRING },
  name: { type: Sequelize.STRING },
  password: { type: Sequelize.STRING }
});

const User = sequelize.define(
  "user",
  {
    phone: { type: Sequelize.STRING },
    name: { type: Sequelize.STRING },
    verified: { type: Sequelize.BOOLEAN },
    code: { type: Sequelize.STRING }
  }
  // { indexes: [ { fields: ["??"] } }
);

const Anytimer = sequelize.define("anytimer", {
  uid1: { type: Sequelize.INTEGER },
  uid2: { type: Sequelize.INTEGER },
  anytimers: { type: Sequelize.INTEGER }
});

const Subscription = sequelize.define("subscription", {
  uid: { type: Sequelize.INTEGER },
  gid: { type: Sequelize.INTEGER }
});

const syncDatabase = async () => {
  const id = process.env.pm_id;
  console.log(`id=${id}`);
  if (id == 0 || !id) {
    console.log("Start syncing");

    await Group.sync({ alter: true });
    await User.sync({ alter: true });
    await Anytimer.sync({ alter: true });
    await Subscription.sync({ alter: true });

    User.hasMany(Subscription, { foreignKey: "gid" });
    User.hasMany(Anytimer, { foreignKey: "uid1" });
    User.hasMany(Anytimer, { foreignKey: "uid2" });
  }
  return true;
};

const Model = {
  Group,
  User,
  Anytimer,
  Subscription
};

export { Model, syncDatabase };
