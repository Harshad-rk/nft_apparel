import Web3 from "web3";

import { NFTBaseABI } from "../contracts/NFTBase";
import { NFTAddress } from "../../config/index";
let web3, NFTContract;

web3 = new Web3(window.ethereum);

export const approveToken = (myAddress, spender, tokenId, nftAddress) => {
    return new Promise((resolve, reject) => {
        let nftContract = new web3.eth.Contract(NFTBaseABI, nftAddress);
        if (web3 && web3.currentProvider) {
            nftContract.methods
                .approve(spender, tokenId)
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

export const setApproveForAllToken = (myAddress, spender, nftAddress) => {
    return new Promise((resolve, reject) => {
        let nftContract = new web3.eth.Contract(NFTBaseABI, nftAddress);
        if (web3 && web3.currentProvider) {
            nftContract.methods
                .setApproveForAll(spender, true)
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

export const mintToken = (myAddress, uri, nftAddress) => {
    return new Promise((resolve, reject) => {
        let nftContract = new web3.eth.Contract(NFTBaseABI, nftAddress);
        if (web3 && web3.currentProvider) {
            nftContract.methods
                .mint(myAddress, uri)
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

export const balanceOfToken = (myAddress, nftAddress) => {
    return new Promise((resolve, reject) => {
        let nftContract = new web3.eth.Contract(NFTBaseABI, nftAddress);

        if (web3 && web3.currentProvider) {
            nftContract.methods
                .balanceOf(myAddress)
                .call({ from: myAddress })
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => reject(error));
        } else {
            resolve();
        }
    });
};

export const tokenName = (nftAddress) => {
    return new Promise((resolve, reject) => {
        let nftContract = new web3.eth.Contract(NFTBaseABI, nftAddress);

        if (web3 && web3.currentProvider) {
            nftContract.methods
                .name()
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

export const tokenSymbol = (nftAddress) => {
    return new Promise((resolve, reject) => {
        let nftContract = new web3.eth.Contract(NFTBaseABI, nftAddress);

        if (web3 && web3.currentProvider) {
            nftContract.methods
                .symbol()
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

export const tokenOwner = (tokenId) => {
    return new Promise((resolve, reject) => {
        let nftContract = new web3.eth.Contract(NFTBaseABI, nftAddress);

        if (web3 && web3.currentProvider) {
            nftContract.methods
                .ownerOf(tokenId)
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

export const tokenURI = (tokenId, nftAddress) => {
    return new Promise((resolve, reject) => {
        let nftContract = new web3.eth.Contract(NFTBaseABI, nftAddress);
        if (web3 && web3.currentProvider) {
            nftContract.methods
                .tokenURI(tokenId)
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
