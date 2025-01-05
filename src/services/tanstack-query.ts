import {
  dehydrate,
  type FetchInfiniteQueryOptions,
  type FetchQueryOptions,
  HydrationBoundary,
  isServer,
  QueryClient,
} from '@tanstack/react-query';

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        refetchOnWindowFocus: false,
        staleTime: 60 * 1000,
      },
    },
  });
};

let browserClient: QueryClient | undefined = undefined;

const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserClient) browserClient = makeQueryClient();
    return browserClient;
  }
};

const getDehydratedQuery = async (options: FetchQueryOptions) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(options);

  const dehydratedState = dehydrate(queryClient);

  return dehydratedState;
};

const getDehydratedInfiniteQuery = async (
  options: FetchInfiniteQueryOptions,
) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(options);

  const dehydratedState = dehydrate(queryClient);
  return dehydratedState;
};

const Hydration = HydrationBoundary;

export {
  getDehydratedInfiniteQuery,
  getDehydratedQuery,
  getQueryClient,
  Hydration,
};
