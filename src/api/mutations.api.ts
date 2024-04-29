import { RPMConfig } from "./variables.api";
import { fetchFromRpm } from "./useApi";

export const createRpmUser = async() => {
    type UserRes = {
        data: { id: string; token: string }
    };
    
    return await fetchFromRpm<UserRes>({
        url: `${RPMConfig.SUBDOMAIN_BASE}/api/users`,
        method: 'POST',
        apiKey: false
    });
}

export const createRpmAvatar = async(userToken: string, templateId: string) => {
    // Create an avatar
    const avatarResponse = await fetchFromRpm<{ data: { id: string } }>({
        url: `${RPMConfig.API_BASE}/v2/avatars/templates/${templateId}`,
        method: 'POST',
        token: userToken,
        body: JSON.stringify({
            data: {
                partner: RPMConfig.APP_NAME,
                bodyType: 'halfbody'
            }
        })
    });

    // Save avatar
    type AvatarRes = {
        data: {
            id: string;
            gender: string;
            assets: Record<string, string | number>;
        }
    };

    return await fetchFromRpm<AvatarRes>({
        url: `${RPMConfig.API_BASE}/v2/avatars/${avatarResponse.data.id}`,
        method: 'PUT',
        token: userToken
    });
}

type AssetUpdateRes = {
    data: {
        id: string;
        assets: Record<string, string | number>;
    }
}

export const duplicateAvatar = async(
    userToken: string,
    sourceTemplateId: string,
    assets: Record<string, string | number>
) => {
    // Create an avatar
    const res = await fetchFromRpm<{ data: { id: string } }>({
        url: `${RPMConfig.API_BASE}/v2/avatars/templates/${sourceTemplateId}`,
        method: 'POST',
        token: userToken,
        body: JSON.stringify({
            data: {
                partner: RPMConfig.APP_NAME,
                bodyType: 'halfbody'
            }
        })
    });
    return await updateRpmAvatar(userToken, res.data.id, assets);
}

export const updateRpmAvatar = async(
    userToken: string,
    avatarId: string,
    assets: Record<string, string | number>
) => {
    const res = await fetchFromRpm<AssetUpdateRes>({
        url: `${RPMConfig.API_BASE}/v2/avatars/${avatarId}`,
        method: 'PATCH',
        body: JSON.stringify({
            data: {
                assets
            }
        }),
        token: userToken
    });
    return res.data;
}

export const saveRpmAvatarChanges = async(userToken: string, avatarId: string) => {
    const res = await fetchFromRpm<AssetUpdateRes>({
        url: `${RPMConfig.API_BASE}/v2/avatars/${avatarId}`,
        method: 'PUT',
        token: userToken
    });
    return res.data;
}
