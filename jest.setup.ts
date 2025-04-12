// Polyfill Web Streams API (ReadableStream, etc.) for Node/Jest
import 'web-streams-polyfill/polyfill'

// Polyfill fetch, Request, Response, Headers in jsdom
import 'whatwg-fetch'

// Add custom matchers from Testing Library
import '@testing-library/jest-dom'
