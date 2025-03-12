import { create } from 'zustand';

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
}

export const useUploadHistory = create<UploadHistoryState>((set, get) => ({
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
  }
}));

export const generateContentHash = async (content: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
};