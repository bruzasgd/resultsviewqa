
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UploadRecord {
  id: string;
  filename: string;
  timestamp: Date;
  fileSize: string;
  contentHash: string;
}

interface UploadHistoryState {
  uploads: UploadRecord[];
  addUpload: (upload: Omit<UploadRecord, 'id' | 'timestamp'>) => void;
  getUploadByHash: (hash: string) => UploadRecord | undefined;
  removeUpload: (id: string) => void;
  clearAllUploads: () => void;
}

// Custom storage handler to ensure proper Date object serialization/deserialization
const customStorage = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    
    const parsed = JSON.parse(str);
    
    // Convert timestamp strings back to Date objects
    if (parsed.state && parsed.state.uploads) {
      parsed.state.uploads = parsed.state.uploads.map((upload: any) => ({
        ...upload,
        timestamp: new Date(upload.timestamp)
      }));
    }
    
    return JSON.stringify(parsed);
  },
  setItem: (name: string, value: string) => {
    localStorage.setItem(name, value);
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  }
};

export const useUploadHistory = create<UploadHistoryState>()(
  persist(
    (set, get) => ({
      uploads: [],
      addUpload: (upload) => {
        const newUpload: UploadRecord = {
          ...upload,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        };
        set((state) => ({
          uploads: [newUpload, ...state.uploads]
        }));
      },
      getUploadByHash: (hash) => {
        return get().uploads.find(upload => upload.contentHash === hash);
      },
      removeUpload: (id) => {
        set((state) => ({
          uploads: state.uploads.filter(upload => upload.id !== id)
        }));
      },
      clearAllUploads: () => {
        set({ uploads: [] });
      }
    }),
    {
      name: 'test-upload-history',
      skipHydration: false,
      storage: customStorage
    }
  )
);

export const generateContentHash = async (content: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
};
