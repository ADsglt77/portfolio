import { treaty } from "@elysiajs/eden";
import type { App } from "../../../backend/src/index";

const client = treaty<App>("localhost:3000");
export default client;
