import { createFileRoute } from "@tanstack/react-router";
import NewsFormPage from "./module/Form";

export const Route = createFileRoute("/_main/news/update/$id")({
	component: NewsFormPage,
});
