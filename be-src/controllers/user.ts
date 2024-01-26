import { CustomError, handleError } from "../custom-error.js";
import { getSHA256 } from "../lib/crypto.js";
import { Auth, User } from "../model/index.js";

function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password: string) {
  return password.length >= 8;
}

export async function createUser({ email, password }) {
  if (!email || !password) {
    throw new CustomError("Se requiere correo electrónico y contraseña.", 400);
  }
  if (!isValidEmail(email)) {
    throw new CustomError("Correo electrónico inválido.", 400);
  }
  if (!isValidPassword(password)) {
    throw new CustomError("Contraseña inválida.", 400);
  }

  try {
    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: { email },
    });

    const userId = user.get("id");
    const hashedPassword = getSHA256(password);

    await Auth.findOrCreate({
      where: { userId },
      defaults: { email, password: hashedPassword, userId },
    });

    return { created };
  } catch (error) {
    handleError(error, "Error al crear usuario.");
  }
}

export async function getUser({ userId }) {
  if (!userId) {
    throw new CustomError("Se requiere id de usuario.", 400);
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new CustomError("Usuario no encontrado.", 404);
    }

    return user;
  } catch (error) {
    handleError(error, "Error al obtener usuario.");
  }
}

export async function updateUser({ userId, fullname, location }) {
  if (!userId) {
    throw new CustomError("Se requiere id de usuario.", 400);
  }

  try {
    await User.update({ fullname, location }, { where: { id: userId } });
  } catch (error) {
    handleError(error, "Error al actualizar usuario.");
  }
}
