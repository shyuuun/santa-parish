import { createClient } from "@/src/utils/supabase/cilent";
import { useEffect, useState, useMemo } from "react";

interface WhereCondition {
	column: string;
	operator: "eq" | "neq";
	value: string | number | boolean;
}

interface UseFetchDataProps {
	table: string;
	page: number;
	limit?: number;

	// Optional search query to filter results
	searchQuery?: string;
	// Optional columns to select from the table
	// If not provided, all columns will be selected
	columns?: string[];
	// Optional column to search against
	searchColumn?: string[];
	where?: WhereCondition[];
}

interface PaginationInfo {
	total: number;
	lastPage: number;
	page: number;
}

/**
 * useFetchData is a custom hook that fetches data from a Supabase table.
 * It supports pagination, optional search queries, and column selection.
 * Useful for fetching data in a paginated manner with optional filtering.
 * As of now it doesn't support caching.
 */
export function useFetchData<T>({
	table,
	page,
	limit = 5,
	searchQuery,
	columns = ["*"], // Default to selecting all columns
	searchColumn = [],
	where = [],
}: UseFetchDataProps) {
	const [data, setData] = useState<T[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState<PaginationInfo>({
		total: 0,
		lastPage: 1,
		page: 1,
	});

	const [refreshToken, setRefreshToken] = useState(0);
	const refresh = () => setRefreshToken((prev) => prev + 1);

	// Memoize array dependencies to prevent infinite re-renders
	const memoizedWhere = useMemo(() => where, [JSON.stringify(where)]);
	const memoizedSearchColumn = useMemo(() => searchColumn, [JSON.stringify(searchColumn)]);

	// Process the search query and columns
	let columnResult = "";

	if (columns && columns.length > 0) {
		columnResult = columns.join(", ");
	} else {
		columnResult = "*"; // Default to selecting all columns
	}

	console.log("useFetch Hook: Columns", columnResult);

	useEffect(() => {
		(async () => {
			try {
				const supabase = createClient();
				setIsLoading(true);

				// Calculate offset based on page number and limit
				const offset = (page - 1) * limit;

				// Create base query
				let query = supabase
					.from(table)
					.select(columnResult, { count: "exact" });

				// Apply where conditions if provided
				if (memoizedWhere && memoizedWhere.length > 0) {
					memoizedWhere.forEach((condition) => {
						switch (condition.operator) {
							case "eq":
								query = query.eq(
									condition.column,
									condition.value
								);
								break;
							case "neq":
								query = query.neq(
									condition.column,
									condition.value
								);
								break;
							default:
								throw new Error(
									`Unsupported operator: ${condition.operator}`
								);
						}
					});
				}

				// Add search condition if searchQuery exists
				if (searchQuery) {
					memoizedSearchColumn.forEach((column) => {
						// console.log("useAdmin Hook: Search Column", column);
						query = query.or(`${column}.ilike.%${searchQuery}%`);
					});
				}

				// Add pagination
				const { data, error, count } = await query
					.range(offset, offset + limit - 1)
					.order("created_at", { ascending: false });

				// console.log("useAdmin Hook: Admin Data", data);

				// Handle any errors from the query
				if (error) {
					throw error;
				}

				// Check if data is an array and set it
				if (Array.isArray(data)) {
					setData(data as T[]);
				} else {
					setData(null);
				}

				// Update pagination info
				if (count) {
					setPagination({
						total: count,
						lastPage: Math.ceil(count / limit),
						page,
					});
				}
			} catch (error) {
				if (error instanceof Error) {
					setError(error.message);
				}
			} finally {
				setIsLoading(false);
			}
		})();
	}, [
		limit,
		page,
		searchQuery,
		refreshToken,
		table,
		columnResult,
		memoizedWhere,
		memoizedSearchColumn,
	]);

	return {
		data,
		isLoading,
		error,
		pagination,
		refresh,
	};
}
