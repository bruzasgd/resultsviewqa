# Test Results Visualization Dashboard

A modern web application for visualizing and analyzing test results from various testing frameworks. This dashboard provides insights into test execution results, helping teams identify patterns, track success rates, and manage test reports effectively.

## Features

- 📊 Interactive charts and visualizations
- 🔄 Real-time test result parsing
- 🎭 Support for Playwright and Cypress test reports
- 📱 Responsive design for desktop and mobile
- 📈 Test analytics and insights
- 🔍 Detailed test case information

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```sh
git clone <repository-url>
cd resultsviewqa
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

The application will be available at http://localhost:8081

## Usage

### Uploading Test Reports

The dashboard accepts XML test reports from:
- Playwright
- Cypress
- Other JUnit-compatible test frameworks

Test reports should follow the standard XML format with test suites and test cases. The system automatically detects the testing framework and parses the results accordingly.

### Supported XML Format

Your XML test report should include:
- `<testsuites>` as the root element
- Individual `<testsuite>` elements
- `<testcase>` elements with attributes:
  - `name`: Test case name
  - `time`: Test duration
  - `status`: Test status
  - Optional `failure` or `error` elements for failed tests

### Analyzing Results

The dashboard provides:
1. Success rate visualization
2. Test execution duration analysis
3. Failure patterns identification
4. Browser and framework-specific insights
5. Detailed error messages for failed tests

## API Documentation

The application provides RESTful APIs for managing test results:

- `GET /api/results` - Retrieve test results
- `POST /api/upload` - Upload new test reports

For detailed API documentation, visit the API Documentation section in the dashboard.

## Contributing

Contributions are welcome! Please feel free to submit pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the development team.
