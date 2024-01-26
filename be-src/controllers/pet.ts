import { CustomError, handleError } from "../custom-error.js";
import { Pet } from "../model/index.js";

export async function getUserPets(userId: number) {
  if (!userId) {
    throw new CustomError("Se requiere id de usuario.", 400);
  }

  try {
    const pets = await Pet.findAll({ where: { userId } });
    return pets;
  } catch (error) {
    handleError(error, "Error al obtener mascotas.");
  }
}

export async function newLostPet({
  name,
  photo_url,
  location,
  longitude,
  latitude,
  userId,
}) {
  if (!name || !photo_url || !location || !longitude || !latitude) {
    throw new CustomError("Se requiere nombre, foto y ubicación.", 400);
  }

  try {
    const pet = await Pet.create({
      name,
      photo_url,
      last_location: location,
      last_location_lng: longitude,
      last_location_lat: latitude,
      status: "lost",
      userId,
    });

    const petId = pet.get("id");
    return petId;
  } catch (error) {
    handleError(error, "Error al crear mascota.");
  }
}

export async function updateLostPet({
  id,
  name,
  photo_url,
  location,
  longitude,
  latitude,
  userId,
}) {
  if (!name || !photo_url || !longitude || !latitude) {
    throw new CustomError("Se requiere nombre, foto y ubicación.", 400);
  }
  if (!id) {
    throw new CustomError("Se requiere id de mascota.", 400);
  }

  try {
    await Pet.update(
      {
        name,
        photo_url,
        last_location: location,
        last_location_lng: longitude,
        last_location_lat: latitude,
        status: "lost",
      },
      { where: { userId, id } },
    );
  } catch (error) {
    handleError(error, "Error al actualizar mascota.");
  }
}

export async function updatePetStatus({ id, status, userId }) {
  if (!id) {
    throw new CustomError("Se requiere id de mascota.", 400);
  }
  if (!status) {
    throw new CustomError("Se requiere estado de mascota.", 400);
  }

  try {
    await Pet.update({ status }, { where: { userId, id } });
  } catch (error) {
    handleError(error, "Error al actualizar estado de mascota.");
  }
}

export async function deletePet({ id, userId }) {
  if (!id) {
    throw new CustomError("Se requiere id de mascota.", 400);
  }

  try {
    await Pet.destroy({ where: { userId, id } });
  } catch (error) {
    handleError(error, "Error al eliminar mascota.");
  }
}
