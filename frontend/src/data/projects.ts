import { config } from "../config";
import type { ProjectItem, Technology } from "../config/types";
import { resolveTechnologies } from "./technologies";

export type Project = Omit<ProjectItem, "technologies"> & {
	technologies: Technology[];
};

export const projects: Project[] = config.projects.items.map((item) => ({
	...item,
	technologies: resolveTechnologies(item.technologies),
}));
