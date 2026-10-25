export interface Technology {
	icon: string;
	label: string;
}

export interface SocialLink {
	url: string;
	icon: string;
	label: string;
}

export interface TimelineItem {
	date: string;
	organization: string;
	role?: string;
	description?: string;
	/** "formation" or "work" */
	type: string;
}

export interface ProjectLinks {
	readmePdf?: string;
	website?: string;
	github?: string;
}

export interface ProjectItem {
	id: string;
	title: string;
	description: string;
	technologies: string[];
	links: ProjectLinks;
	video?: string;
	poster?: string;
}

interface FieldLabels {
	label: string;
	placeholder: string;
	error: string;
}

export interface SiteConfig {
	site: {
		name: string;
		title: string;
		description: string;
		lang: string;
		themeColor: string;
		url: string;
		/** Link preview image (og:image), relative to `url`. */
		image: string;
	};
	theme: {
		colors: {
			bg: string;
			text: string;
			muted: string;
			success: string;
			error: string;
		};
		fonts: {
			title: string;
			mono: string;
			googleFontsUrl: string;
		};
	};
	hero: {
		displayName: string;
		scrollLabel: string;
		loadingLabel: string;
		enterLabel: string;
		backgroundImage: string;
		ambientSound: string;
	};
	about: {
		title: string;
		paragraph: string;
		cv: { label: string; path: string; filename: string };
		image: { src: string; alt: string };
	};
	contact: {
		title: string;
		image: { src: string; alt: string };
		form: {
			name: FieldLabels;
			email: FieldLabels & { errorInvalid: string };
			subject: FieldLabels;
			message: FieldLabels;
			captcha: { required: string; failed: string; loadError: string };
			submitLabel: string;
			submittingLabel: string;
		};
	};
	footer: {
		name: string;
		template: string;
	};
	nav: {
		/** Accessible name of the mobile menu button. */
		menuLabel: string;
		links: Array<{ href: string; label: string }>;
		settings: {
			/** Accessible name of the settings button. */
			label: string;
			soundLabel: string;
			animationsLabel: string;
		};
	};
	social: SocialLink[];
	techMap: Record<string, Technology>;
	technologiesBanner: string[];
	timeline: TimelineItem[];
	projects: {
		/** Button that opens a project's detail sheet. */
		detailsLabel: string;
		/** Accessible name of the sheet's close button. */
		closeLabel: string;
		noMediaLabel: string;
		posterAltTemplate: string;
		ariaLabels: Required<ProjectLinks>;
		items: ProjectItem[];
	};
}
