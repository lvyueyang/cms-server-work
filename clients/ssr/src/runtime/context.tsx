import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { createI18nInstance, I18nProvider } from "./i18n";
import type { GlobalData, RequestContext, SsrBootstrapPayload } from "./types";

const DEFAULT_GLOBAL_DATA: GlobalData = {
	company_email: "",
	company_tell: "",
	company_address: "",
	company_address_url: "",
	custom_header_code: "",
	custom_footer_code: "",
	i18n_enabled: false,
	keywords: "",
};

interface AppContextValue extends SsrBootstrapPayload {
	globalData: GlobalData;
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
		globalData: bootstrap.globalData ?? DEFAULT_GLOBAL_DATA,
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
