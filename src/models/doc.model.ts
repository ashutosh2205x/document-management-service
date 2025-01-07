import sequelize from "../configs/db";
import { User } from "../../auth-service/src/models/user.model";
import { DataTypes } from "sequelize";

export const Document = sequelize.define("documents", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  file_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false,
  },

});

Document.belongsTo(User, { foreignKey: "id" });
User.hasMany(Document, { foreignKey: "id" });
