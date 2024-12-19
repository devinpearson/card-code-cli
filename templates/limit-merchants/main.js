// This function runs during the card transaction authorization flow
        // It has limited execution time, so keep any code short-running.

        const beforeTransaction = async (authorization) => {
            let merchants = process.env.merchantNames.split("|");
            for (merchant of merchants) {
                if (authorization.merchant.name.toLowerCase().includes(merchant.toLowerCase())) {
                    return true;
                }
            }
            return false;
        };
        
        // This function runs after an approved transaction.
        const afterTransaction = async (transaction) => {
             console.log(transaction);
        };
        
        // This function runs after a declined transaction
        const afterDecline  = async (transaction) => {
             console.log(transaction);
        };