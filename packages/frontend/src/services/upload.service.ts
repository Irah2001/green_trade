import { apiFetch } from './api';

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await apiFetch<{ imageUrl: string }>('/api/upload', {
      method: 'POST',
      body: formData,
    });

    return response.imageUrl;
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    throw new Error("Impossible d'uploader l'image");
  }
};