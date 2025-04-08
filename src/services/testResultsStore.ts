
import { ParsedTestResult } from "@/lib/xmlParser";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store to handle test results with persistence
interface TestResultsState {
  results: ParsedTestResult[];
  addResults: (newResults: ParsedTestResult[]) => void;
  removeResultsByUploadId: (uploadId: string) => void;
  clearAllResults: () => void;
}

export const useTestResults = create<TestResultsState>()(
  persist(
    (set) => ({
      results: [],
      addResults: (newResults) => {
        set((state) => ({
          results: [...newResults, ...state.results]
        }));
      },
      removeResultsByUploadId: (uploadId) => {
        set((state) => ({
          results: state.results.filter(result => result.uploadId !== uploadId)
        }));
      },
      clearAllResults: () => {
        set({ results: [] });
      }
    }),
    {
      name: 'test-results-storage',
      skipHydration: false,
    }
  )
);
