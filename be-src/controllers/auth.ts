import jsonwebtoken from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

import { CustomError, handleError } from "../custom-error.js";
import { getSHA256 } from "../lib/crypto.js";
import { Auth } from "../model/index.js";

const { sign, verify } = jsonwebtoken;

export async function createAuthToken({ email, password }) {
  if (!email || !password) {
    throw new CustomError("Se requiere correo electrónico y contraseña.", 400);
  }

  try {
    const hashedPassword = getSHA256(password);

    const auth = await Auth.findOne({
      where: { email, password: hashedPassword },
    });

    if (!auth) {
      throw new CustomError(
        "Correo electrónico o contraseña incorrectos.",
        400,
      );
    }

    const userId = auth.get("userId");
    const token = sign({ id: userId }, process.env.SECRET);
    return token;
  } catch (error) {
    handleError(error, "Error al crear token de autenticación.");
  }
}

export function verifyToken(token: string) {
  if (!token) {
    throw new CustomError("Se requiere token.", 400);
  }

  try {
    const decoded = verify(token, process.env.SECRET) as JwtPayload;
    const userId = decoded.id;
    return userId;
  } catch (error) {
    throw new CustomError("Token inválido.", 400);
  }
}

export async function createPasswordRecoveryToken(email: string) {
  if (!email) {
    throw new CustomError("Se requiere correo electrónico.", 400);
  }

  try {
    const auth = await Auth.findOne({ where: { email } });

    if (!auth) {
      throw new CustomError("Correo electrónico no registrado.", 400);
    }

    const userId = auth.get("userId");
    const token = sign({ id: userId }, process.env.SECRET, { expiresIn: "1h" });
    return token;
  } catch (error) {
    handleError(error, "Error al crear token de recuperación.");
  }
}

export async function changePassword({ userId, password }) {
  if (!userId || !password) {
    throw new CustomError("Se requiere id de usuario y contraseña.", 400);
  }

  try {
    const user = await Auth.findByPk(userId);

    if (!user) {
      throw new CustomError("Usuario no encontrado.", 400);
    }

    const hashedPassword = getSHA256(password);
    user.set({ password: hashedPassword });
    await user.save();
  } catch (error) {
    handleError(error, "Error al cambiar contraseña.");
  }
}
