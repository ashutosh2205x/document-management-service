import { Sequelize } from "sequelize";
require("dotenv").config();

console.log("DB_NAME: ", process.env.DB_NAME);
console.log("DB_USER: ", process.env.DB_USER);
console.log("DB_PASSWORD: ", process.env.DB_PASSWORD);

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  port: 5433,
});

export default sequelize;
