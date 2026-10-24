import { config } from "../config";
import type { Technology } from "../config/types";

export function resolveTechnologies(keys: string[]): Technology[] {
	return keys
		.map((key) => config.techMap[key.toLowerCase()])
		.filter((tech): tech is Technology => tech !== undefined);
}

export const technologiesList = resolveTechnologies(config.technologiesBanner);
