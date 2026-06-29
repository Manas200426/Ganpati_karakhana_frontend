import api from "./axios";

export const uploadMurtiPhoto = async (murtiItemId, file) => {
  if (!file) {
    throw new Error("Photo is required");
} 
  const formData = new FormData();

  formData.append("photos", file);

  const response = await api.post(
    `/photos/${murtiItemId}`,
    formData
  );

  return response.data.data;
};

export const getMurtiPhotos = async (murtiItemId) => {
  const response = await api.get(`/photos/${murtiItemId}`);

  return response.data.data;
};

export const deleteMurtiPhoto = async (photoId) => {
  await api.delete(`/photos/${photoId}`);
};

export const setPrimaryPhoto = async (photoId) => {
  const response = await api.patch(`/photos/${photoId}/primary`);

  return response.data.data;
};