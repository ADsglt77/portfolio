import rawConfig from "../../site.config.json";
import type { SiteConfig } from "./types";

// site.config.json is type-checked against SiteConfig: a missing or misspelled
// key makes `bun run typecheck` fail.
export const config: SiteConfig = rawConfig;
