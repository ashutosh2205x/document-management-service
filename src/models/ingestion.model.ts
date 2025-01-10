import { DataTypes } from "sequelize";
import sequelize from "../configs/db";
import { User } from "../../shared/models/user.model";

export const Ingestion = sequelize.define("ingestion", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "in_progress", "completed", "failed"),
    defaultValue: "pending",
  },
  triggered_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Ingestion.belongsTo(User, { foreignKey: "triggered_by" });
User.hasMany(Ingestion, { foreignKey: "triggered_by" });
