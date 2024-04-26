import { QueryKey, UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { RPMConfig } from "./variables.api";

interface BaseAPIConfig {
    url: string;
    authType: 'api_key' | 'token' | 'none';
    token?: string;
};

export type EndpointOptions<T> = Omit<UndefinedInitialDataOptions<T>, 'queryKey' | 'queryFn'>;
interface APIEndpoint<T> extends BaseAPIConfig {
    queryKey: QueryKey;
    options?: EndpointOptions<T>;
}
interface APIFetcher extends BaseAPIConfig {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: BodyInit;
    signal?: AbortSignal;
}

export const fetchFromRpm = async<T>(endpoint: APIFetcher) => {
    const headers: Record<string, string> = {};
    if (endpoint.authType === 'api_key') {
        headers['x-api-key'] = RPMConfig.API_KEY;
        headers['x-app-id'] = RPMConfig.APP_ID;
    }
    else if (endpoint.authType === 'token') {
        headers['Authorization'] = `Bearer ${endpoint.token}`;
    }
    if (endpoint.body) {
        headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(endpoint.url, {
        headers: headers,
        method: endpoint.method,
        body: endpoint.body,
        signal: endpoint.signal
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json() as T;
};

export const buildRPMEndpoint = <T>({ queryKey, options, ...init }: APIEndpoint<T>) => {
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
