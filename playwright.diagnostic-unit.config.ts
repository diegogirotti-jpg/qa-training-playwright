import { defineConfig } from "@playwright/test";
export default defineConfig({ testDir: "./diagnostics/unit", reporter: "line", workers: 1 });
