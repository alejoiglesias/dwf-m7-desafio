import algoliasearch from "algoliasearch";

const client = algoliasearch("KQH5ZHVM0F", process.env.ALGOLIA_ADMIN_KEY);
const index = client.initIndex("Pets");

export async function algoliaSearchPets() {
  try {
    const { hits } = await index.search("lost", {});

    return hits;
  } catch (error) {
    throw new Error("Error al buscar mascotas.");
  }
}

export async function algoliaSearchPetsAroundLocation({ lat, lng }) {
  try {
    const { hits } = await index.search("lost", {
      aroundLatLng: `${lat}, ${lng}`,
      aroundRadius: 100000,
    });

    return hits;
  } catch (error) {
    throw new Error("Error al buscar mascotas.");
  }
}

export async function algoliaSavePet({
  objectID,
  name,
  photo_url,
  location,
  longitude,
  latitude,
  status,
  userId,
}) {
  try {
    await index.saveObject({
      objectID,
      name,
      photo_url,
      location,
      _geoloc: {
        lat: latitude,
        lng: longitude,
      },
      userId,
      status,
    });
  } catch (error) {
    throw new Error("Error al guardar mascota.");
  }
}

export async function algoliaUpdatePetLocation({
  objectID,
  location,
  longitude,
  latitude,
}) {
  try {
    await index.partialUpdateObject({
      objectID,
      location,
      __geoloc: {
        lat: latitude,
        lng: longitude,
      },
    });
  } catch (error) {
    throw new Error("Error al actualizar ubicación de mascota.");
  }
}

export async function algoliaUpdatePetStatus({ objectID, status }) {
  try {
    await index.partialUpdateObject({ objectID, status });
  } catch (error) {
    throw new Error("Error al actualizar estado de mascota.");
  }
}

export async function algoliaDeletePet(objectID: string) {
  try {
    await index.deleteObject(objectID);
  } catch (error) {
    throw new Error("Error al eliminar mascota.");
  }
}
