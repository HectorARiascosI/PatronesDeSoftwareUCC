import { vi } from 'vitest';

// Mock de URL.createObjectURL para tests
global.URL.createObjectURL = vi.fn((file) => `blob:${file.name}`);

import '@testing-library/jest-dom';
