/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useLayoutEffect, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNewsContext } from "@/contexts/ContextProvider";
import { getStorage, setStorage } from "@/modules/storage";
import { includes } from "@/modules/functions";

export default function useCustomInfiniteQuery({ queryKey, query }) {
  const {
    country: { code: country },
    pending,
    queryFn,
    onError,
  } = useNewsContext();
  const type = queryKey[0];
  const placeholderData = useMemo(() => getStorage(queryKey, undefined, type === "news"), [queryKey]); // Avoiding multiple getStorage calls on re-renders as well as we need only old cached data for retry param

  const { data, error, isFetching, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey,
    enabled: !pending && (type === "news" || query.length >= 3),
    placeholderData,
    retry: placeholderData ? 0 : 1,
    getNextPageParam: ({ nextPage }) => nextPage || undefined,
    queryFn: async ({ pageParam }) => queryFn({ queryKey, page: pageParam, type }),
  });
  const fullNews = useMemo(() => {
    if (data) setStorage(queryKey, data, type === "news");
    return data?.pages?.flatMap(({ news }) => news || []) || [];
  }, [data]);
  const news = type === "news" && query ? fullNews.filter((item) => includes(item, query) && item) : fullNews;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [country]);

  useLayoutEffect(() => {
    if (isFetching) return;
    if (error || !data) onError(queryKey);
  }, [isFetching]);

  return { news, length: fullNews.length, error, isFetching, hasNextPage, fetchNextPage };
}
