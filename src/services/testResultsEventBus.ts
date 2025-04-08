
// Event listeners for state updates
type TestResultsListener = () => void;
const listeners: TestResultsListener[] = [];

// Subscribe to test results changes
export const subscribeToTestResults = (listener: TestResultsListener) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

// Notify listeners of changes
export const notifyTestResultListeners = () => {
  console.log("Notifying listeners of test result changes");
  listeners.forEach(listener => listener());
};
