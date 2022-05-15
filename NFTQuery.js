let userAddress;
let transactionArray = [];
let userTransactions = [];
let nftArray = [];
const openseaURL = 'https://api.opensea.io/api/v1/asset';
let loading;

const fetchTransactionsByAddress = async (address) => {
    try {
        const url = `https://api.etherscan.io/api?module=account&action=tokennfttx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=YourApiKeyToken`;
        const res = await fetch(url);
        const data = await res.json();
        return data;
    } catch (e) {
        console.error(e);
    }
    return null;
}

const fetchedTransactions = async () => {
    const transactions = await fetchTransactionsByAddress(userAddress);
    const result = await transactions.result;
    console.log(result);
    if (typeof result == "string") return onCallFailure();
    Promise.all(result.map(transaction => {
        try {
            transactionArray.push(transaction);
        } catch (e) {
            console.log(e);
        }
    }));
    
    return transactionArray;
}

const progressTransactions = async () => {
    const transactions = await fetchedTransactions();
    console.log(transactions);
    if (transactions === undefined) return;
    Promise.all(transactions.map(transaction => {
        try {
            const toAddress = transaction.to;
            console.log();
            const contractAddress = transaction.contractAddress;
            const tokenId = transaction.tokenID;
            if (userAddress.toLocaleLowerCase() === toAddress.toLocaleLowerCase()) {
                userTransactions.push([contractAddress, tokenId]);
            }
        } catch (e) {
            console.log(e);
        }
    }));

    return userTransactions;
}

const nftRequest = async (url) => {
    fetch(url).then(response => {
        try {
            return response.json();
        } catch (e) {
            return null;
        }
    });
}

const getUserNFTs = async () => {
    const proggressedTransactions = await progressTransactions();
    console.log(proggressedTransactions);
    if (proggressedTransactions === undefined) return;
    await Promise.all(
        proggressedTransactions.map(asset => {
            const contractAddress = asset[0];
            const tokenId = asset[1];
            return new Promise(async (resolve) => {
                try {
                    await fetch(`${openseaURL}/${contractAddress}/${tokenId}/?include_orders=false`)
                    .then(response => {
                        return new Promise(() => {
                          response.json()
                            .then(nft => {
                              nftArray.push(nft);
                              resolve(nft);
                            })
                        });
                      })
                      .catch(err => {
                            console.log(err);
                      });
                      await sleep(500)
                } catch (err) {
                    resolve(null);
                }
            });
        })
    );
}

function sleep (milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds))
  }

const getNFTArray = async () => {
    transactionArray = [];
    userTransactions = [];
    nftArray = [];
    loading = true;
    if (loading) {
        document.getElementById('loader').style.display = "block";
    }
    userAddress = document.querySelector('#search-bar').value;
    document.querySelector('#owner-address span').innerHTML = userAddress;
    console.log(userAddress);
    try {
        await getUserNFTs();
        const filteredNfts = filteredArray(nftArray, JSON.stringify);
        console.log(filteredNfts);
        if (filteredNfts[0].detail && filteredNfts.length <= 1) {
            onCallFailure();
        }
        for (nft of filteredNfts) {
            if (nft.image_url) {
                let cardDiv = document.createElement('div');
                cardDiv.innerHTML = `
                    <div class="card m-5" style="width: 20rem;">
                      <img class="card-img-top" src="${nft.image_url}" alt="Card image cap">
                      <div class="card-body">
                        <h6 class="card-title">Tuldajdonos: ${nft.owner.address}</h6>
                        <p class="card-text">Tulajdonos neve: <b>${nft.owner.user.username}</b></p>
                        <p class="card-text">NFT neve: <b>${nft.name}</b></p>
                        <p class="card-text">TokenID: <b>${nft.token_id}</b></p>
                        <p class="card-text">Asset Contract Address: <b>${nft.asset_contract.address}</b></p>
                        <p class="card-text">Típus: <b>${nft.asset_contract.schema_name}</b></p>
                        <p class="card-text">Eladási számok: <b>${nft.num_sales}</b></p>
                        <p class="card-text">Creator Address: <b>${nft.creator.address}</b></p>
                        <p class="card-text">Készítő neve: <b>${nft.creator.user?.username}</b></p>
                        <p class="card-text">NFT leírása: <b>${nft.description}</b></p>
                        <p class="card-text"><small class="text-muted">Created date: ${nft.collection.created_date}</small></p>
                      </div>
                    </div>
                `;
                document.getElementsByClassName('card-group')[0].appendChild(cardDiv);
            }
        }
        loading = false;
        if (!loading) {
            document.getElementById('loader').style.display = "none";
        }
    } catch (e) {
        console.log(e);
    }
}

const filteredArray = (array, key) => {
    let seen = new Set();
    return array.filter(item => {
        let k = key(item);
        return seen.has(k) ? false : seen.add(k);
    });
}

const onCallFailure = () => {
    setTimeout(() => {
        getNFTArray();
    }, 5000)
}

document.getElementById('search-btn').addEventListener("click", getNFTArray.bind(this));