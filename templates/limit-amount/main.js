// This function runs during the card transaction authorization flow
// It has limited execution time, so keep any code short-running.

const beforeTransaction = async (authorization) => {
    if (authorization.centsAmount > process.env.maximumTransactionAmount) {
        return false;
    }
    return true;
};