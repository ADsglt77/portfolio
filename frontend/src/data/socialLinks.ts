import { iconGithub, iconLinkedin } from "./icons";

interface SocialLink {
	url: string;
	icon: string;
	label: string;
}

export const socialLinks: SocialLink[] = [
	{
		url: "https://www.linkedin.com/in/adrien-segalat",
		icon: iconLinkedin,
		label: "Visiter mon profil LinkedIn",
	},
	{
		url: "https://github.com/ADsglt77",
		icon: iconGithub,
		label: "Visiter mon profil GitHub",
	},
];
