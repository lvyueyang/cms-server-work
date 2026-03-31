function withQuery(
	pathname: string,
	query: Record<string, string | undefined>,
) {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(query)) {
		if (value) {
			search.set(key, value);
		}
	}
	const queryString = search.toString();
	return queryString ? `${pathname}?${queryString}` : pathname;
}

export function createLoginPageUrl({
	redirect_uri,
	message,
}: {
	redirect_uri?: string;
	message?: string;
} = {}) {
	return withQuery("/login", {
		redirect_uri,
		message,
	});
}

export function createResultPageUrl({
	status,
	title,
	description,
	type,
}: {
	status?: "success" | "error" | "warning";
	title?: string;
	description?: string;
	type?: "user_register" | "back" | "user_login";
} = {}) {
	return withQuery("/result-page", {
		status,
		title,
		description,
		type,
	});
}
