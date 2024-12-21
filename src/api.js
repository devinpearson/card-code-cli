var fs = require('fs');
var path = require('path');

async function getAccessToken(host, clientId, secret, apikey) {
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
    const token = (await response.json()).access_token;
    return token;
};

async function uploadEnv(cardkey, env, host, token) {
    const response = await fetch(
    path.join(host, '/za/v1/cards/',cardkey.toString(),'/environmentvariables'), {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + token,
            "content-type": "application/json"
        },
        body: JSON.stringify(env),
    });
    if (response.status !== 200) {
        if (response.status === 404) {
            throw new Error('Card not found');
        }
        throw new Error(response.statusText);
    }
    const result = await response.json();
    return result;
}

async function uploadCode(cardkey, code, host, token) {
    const response = await fetch(
    path.join(host, '/za/v1/cards/',cardkey.toString(),'/code'), {
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
    const result = await response.json();
    return result;
}

async function fetchCards(host, token) {
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
    const result = await response.json()
    return result.data.cards;
}

async function fetchEnv(cardkey, host, token) {
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
    result = await response.json();
    return result.data.result.variables;
}

async function fetchCode(cardkey, host, token) {
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
    result = await response.json();
    return result.data.cardCode.code;
}

module.exports = {
    getAccessToken: getAccessToken,
    uploadEnv: uploadEnv,
    uploadCode: uploadCode,
    fetchCards: fetchCards,
    fetchEnv: fetchEnv,
    fetchCode: fetchCode
  };