import { defineConfig } from 'vite';
// Deliberately local-only preview: inquiries are email drafts, with no API writes.
export default defineConfig({server:{host:'127.0.0.1'},preview:{host:'127.0.0.1'}});
