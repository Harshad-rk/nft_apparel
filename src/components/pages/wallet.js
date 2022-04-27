import React, { useEffect, useState } from "react";
import Wallet from "../components/wallet";
import Footer from "../components/footer";

import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { toast } from "react-toastify";
const injected = new InjectedConnector({ supportedChainIds: [4] });

const WalletData = function () {
    const {
        connector,
        library,
        chainId,
        account,
        activate,
        deactivate,
        active,
        error,
    } = useWeb3React();

    function getErrorMessage(error) {
        if (error instanceof NoEthereumProviderError) {
            return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
        } else if (error instanceof UnsupportedChainIdError) {
            return "You're connected to an unsupported network.";
        } else if (error instanceof UserRejectedRequestErrorInjected) {
            return "Please authorize this website to access your Ethereum account.";
        } else {
            console.error(error);
            return "An unknown error occurred. Check the console for more details.";
        }
    }

    const [checkWallet, setCheckWallet] = useState(false);

    useEffect(() => {
        if (error) {
            toast.error(getErrorMessage(error));
        }
    }, [error]);

    useEffect(() => {
        if (checkWallet && active) {
            toast.success("Wallet Connected");
        }
    }, [checkWallet, active]);

    const activateWallet = async () => {
        await activate(injected);
        setCheckWallet(true);
    };
    return (
        <div>
            <section className="jumbotron breadcumb no-bg">
                <div className="mainbreadcumb">
                    <div className="container">
                        <div className="row m-10-hor">
                            <div className="col-12">
                                <h1 className="text-center">Wallet</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container">
                <Wallet connectWallet={activateWallet} />
            </section>

            <Footer />
        </div>
    );
};
export default WalletData;
