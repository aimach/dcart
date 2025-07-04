import { useEffect, useRef } from "react";

export default function useInfiniteScroll(
	callback: () => void,
	hasMore: boolean,
	loading: boolean,
) {
	const observerRef = useRef();

	useEffect(() => {
		if (loading) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore) callback();
			},
			{ threshold: 1 },
		);
		if (observerRef.current) observer.observe(observerRef.current);

		return () => {
			if (observerRef.current) observer.unobserve(observerRef.current);
		};
	}, [callback, hasMore, loading]);

	return observerRef;
}
