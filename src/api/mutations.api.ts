import { RPMConfig } from "./variables.api";
import { fetchFromRpm } from "./useApi";

export const createRpmUser = async() => {
    type UserRes = {
        data: { id: string; token: string }
    };
    
    return await fetchFromRpm<UserRes>({
        url: `${RPMConfig.SUBDOMAIN_BASE}/api/users`,
        authType: 'none',
        method: 'POST'
    });
}

export const createRpmAvatar = async(userToken: string, templateId: string) => {
    // Create an avatar
    const avatarResponse = await fetchFromRpm<{ data: { id: string } }>({
        url: `${RPMConfig.API_BASE}/v2/avatars/templates/${templateId}`,
        method: 'POST',
        authType: 'token',
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
        authType: 'token',
        token: userToken,
    });
}
