import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { GlobalData, RequestContext, SsrBootstrapPayload } from "./types";
import { I18nProvider, createI18nInstance } from "./i18n";

interface AppContextValue extends SsrBootstrapPayload {
	requestContext?: RequestContext;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({
	bootstrap,
	requestContext,
	children,
}: {
	bootstrap: SsrBootstrapPayload;
	requestContext?: RequestContext;
	children: ReactNode;
}) {
	const i18n = createI18nInstance(bootstrap.lang, bootstrap.translations);
	const value: AppContextValue = {
		...bootstrap,
		requestContext,
	};

	return (
		<I18nProvider i18n={i18n}>
			<AppContext.Provider value={value}>{children}</AppContext.Provider>
		</I18nProvider>
	);
}

export function useAppContext() {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("AppProvider is required");
	}
	return context;
}

export function useGlobalData(): GlobalData {
	return useAppContext().globalData;
}

export function useCurrentUser() {
	return useAppContext().currentUser;
}
