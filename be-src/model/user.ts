import { DataTypes, Model } from "sequelize";

import { sequelize } from "./conn.js";

export class User extends Model {}

User.init(
  {
    email: {
      type: DataTypes.STRING,
    },
    fullname: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "user",
  },
);
