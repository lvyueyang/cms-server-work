import i18next, { type i18n as I18nInstance } from "i18next";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

const I18nContext = createContext<I18nInstance | null>(null);

export function createI18nInstance(
	lang: string,
	translations: Record<string, string>,
) {
	const instance = i18next.createInstance();
	void instance.init({
		lng: lang,
		fallbackLng: "zh-CN",
		resources: {
			[lang]: {
				translation: translations,
			},
		},
		interpolation: {
			escapeValue: false,
		},
	});
	return instance;
}

export function I18nProvider({
	i18n,
	children,
}: {
	i18n: I18nInstance;
	children: ReactNode;
}) {
	return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
}

export function useI18n() {
	const instance = useContext(I18nContext);
	if (!instance) {
		throw new Error("I18nProvider is required");
	}
	return instance;
}

export function useT() {
	const instance = useI18n();
	return (key: string, fallback?: string) => {
		const value = instance.t(key);
		return value === key && fallback ? fallback : value;
	};
}

export function useLang() {
	return useI18n().language;
}
