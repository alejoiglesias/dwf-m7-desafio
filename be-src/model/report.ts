import { DataTypes, Model } from "sequelize";

import { sequelize } from "./conn.js";

export class Report extends Model {}

Report.init(
  {
    reporter: {
      type: DataTypes.STRING,
    },
    phone_number: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "report",
  },
);
