import {
	AppstoreOutlined,
	DownOutlined,
	FullscreenExitOutlined,
	FullscreenOutlined,
} from "@ant-design/icons";
import { Setting } from "@icon-park/react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useFullscreen } from "ahooks";
import { Avatar, Breadcrumb, Dropdown } from "antd";
import { pathToRegexp } from "path-to-regexp";
import { useEffect, useMemo, useRef } from "react";
import { outLogin } from "@/services";
import { useAppData } from "@/router";
import { useGlobalStore } from "@/store/global";
import { useUserinfoStore } from "@/store/userinfo";
import { getMenuEntryPath, getMenuViewByPathname } from "./getNavMenu";
import styles from "./index.module.scss";

interface TreeNode {
	path?: string;
	title?: string;
	children?: TreeNode[];
}
function getParentNodesByKey(
	path?: string,
	tree: TreeNode[] = [],
	parentNodes: TreeNode[] = [],
): Omit<TreeNode, "children">[] | undefined {
	for (const node of tree) {
		const currentNode = {
			title: node.title,
			// onClick: () => {
			//   if (node.path) {
			//     history.push(node.path);
			//   }
			//   return false;
			// },
		};

		if (node.path && path && pathToRegexp(node.path).regexp.test(path)) {
			return [...parentNodes, currentNode];
		}
		if (node.children) {
			const result = getParentNodesByKey(path, node.children, [
				...parentNodes,
				currentNode,
			]);
			if (result) {
				return result;
			}
		}
	}
	return void 0;
}

export function HeaderBreadcrumb() {
	const { clientRoutes } = useAppData();
	const location = useLocation();
	const headerBreadcrumbItems = useGlobalStore((state) => state.headerBreadcrumbItems);
	const updateHeaderBreadcrumbItems = useGlobalStore(
		(state) => state.updateHeaderBreadcrumbItems,
	);
	const breadcrumbItems = useMemo(
		() => getParentNodesByKey(location.pathname, clientRoutes) || [],
		[clientRoutes, location.pathname],
	);
	useEffect(() => {
		updateHeaderBreadcrumbItems(breadcrumbItems);
	}, [breadcrumbItems, updateHeaderBreadcrumbItems]);

	return <Breadcrumb items={headerBreadcrumbItems} />;
}

function PageFullscreenButton(props: React.HTMLAttributes<HTMLDivElement>) {
	const ref = useRef(document.body);
	const [isFullscreen, { toggleFullscreen }] = useFullscreen(ref);

	return (
		<div {...props} onClick={toggleFullscreen}>
			{!isFullscreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
		</div>
	);
}

export default function HeaderBar() {
	const { data: userInfo } = useUserinfoStore();
	const location = useLocation();
	const navigate = useNavigate();
	const sidebarMenuView = getMenuViewByPathname(location.pathname);

	const toggleSidebarMenuView = () => {
		const nextView =
			sidebarMenuView === "platform" ? "business" : "platform";
		navigate({ to: getMenuEntryPath(nextView) });
	};

	return (
		<div className={`${styles.headerContainer} header`}>
			<div>
				<HeaderBreadcrumb />
			</div>
			<div className={styles.userContainer}>
				<div
					className={`${styles.item} ${
						sidebarMenuView === "platform" ? styles.itemActive : ""
					}`}
					onClick={toggleSidebarMenuView}
					title={sidebarMenuView === "platform" ? "切换到业务区" : "切换到平台区"}
				>
					<AppstoreOutlined />
				</div>
				<div className={styles.item} onClick={() => navigate({ to: "/setting" })}>
					<Setting size={19} />
				</div>
				<div className={styles.item}>
					<PageFullscreenButton />
				</div>
				<Dropdown
					menu={{
						items: [
							{
								label: "个人资料",
								key: "userinfo",
								onClick: () => {
									navigate({ to: "/userinfo" });
								},
							},
							{
								label: "退出",
								key: "outlogin",
								onClick: () => {
									outLogin();
									navigate({ to: "/login", search: { redirect: undefined } });
								},
							},
						],
					}}
				>
					<div className={styles.item}>
						<Avatar src={userInfo?.avatar}>{userInfo?.username}</Avatar>
						<span className={styles.username}>
							{userInfo?.cname || userInfo?.username}
						</span>
						<DownOutlined style={{ fontSize: 12 }} />
					</div>
				</Dropdown>
			</div>
		</div>
	);
}
