import { createFileRoute } from "@tanstack/react-router";
import PublicArticleFormPage from "./module/Form";

export const Route = createFileRoute("/_main/public-article/create")({
	component: PublicArticleFormPage,
});
