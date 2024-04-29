import { EndpointOptions, useInfiniteRPMEndpoint, useRPMEndpoint } from "./useApi";
import { AssetType, RPMConfig } from "./variables.api";

interface TemplateResponse {
    data: {
        imageUrl: string;
        usageType: string;
        gender: string;
        id: string;
    }[];
}

export const useAvatarTemplates = (userToken: string, options?: EndpointOptions<TemplateResponse>) => {
    return useRPMEndpoint<TemplateResponse>({
        url: `${RPMConfig.API_BASE}/v2/avatars/templates`,
        token: userToken,
        queryKey: ['templates'],
        options
    });
};

interface AssetResponse {
    data: {
        id: string;
        name: string;
        type: AssetType;
        gender: 'male' | 'female' | 'neutral';
        modelUrl: string;
        iconUrl: string;
    }[];
}

export const useAvatarAssets = (
    type: AssetType,
    gender: 'male' | 'female',
    ids?: string[],
    options?: EndpointOptions<AssetResponse>
) => {
    return useInfiniteRPMEndpoint<AssetResponse>({
        url: `${RPMConfig.API_BASE}/v1/assets`,
        queryKey: ['assets', type],
        queryParams: {
            type,
            order: 'name',
            gender: [ gender, 'neutral' ],
            ...(ids ? { ids } : {})
        },
        options
    });
}

export const getAvatarPreviewUrl = (avatarId: string) => {
    return `https://api.readyplayer.me/v2/avatars/${avatarId}.glb?preview=true&useHands=false&textureAtlas=512`;
}
export const get2DAvatarModel = (avatarId: string, updatedAt?: string) => {
    let url = `https://models.readyplayer.me/${avatarId}.png?useHands=false&textureAtlas=512`;
    if (updatedAt) {
        url += `&uat=${updatedAt}&cacheControl=true`;
    }
    return url;
}
