import { EndpointOptions, buildRPMEndpoint } from "./useApi";
import { RPMConfig } from "./variables.api";

interface TemplateResponse {
    data: {
        imageUrl: string;
        usageType: string;
        gender: string;
        id: string;
    }[];
}

export const useAvatarTemplates = (userToken: string, options?: EndpointOptions<TemplateResponse>) => {
    return buildRPMEndpoint<TemplateResponse>({
        url: `${RPMConfig.API_BASE}/v2/avatars/templates`,
        authType: 'token',
        token: userToken,
        queryKey: ['templates'],
        options
    });
};