export interface PresetBusinessConfig {
	title: string;
	content_type?: string;
	content: Record<string, unknown> | unknown[] | string;
}

export const SYSTEM_CONFIG_PRESET: Record<string, PresetBusinessConfig> = {
} as const;
