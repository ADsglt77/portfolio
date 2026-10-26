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
		jobTitle: string;
		locale: string;
		keywords: string[];
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
		eyebrow: string;
		tagline: string;
		primaryCta: { label: string; href: string };
		secondaryCta: { label: string; href: string };
		scrollLabel: string;
		loadingLabel: string;
		enterLabel: string;
		skipIntroLabel: string;
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
		eyebrow: string;
		intro: string;
		alternativeLabel: string;
		linkedinLabel: string;
		image: { src: string; alt: string };
		form: {
			name: FieldLabels;
			email: FieldLabels & { errorInvalid: string };
			subject: FieldLabels;
			message: FieldLabels;
			captcha: { required: string; failed: string; loadError: string };
			submitLabel: string;
			submittingLabel: string;
			successMessage: string;
			errorMessage: string;
		};
	};
	footer: {
		name: string;
		template: string;
	};
	nav: {
		label: string;
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
	timelineSection: {
		eyebrow: string;
		title: string;
		intro: string;
		showAllLabel: string;
		showLessLabel: string;
		featuredCount: number;
	};
	timeline: TimelineItem[];
	projects: {
		eyebrow: string;
		title: string;
		navigationLabel: string;
		previousLabel: string;
		nextLabel: string;
		swipeHint: string;
		projectLabelTemplate: string;
		/** Button that opens a project's detail sheet. */
		detailsLabel: string;
		/** Accessible name of the sheet's close button. */
		closeLabel: string;
		noMediaLabel: string;
		posterAltTemplate: string;
		/** Accessible name of a banner technology leading to a project using it. */
		techLinkTemplate: string;
		ariaLabels: Required<ProjectLinks>;
		items: ProjectItem[];
	};
}
