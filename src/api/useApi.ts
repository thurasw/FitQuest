import { QueryKey, UndefinedInitialDataOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { RPMConfig } from "./variables.api";

interface BaseAPIConfig {
    url: string;
    queryParams?: Record<string, string | string[]>;
    headers?: Record<string, string>;
    token?: string;
    apiKey?: boolean;
};

export type EndpointOptions<T> = Omit<UndefinedInitialDataOptions<T>, 'queryKey' | 'queryFn'>;
interface APIEndpoint<T> extends BaseAPIConfig {
    queryKey: QueryKey;
    options?: EndpointOptions<T>;
}
interface APIFetcher extends BaseAPIConfig {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: BodyInit;
    signal?: AbortSignal;
    parseJson?: boolean;
}

export async function fetchFromRpm<T>(endpoint: APIFetcher, parseJson?: true): Promise<T>;
export async function fetchFromRpm<T>(endpoint: APIFetcher, parseJson: false): Promise<undefined>;
export async function fetchFromRpm<T>(endpoint: APIFetcher, parseJson?: boolean) {
    const headers: Record<string, string> = endpoint.headers || {};

    if (endpoint.apiKey === true || (endpoint.apiKey === undefined && !endpoint.token)) {
        headers['x-api-key'] = RPMConfig.API_KEY;
        headers['x-app-id'] = RPMConfig.APP_ID;
    }
    if (endpoint.token !== undefined) {
        headers['Authorization'] = `Bearer ${endpoint.token}`;
    }
    if (endpoint.body) {
        headers['Content-Type'] = 'application/json';
    }

    let url = endpoint.url;
    if (endpoint.queryParams) {
        const search = new URLSearchParams();
        for (const key in endpoint.queryParams) {
            if (Array.isArray(endpoint.queryParams[key])) {
                for (const value of endpoint.queryParams[key]) {
                    search.append(key, value);
                }
            }
            else search.append(key, endpoint.queryParams[key] as string);
        }
        url += `?${search.toString()}`;
    }

    const response = await fetch(url, {
        headers: headers,
        method: endpoint.method,
        body: endpoint.body,
        signal: endpoint.signal
    });
    if (!response.ok) {
        console.error(response.status, response.statusText);
        throw new Error(response.statusText);
    }
    if (parseJson !== false) {
        return await response.json() as T;
    }
    return undefined;
};

export const useRPMEndpoint = <T>({ queryKey, options, ...init }: APIEndpoint<T>) => {
    return useQuery({
        queryKey: queryKey,
        queryFn: ({ signal }) => {
            return fetchFromRpm<T>({
                ...init,
                method: 'GET',
                signal
            });
        },
        ...options
    })
};

export const useInfiniteRPMEndpoint = <T>({ queryKey, queryParams, options, ...init }: APIEndpoint<T>) => {
    return useInfiniteQuery<T>({
        queryKey: queryKey,
        queryFn: ({ signal, pageParam }) => {
            return fetchFromRpm({
                ...init,
                method: 'GET',
                signal,
                queryParams: {
                    ...queryParams,
                    page: String(pageParam),
                    limit: '24'
                }
            });
        },
        getNextPageParam: (lastPage: any) => {
            const nextPage = lastPage?.pagination?.nextPage;
            return nextPage || undefined;
        },
        initialPageParam: 1,
        ...(options as any)
    });
};
