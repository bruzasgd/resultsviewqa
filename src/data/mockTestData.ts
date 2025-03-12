
interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'flaky';
  duration: string;
  timestamp: string;
  framework: string;
  browser: string;
  errorMessage?: string;
}

export const mockTestData: TestResult[] = [
  {
    id: '1',
    name: 'User Login Authentication',
    status: 'passed',
    duration: '2.5s',
    timestamp: '2023-07-01 14:32:15',
    framework: 'Playwright',
    browser: 'Chrome'
  },
  {
    id: '2',
    name: 'Product Search Functionality',
    status: 'failed',
    duration: '3.8s',
    timestamp: '2023-07-01 14:35:22',
    framework: 'Playwright',
    browser: 'Firefox',
    errorMessage: 'Element not found: .search-results'
  },
  {
    id: '3',
    name: 'Shopping Cart Checkout',
    status: 'passed',
    duration: '5.1s',
    timestamp: '2023-07-01 14:40:05',
    framework: 'Cypress',
    browser: 'Chrome'
  },
  {
    id: '4',
    name: 'User Profile Update',
    status: 'flaky',
    duration: '2.9s',
    timestamp: '2023-07-01 15:02:33',
    framework: 'Cypress',
    browser: 'Edge'
  },
  {
    id: '5',
    name: 'Payment Processing',
    status: 'failed',
    duration: '4.7s',
    timestamp: '2023-07-01 15:10:18',
    framework: 'Playwright',
    browser: 'Safari',
    errorMessage: 'Timeout waiting for API response'
  },
  {
    id: '6',
    name: 'Product Image Gallery',
    status: 'passed',
    duration: '1.8s',
    timestamp: '2023-07-01 15:15:44',
    framework: 'Cypress',
    browser: 'Chrome'
  },
  {
    id: '7',
    name: 'Newsletter Subscription',
    status: 'passed',
    duration: '1.5s',
    timestamp: '2023-07-01 15:20:12',
    framework: 'Playwright',
    browser: 'Chrome'
  },
  {
    id: '8',
    name: 'User Registration Form',
    status: 'failed',
    duration: '3.2s',
    timestamp: '2023-07-01 15:25:09',
    framework: 'Cypress',
    browser: 'Firefox',
    errorMessage: 'Validation error: email field format invalid'
  },
  {
    id: '9',
    name: 'Product Filtering',
    status: 'passed',
    duration: '2.3s',
    timestamp: '2023-07-01 15:30:55',
    framework: 'Playwright',
    browser: 'Chrome'
  },
  {
    id: '10',
    name: 'Responsive Layout Tests',
    status: 'flaky',
    duration: '6.5s',
    timestamp: '2023-07-01 15:40:22',
    framework: 'Cypress',
    browser: 'Chrome'
  }
];
