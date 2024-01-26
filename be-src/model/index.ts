import { Auth } from "./auth.js";
import { Pet } from "./pet.js";
import { Report } from "./report.js";
import { User } from "./user.js";

User.hasOne(Auth);

User.hasMany(Pet);
Pet.belongsTo(User);

Report.hasMany(Pet);
Pet.belongsTo(Report);

export { Auth, Pet, Report, User };
