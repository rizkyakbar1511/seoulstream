"use client";

import { useEffect, useState } from "react";
import type { ContinueWatch } from "../types";
import { getContinueWatchingList, removeContinueWatching } from "../utils";

export function useContinueWatchList() {
	const [items, setItems] = useState<ContinueWatch[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setItems(getContinueWatchingList());
		setLoading(false);
	}, []);

	const removeItem = (categoryId: number) => {
		removeContinueWatching(categoryId);
		setItems((prev) => prev.filter((item) => item.category_id !== categoryId));
	};

	return {
		items,
		loading,
		removeItem,
	};
}
