import cors from "cors";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import path from "node:path";
import { dirname } from "path";
import { fileURLToPath } from "url";

import {
  changePassword,
  createAuthToken,
  createPasswordRecoveryToken,
  verifyToken,
} from "./controllers/auth.js";
import {
  deletePet,
  getUserPets,
  newLostPet,
  updateLostPet,
  updatePetStatus,
} from "./controllers/pet.js";
import { createUser, getUser, updateUser } from "./controllers/user.js";
import {
  algoliaDeletePet,
  algoliaSavePet,
  algoliaSearchPets,
  algoliaSearchPetsAroundLocation,
  algoliaUpdatePetLocation,
  algoliaUpdatePetStatus,
} from "./lib/algolia.js";
import { uploadPhoto } from "./lib/cloudunary.js";
import { sendRecoveryPasswordEmail, sendReportEmail } from "./lib/resend.js";
import "./sync.js";

const cooldownMap = new Map();
const __dirname = dirname(fileURLToPath(import.meta.url));
const staticDirPath = path.resolve(__dirname, "../fe-dist/", "index.html");

const app = express();
app.use(cors());
app.use(express.static("fe-dist"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

function cooldownMiddleware(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;
  const cooldownDuration = 15 * 60 * 1000;

  if (cooldownMap.has(email)) {
    const elapsedTime = Date.now() - cooldownMap.get(email);

    if (elapsedTime < cooldownDuration) {
      return res.status(429).json({ error: "Esperá 15 minutos." });
    }
  }

  next();
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.get("Authorization")?.split(" ")[1];

  try {
    const data = verifyToken(token);
    req.body.userId = data;
    next();
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

app.post("/api/auth", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { created } = await createUser({ email, password });

    if (created) {
      const token = await createAuthToken({ email, password });
      res.status(201).json({ token });
    } else {
      res.status(200).json({ message: "Usuario ya existe." });
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

app.post("/api/auth/token", async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await createAuthToken({ email, password });
    res.status(201).json({ token });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

app.post("/api/auth/recovery", cooldownMiddleware, async (req, res) => {
  const { email } = req.body;

  try {
    const token = await createPasswordRecoveryToken(email);

    await sendRecoveryPasswordEmail({ email, token });
    cooldownMap.set(email, Date.now());

    res.status(200).json({ message: "Correo de recuperación enviado." });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

app.put("/api/auth/password", async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;

  try {
    const userId = verifyToken(token as string);
    await changePassword({ userId, password });

    res.status(200).json({ message: "Contraseña cambiada exitosamente." });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

app.get("/api/users/me", authMiddleware, async (req, res) => {
  const { userId } = req.body;

  try {
    const data = await getUser({ userId });
    res.status(200).json(data);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

app.post("/api/users/me", authMiddleware, async (req, res) => {
  const { userId, fullname, location } = req.body;

  try {
    await updateUser({ userId, fullname, location });
    res.status(200).json({ message: "Perfil actualizado." });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

app.put("/api/users/me/password", authMiddleware, async (req, res) => {
  const { userId, password } = req.body;

  try {
    await changePassword({ userId, password });
    res.status(200).json({ message: "Contraseña cambiada exitosamente." });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

app.get("/api/users/me/pets", authMiddleware, async (req, res) => {
  const { userId } = req.body;

  try {
    const data = await getUserPets(userId);
    res.status(200).json(data);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

app.post("/api/users/me/pets", authMiddleware, async (req, res) => {
  const { userId, name, location, latitude, longitude, dataURL } = req.body;

  try {
    const photo_url = await uploadPhoto(dataURL);

    const petId = await newLostPet({
      name,
      photo_url,
      location,
      longitude,
      latitude,
      userId,
    });

    await algoliaSavePet({
      objectID: petId,
      name,
      photo_url,
      location,
      longitude,
      latitude,
      status: "lost",
      userId,
    });

    res.status(200).json({ message: "Mascota reportada." });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

app.put("/api/users/me/pets/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { userId, name, location, latitude, longitude, dataURL } = req.body;

  try {
    const photo_url = await uploadPhoto(dataURL);
    await updateLostPet({
      id,
      name,
      photo_url,
      location,
      longitude,
      latitude,
      userId,
    });

    await algoliaUpdatePetLocation({
      objectID: id,
      location,
      latitude,
      longitude,
    });

    res.status(200).json({ message: "Mascota actualizada." });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

app.patch("/api/users/me/pets/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { userId, status } = req.body;

  try {
    await updatePetStatus({ id, status, userId });
    await algoliaUpdatePetStatus({ objectID: id, status });

    res.status(200).json({ message: "Estado de mascota actualizado." });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

app.delete("/api/users/me/pets/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    await deletePet({ id, userId });
    await algoliaDeletePet(id);

    res.status(200).json({ message: "Mascota eliminada." });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

app.get("/api/pets", async (req, res) => {
  try {
    const data = await algoliaSearchPets();
    res.status(200).json(data);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

app.get("/api/pets/around", async (req, res) => {
  const { lat, lng } = req.query;

  try {
    const data = await algoliaSearchPetsAroundLocation({ lat, lng });
    res.status(200).json(data);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

app.post("/api/report", async (req, res) => {
  const { name, phone, message, userId } = req.body;

  try {
    const user = await getUser({ userId });
    const email = user.dataValues.email;

    const data = await sendReportEmail({ name, phone, message, email });
    res.status(200).json(data);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(staticDirPath);
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
