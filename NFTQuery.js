const transactionsArray = [];
const address = "0x8160471B56960fEC93cc712298f1f9f5C4bE142d";
let filteredTransactions;
const openSeaURL = "https://api.opensea.io/api/v1/asset"

const fetchTransactions = async (address) => {
    const transactionURL = `https://api.etherscan.io/api?module=account&action=tokennfttx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=YourApiKeyToken`
    return await fetch(transactionURL).then((response) => {
        return response.json();
    }).then((json) => {
        return json;
    });
};

const getFetchedTransactions = async () => {
    return await fetchTransactions(address);
}

const transactions = getFetchedTransactions().then(data => {
    console.log(data.result);
    try {
        for (const transaction of Object.values(data.result)) {
            if (transaction === null || transaction === undefined) return;
            const toAddress = transaction.to;
            const contractAddress = transaction.contractAddress;
            const tokenId = transaction.tokenID;
            if (toAddress === address) {
                transactionsArray.push([contractAddress, tokenId]);
            }
        }
    } catch (e) {
        console.log(e);
    }
    
    return transactionsArray;
}).then(() => {
    console.log(filteredTransactionsFN());
    filteredTransactions = filteredArray(transactionsArray, JSON.stringify);
    //alternativ
    console.log(transactionsArray);
    // const nft = filteredTransactions.forEach(query => {
    //     const contractAddress = query[0];
    //     console.log(contractAddress);
    //     const tokenId = query[1];
    //     const nftFromOpenSea = `${openSeaURL}/${contractAddress}/${tokenId}`;
    //     return fetch(nftFromOpenSea).then((response) => {
    //         return response.json();
    //     }).then((json) => {
    //         return json;
    //     });
    // });

    // await console.log(nft);
    // Promise.all(filteredTransactions.map(openSeaQueryFN));
});

const filteredTransactionsFN = async () => {
    return await transactions;
}



const filteredArray = (array, key) => {
    let seen = new Set();
    return array.filter(item => {
        let k = key(item);
        return seen.has(k) ? false : seen.add(k);
    });
}

const openSeaQueryFN = (query) => {
    return new Promise((resolve, reject) => {
        const contractAddress = query[0];
        const tokenId = query[1];
        console.log(1);

        try {
            const nftFromOpenSea = `${openSeaURL}/${contractAddress}/${tokenId}`;
            const fetchFromOpenSea = fetch(nftFromOpenSea)
            console.log(fetchFromOpenSea);
            // await fetchFromOpenSea.json();
            resolve(fetchFromOpenSea)

        } catch (error) {
            console.log(error);
            resolve(null);
        }
    });
}