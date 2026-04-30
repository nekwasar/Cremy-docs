import { create } from 'zustand';

interface StoredImage {
  id: string;
  fileName: string;
  base64: string;
  placement: string;
  altText: string;
  creditCost: number;
  size: number;
  width?: number;
  height?: number;
}

interface ImageState {
  images: StoredImage[];
  isUploading: boolean;
  uploadProgress: number;
  maxReached: boolean;
  insufficientCredits: boolean;
  addImage: (image: StoredImage) => void;
  removeImage: (id: string) => void;
  replaceImage: (oldId: string, newImage: StoredImage) => void;
  clearImages: () => void;
  setUploading: (uploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  getImageCount: () => number;
  getTotalCredits: () => number;
}

export const useImageStore = create<ImageState>((set, get) => ({
  images: [],
  isUploading: false,
  uploadProgress: 0,
  maxReached: false,
  insufficientCredits: false,

  addImage: (image) =>
    set((state) => {
      if (state.images.length >= 5) {
        return { maxReached: true };
      }
      return {
        images: [...state.images, image],
        maxReached: state.images.length + 1 >= 5,
      };
    }),

  removeImage: (id) =>
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
      maxReached: false,
    })),

  replaceImage: (oldId, newImage) =>
    set((state) => ({
      images: state.images.map((img) => (img.id === oldId ? newImage : img)),
    })),

  clearImages: () =>
    set({ images: [], maxReached: false, insufficientCredits: false }),

  setUploading: (uploading) => set({ isUploading: uploading }),

  setUploadProgress: (progress) => set({ uploadProgress: progress }),

  getImageCount: () => get().images.length,

  getTotalCredits: () => get().images.reduce((sum, img) => sum + img.creditCost, 0),
}));