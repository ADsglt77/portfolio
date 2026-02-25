import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { contactController } from "./modules/contact";

const app = new Elysia()
	.use(
		cors({
			origin: true,
			methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.use(contactController)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
