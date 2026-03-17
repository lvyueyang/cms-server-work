import { TOKEN_KEY } from "@/constants";

const PUBLIC_PATH_PATTERNS = [
	/^\/login\/?$/,
	/^\/nopassword\/?$/,
	/^\/init-root-user\/?$/,
	/^\/audit-report\/[^/]+\/?$/,
] as const;

export function getAuthToken() {
	return localStorage.getItem(TOKEN_KEY);
}

export function clearAuthToken() {
	localStorage.removeItem(TOKEN_KEY);
}

export function isPublicPath(pathname: string) {
	return PUBLIC_PATH_PATTERNS.some((pattern) => pattern.test(pathname));
}

