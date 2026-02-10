import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['**/tests/vitest/**/*.spec.js'],
        globals: true, // This allows using describe, it, expect without importing them
        // coverage: {
        //   reporter: ['text', 'json', 'html'],
        // },
    },
});
