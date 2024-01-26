import { DataTypes, Model } from "sequelize";

import { sequelize } from "./conn.js";

export class Pet extends Model {}

Pet.init(
  {
    name: {
      type: DataTypes.STRING,
    },
    photo_url: {
      type: DataTypes.STRING,
    },
    last_location: {
      type: DataTypes.STRING,
    },
    last_location_lng: {
      type: DataTypes.STRING,
    },
    last_location_lat: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("lost", "found"),
    },
  },
  {
    sequelize,
    modelName: "pet",
  },
);
