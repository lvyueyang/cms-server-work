import { useEffect, useRef } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";

type LocationState = unknown;

interface UseConsumeLocationStateOptions<T> {
	select: (state: LocationState) => T | undefined;
	onConsume: (value: T) => void;
	clear: (value: T) => {
		to: string;
		replace?: boolean;
		params?: Record<string, unknown>;
		search?: Record<string, unknown>;
		hash?: string;
	};
}

/**
 * 从 TanStack Router 的 location.state 中读取一次性数据，消费后立刻清理 state，避免刷新/返回重复触发。
 *
 * 约束:
 * - 只在客户端运行（local navigation state）
 * - clear() 需要返回一个可导航目标，用于清理 state（默认 replace）
 */
export function useConsumeLocationState<T>(opt: UseConsumeLocationStateOptions<T>) {
	const navigate = useNavigate();
	const location = useRouterState({
		select: (state) => state.location,
	});

	// 避免在严格模式下重复消费同一份 state
	const consumedSigRef = useRef<string | null>(null);

	useEffect(() => {
		const value = opt.select(location.state);
		if (value === undefined) return;
		const sig = JSON.stringify(location.state ?? null);
		if (consumedSigRef.current === sig) return;
		consumedSigRef.current = sig;

		opt.onConsume(value);

		const next = opt.clear(value);
		navigate({
			...next,
			replace: next.replace ?? true,
			state: undefined,
		} as any);
		}, [location.state]);
}
