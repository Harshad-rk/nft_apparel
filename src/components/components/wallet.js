import React from "react";
// import { useEthers } from "@usedapp/core";
import MakeQuerablePromise from "../../utils/querable-promise";
import { useDispatch, useSelector } from "react-redux";
import { setIsWalletConnected } from "../../redux/action/master-data-actions";

const Wallet = ({ connectWallet }) => {
    // const { account, activateBrowserWallet, deactivate } = useEthers();
    // const dispatch = useDispatch();

    // const connectWallet = () => {
    //   const activateBrowserWalletPromise = MakeQuerablePromise(activateBrowserWallet());

    //   if (!account) {
    //     activateBrowserWalletPromise.then(
    //       function (res) {
    //         if (activateBrowserWalletPromise.isFulfilled()) {
    //           dispatch(setIsWalletConnected(true));
    //         } else if (activateBrowserWalletPromise.isPending()) {
    //         } else if (activateBrowserWalletPromise.isRejected()) {
    //         }
    //       },
    //       function () {
    //         dispatch(setIsWalletConnected(false));
    //       }
    //     );
    //   } else if (account) {
    //     deactivate();
    //     dispatch(setIsWalletConnected(false));
    //   }
    // };

    return (
        <div className="row">
            <div className="col-lg-3 mb30">
                <span
                    className="box-url"
                    onClick={() => {
                        connectWallet();
                    }}
                >
                    <span className="box-url-label">Most Popular</span>
                    <img src="./img/wallet/1.png" alt="" className="mb20" />
                    <h4>Metamask</h4>
                    <p>
                        Start exploring blockchain applications in seconds.
                        Trusted by over 1 million users worldwide.
                    </p>
                </span>
            </div>

            {/* <div className="col-lg-3 mb30">
        <span className="box-url">
          <img src="./img/wallet/2.png" alt="" className="mb20" />
          <h4>Bitski</h4>
          <p>Bitski connects communities, creators and brands through unique, ownable digital content.</p>
        </span>
      </div>

      <div className="col-lg-3 mb30">
        <span className="box-url">
          <img src="./img/wallet/3.png" alt="" className="mb20" />
          <h4>Fortmatic</h4>
          <p>Let users access your Ethereum app from anywhere. No more browser extensions.</p>
        </span>
      </div>

      <div className="col-lg-3 mb30">
        <span className="box-url">
          <img src="./img/wallet/4.png" alt="" className="mb20" />
          <h4>WalletConnect</h4>
          <p>Open source protocol for connecting decentralised applications to mobile wallets.</p>
        </span>
      </div>

      <div className="col-lg-3 mb30">
        <span className="box-url">
          <img src="./img/wallet/5.png" alt="" className="mb20" />
          <h4>Coinbase Wallet</h4>
          <p>The easiest and most secure crypto wallet. ... No Coinbase account required.</p>
        </span>
      </div>

      <div className="col-lg-3 mb30">
        <span className="box-url">
          <img src="./img/wallet/6.png" alt="" className="mb20" />
          <h4>Arkane</h4>
          <p>Make it easy to create blockchain applications with secure wallets solutions.</p>
        </span>
      </div>

      <div className="col-lg-3 mb30">
        <span className="box-url">
          <img src="./img/wallet/7.png" alt="" className="mb20" />
          <h4>Authereum</h4>
          <p>Your wallet where you want it. Log into your favorite dapps with Authereum.</p>
        </span>
      </div>

      <div className="col-lg-3 mb30">
        <span className="box-url">
          <span className="box-url-label">Most Simple</span>
          <img src="./img/wallet/8.png" alt="" className="mb20" />
          <h4>Torus</h4>
          <p>Open source protocol for connecting decentralised applications to mobile wallets.</p>
        </span>
      </div> */}
        </div>
    );
};
export default Wallet;
