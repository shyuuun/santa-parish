// Global utility functions

/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce<T extends (...args: any[]) => any>(
	cb: T,
	ms: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
	let timeoutId: NodeJS.Timeout;
	console.log("Debounce function initialized with delay:", ms);
	return (...args: Parameters<T>): Promise<ReturnType<T>> => {
		return new Promise((resolve) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				resolve(cb(...args));
			}, ms);
		});
	};
}
