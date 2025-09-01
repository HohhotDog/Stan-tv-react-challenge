// src/setupTests.ts
// Add jest-dom matchers like "toBeInTheDocument"
import '@testing-library/jest-dom';

// Polyfill fetch for jsdom so global.fetch exists in tests
import 'whatwg-fetch';