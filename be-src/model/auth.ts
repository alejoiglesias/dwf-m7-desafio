import { DataTypes, Model } from "sequelize";

import { sequelize } from "./conn.js";

export class Auth extends Model {}

Auth.init(
  {
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "auth",
  },
);
