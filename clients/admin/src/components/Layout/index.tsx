import { useLocation } from "@tanstack/react-router";
import React from "react";
import { getMenuViewByPathname, getNavMenu } from "./getNavMenu";
import HeaderBar from "./HeaderBar";
import styles from "./index.module.scss";
import SideBar from "./SideBar";

interface IProps {
	children: React.ReactNode;
}

export default function Layout({ children }: IProps) {
	const location = useLocation();
	const sidebarMenuView = getMenuViewByPathname(location.pathname);
	const shouldHideSidebar =
		sidebarMenuView === "business" && getNavMenu(sidebarMenuView).length <= 1;

	return (
		<div className={styles.mainLayout}>
			{!shouldHideSidebar ? <SideBar /> : null}
			<div
				className={`${styles.contentWrap} ${shouldHideSidebar ? styles.contentWrapFull : ""}`}
			>
				<HeaderBar />
				<div className={styles.content}>{children}</div>
			</div>
		</div>
	);
}
