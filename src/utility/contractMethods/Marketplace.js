import Web3 from "web3";
import { marketplaceABI } from "../contracts/Marketplace";
import { MarketPlaceAddress } from "../../config/index";

let MarketplaceContract, web3;

web3 = new Web3(window.ethereum);

MarketplaceContract = new web3.eth.Contract(marketplaceABI, MarketPlaceAddress);

export const listTokenToMarketplace = (
    nftAddress,
    tokenId,
    tokenAmount,
    priceMetis,
    pricePeak,
    royaltyFee,
    isERC721,
    myAddress,
) => {
    return new Promise((resolve, reject) => {
        if (web3 && web3.currentProvider) {
            MarketplaceContract.methods
                .listTokenToMarketplace(
                    nftAddress,
                    tokenId,
                    tokenAmount,
                    priceMetis,
                    pricePeak,
                    royaltyFee,
                    isERC721,
                )
                .send({ from: myAddress })
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => reject(error));
        } else {
            resolve();
        }
    });
};

export const listedNFTsOnMarketplace = (index) => {
    return new Promise((resolve, reject) => {
        if (web3 && web3.currentProvider) {
            MarketplaceContract.methods
                .listedNFTsOnMarketplace(index)
                .call()
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => reject(error));
        } else {
            resolve();
        }
    });
};

export const tokenListedByUser = (address) => {
    return new Promise((resolve, reject) => {
        if (web3 && web3.currentProvider) {
            MarketplaceContract.methods
                .getTokenListedByUser(address)
                .call()
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => reject(error));
        } else {
            resolve();
        }
    });
};

export const getNFTDetails = (nftAddress, tokenId) => {
    return new Promise((resolve, reject) => {
        if (web3 && web3.currentProvider) {
            MarketplaceContract.methods
                .nftDetails(nftAddress, tokenId)
                .call()
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => reject(error));
        } else {
            resolve();
        }
    });
};

export const getPeakAddress = () => {
    return new Promise((resolve, reject) => {
        if (web3 && web3.currentProvider) {
            MarketplaceContract.methods
                .getPeakAddress()
                .call()
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => reject(error));
        } else {
            resolve();
        }
    });
};
export const getNumberOfListedNFT = () => {
    return new Promise((resolve, reject) => {
        if (web3 && web3.currentProvider) {
            MarketplaceContract.methods
                .getNumberOfListedNFTs()
                .call()
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => reject(error));
        } else {
            resolve();
        }
    });
};

export const buyToken = (
    nftAddress,
    tokenId,
    tokenAmount,
    isMetis,
    isERC721,
    value,
    myAddress,
) => {
    return new Promise((resolve, reject) => {
        if (web3 && web3.currentProvider) {
            MarketplaceContract.methods
                .buyToken(nftAddress, tokenId, tokenAmount, isMetis, isERC721)
                .send({ from: myAddress, value: value })
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => reject(error));
        } else {
            resolve();
        }
    });
};
