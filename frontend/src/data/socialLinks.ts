import { config } from "../config";

export interface SocialLink {
	url: string;
	icon: string;
	label: string;
}

export const socialLinks: SocialLink[] = config.social;
