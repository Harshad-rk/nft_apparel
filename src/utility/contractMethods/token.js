import { posiABI } from "../contracts/Posi";
import Web3 from "web3";

let web3;

web3 = new Web3(window.ethereum);

/*
 * Enable click action of vault
 * Allowance == 0 approve.
 */
export const tokenApprove = (contractAddress, tokenAddress, myAddress) => {
    const amount = "1157920892373161954235709850086879";
    return new Promise((resolve, reject) => {
        const tokenContract = new web3.eth.Contract(posiABI, tokenAddress);
        if (web3 && web3.currentProvider) {
            tokenContract.methods
                .approve(contractAddress, amount)
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

/*
 * call for get token allowance token
 */
export const tokenAllowance = (ContractAddress, tokenAddress, myAddress) => {
    return new Promise((resolve, reject) => {
        const tokenContract = new web3.eth.Contract(posiABI, tokenAddress);
        if (web3 && web3.currentProvider) {
            tokenContract.methods
                .allowance(myAddress, ContractAddress)
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

/*
 * call for get Token Balance
 */
export const tokenBalanceOfAddress = (tokenAddress, address) => {
    return new Promise((resolve, reject) => {
        const tokenContract = new web3.eth.Contract(posiABI, tokenAddress);
        if (web3 && web3.currentProvider) {
            tokenContract.methods
                .balanceOf(address)
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

/*
 * call for get token symbol
 */
export const getTokenSymbol = (tokenAddress, myAddress) => {
    return new Promise((resolve, reject) => {
        const tokenContract = new web3.eth.Contract(posiABI, tokenAddress);
        if (web3 && web3.currentProvider) {
            tokenContract.methods
                .symbol()
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
