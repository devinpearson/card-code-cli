import path from 'path'
interface AuthResponse {
        access_token: string,
        token_type: string
        expires_in: number
        scope: string
}
export async function getAccessToken(host: string, clientId: string, secret: string, apikey: string) {
    const response = await fetch(
    path.join(host, '/identity/v2/oauth2/token'), {
        method: 'POST',
        headers: {
            "Authorization": "Basic " + Buffer.from(clientId + ':' + secret).toString('base64'),
            "x-api-key": apikey,
            "content-type": "application/x-www-form-urlencoded"
        },
        body: 'grant_type=client_credentials'
    });
    // console.log(response.status);
    if (response.status !== 200) {
        throw new Error(response.statusText);
    }
    const result = await response.json() as AuthResponse;
    return result.access_token;
};

export async function uploadEnv(cardkey: number, env: string, host: string, token: string) {
    const response = await fetch(
    path.join(host, '/za/v1/cards/',cardkey.toString(),'/environmentvariables'), {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + token,
            "content-type": "application/json"
        },
        body: env,
    });
    if (response.status !== 200) {
        if (response.status === 404) {
            throw new Error('Card not found');
        }
        throw new Error(response.statusText);
    }
    const result = await response.json() as EnvResponse;
    return result;
}

interface UploadCodeResponse {
    data: {
        cardCode: {
            code: string;
        };
    };
}

export async function uploadCode(cardkey: number, code: object, host: string, token: string): Promise<UploadCodeResponse> {
    const response = await fetch(
    path.join(host, '/za/v1/cards/', cardkey.toString(), '/code'), {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + token,
            "content-type": "application/json"
        },
        body: JSON.stringify(code),
    });
    if (response.status !== 200) {
        if (response.status === 404) {
            throw new Error('Card not found');
        }
        throw new Error(response.statusText);
    }
    const result: UploadCodeResponse = await response.json() as CodeResponse;
    return result;
}
interface Card {
    "CardKey": number
    "CardNumber": string
    "IsProgrammable": boolean
    "status": string
    "CardTypeCode": string
    "AccountNumber": string
    "AccountId": string
}
interface CardResponse{
    "data": {
        "cards": [
            Card
        ]
    }
}
export async function fetchCards(host: string, token: string) {
    const response = await fetch(
    path.join(host, '/za/v1/cards'), {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + token,
            "content-type": "application/json"
        },
    });
    if (response.status !== 200) {
        throw new Error(response.statusText);
    }
    const result = await response.json() as CardResponse;
    return result.data.cards;
}
interface EnvVars {
    [key: string]: string
}
interface EnvResponse {
    "data": {
        "result": {
            "variables": [EnvVars],
            "createdAt": string,
            "updatedAt": string,
            "error": null
        }
    }
}

export async function fetchEnv(cardkey: number, host: string, token: string) {
    const response = await fetch(
    path.join(host, '/za/v1/cards/',cardkey.toString(),'/environmentvariables'), {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + token,
            "content-type": "application/json"
        },
    });
    if (response.status !== 200) {
        if (response.status === 404) {
            throw new Error('Card not found');
        }
        throw new Error(response.statusText);
    }
    const result = await response.json() as EnvResponse;
    return result.data.result.variables;
}

interface CodeResponse {
    data: {
        cardCode: {
            code: string;
        };
    }
}
export async function fetchCode(cardkey: number, host: string, token: string) {
    const response = await fetch(
    path.join(host, '/za/v1/cards/',cardkey.toString(),'/code'), {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + token,
            "content-type": "application/json"
        },
    });
    if (response.status !== 200) {
        if (response.status === 404) {
            throw new Error('Card not found');
        }
        throw new Error(response.statusText);
    }
    const result: CodeResponse = await response.json() as CodeResponse;
    return result.data.cardCode.code;
}