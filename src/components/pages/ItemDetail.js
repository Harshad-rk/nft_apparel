import React, { Component, useState, useEffect } from "react";
import Clock from "../components/Clock";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import { useLocation } from "@reach/router";
import { useWeb3React } from "@web3-react/core";
import { tokenURI } from "../../utility/contractMethods/NFTBase";
import {
    getNumberOfListedNFT,
    listedNFTsOnMarketplace,
    getNFTDetails,
    buyToken,
    getPeakAddress,
} from "../../utility/contractMethods/Marketplace";
import axios from "axios";
import { toast } from "react-toastify";
import {
    tokenApprove,
    tokenAllowance,
} from "../../utility/contractMethods/token";
import { MarketPlaceAddress } from "../../config";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #212428;
  }
`;

const Colection = function () {
    const location = useLocation();
    const { account } = useWeb3React();

    const address = location.pathname.split("/")[2];

    const id = location.pathname.split("/")[3];
    const [nftData, setNftData] = useState();
    const [peakAddress, setPeakAddress] = useState(null);
    const [changeState, setChangeState] = useState(false);
    const [userDepositAllowBalance, setUserDepositAllowBalance] = useState(0);

    useEffect(() => {
        if ((address, id, account, peakAddress)) {
            const getNoOfNft = async () => {
                const nftTotalData = await getTokenList(address, id);
                if (nftTotalData.status) {
                    setNftData(nftTotalData.data);
                }
            };
            getNoOfNft();
        }
    }, [address, account, id]);

    useEffect(() => {
        if (account) {
            const getNoOfNft = async () => {
                const nftTotalData = await getPeakAddress();

                setPeakAddress(nftTotalData);
            };
            getNoOfNft();
        }
    }, [account]);

    useEffect(() => {
        if (account && peakAddress !== "") {
            const getUserDepositAllowBalance = async () => {
                const allowanceRes = await tokenAllowance(
                    MarketPlaceAddress,
                    peakAddress,
                    account,
                );
                setUserDepositAllowBalance(allowanceRes / 10 ** 8);
            };
            getUserDepositAllowBalance();
        }
    }, [account, peakAddress, changeState]);

    const getTokenList = (address, id) => {
        return new Promise(async (resolve) => {
            let NFTAddressData = await getNFTDetails(address, id);
            let nftData = await tokenURI(id, address);
            if (nftData) {
                const NftData = await axios.get(nftData);

                if (NftData && NftData.data) {
                    resolve({
                        status: true,
                        data: {
                            name: NftData.data.name,
                            image: NftData.data.image,
                            description: NftData.data.description,
                            metisPrice: NFTAddressData.metisPrice,
                            peakPrice: NFTAddressData.peakPrice,
                            nftAddress: NFTAddressData.nftAddress,
                            isAlreadyListed: NFTAddressData.isAlreadyListed,
                            tokenId: NFTAddressData.tokenId,
                            isERC721: NFTAddressData.isERC721,
                            isForSale: NFTAddressData.isForSale,
                            owner: NFTAddressData.secondaryOwner,
                            royalties: NftData.data.royalties,
                        },
                    });
                }
                resolve({
                    status: false,
                });
            }
            resolve({
                status: false,
            });
        });
    };

    const buyMeticNftToken = async () => {
        try {
            const buyTokenData = await buyToken(
                nftData.nftAddress,
                nftData.tokenId,
                0,
                true,
                true,
                nftData.metisPrice,
                account,
            );
            if (buyTokenData.status) {
                toast.success("token Buy SuccessFully");
            } else {
                toast.error(buyTokenData.error.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };
    const buyPeakNftToken = async () => {
        try {
            const buyTokenData = await buyToken(
                nftData.nftAddress,
                nftData.tokenId,
                0,
                false,
                true,
                0,
                account,
            );
            if (buyTokenData.status) {
                toast.success("token Buy SuccessFully");
            } else {
                toast.error(buyTokenData.error.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const approveToken = async () => {
        try {
            const calAllowToken = await tokenApprove(
                MarketPlaceAddress,
                peakAddress,
                account,
            );
            if (calAllowToken.status === true) {
                toast.success("token Approved");
                setChangeState(!changeState);
            } else {
                toast.error(calAllowToken.error.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const [openMenu, setOpenMenu] = React.useState(true);
    const [openMenu1, setOpenMenu1] = React.useState(false);
    const handleBtnClick = (): void => {
        setOpenMenu(!openMenu);
        setOpenMenu1(false);
        document.getElementById("Mainbtn").classList.add("active");
        document.getElementById("Mainbtn1").classList.remove("active");
    };
    const handleBtnClick1 = (): void => {
        setOpenMenu1(!openMenu1);
        setOpenMenu(false);
        document.getElementById("Mainbtn1").classList.add("active");
        document.getElementById("Mainbtn").classList.remove("active");
    };
    return (
        <div>
            <GlobalStyles />

            <section className="container">
                <div className="row mt-md-5 pt-md-4">
                    <div className="col-md-6 text-center">
                        <img
                            src={nftData?.image}
                            className="img-fluid img-rounded mb-sm-30"
                            alt=""
                        />
                    </div>
                    <div className="col-md-6">
                        <div className="item_info">
                            {/* Auctions ends in
                            <div className="de_countdown">
                                <Clock deadline="December, 30, 2021" />
                            </div> */}
                            <h2>{nftData?.name}</h2>
                            {/* <div className="item_info_counts">
                                <div className="item_info_type">
                                    <i className="fa fa-image"></i>Art
                                </div>
                                <div className="item_info_views">
                                    <i className="fa fa-eye"></i>250
                                </div>
                                <div className="item_info_like">
                                    <i className="fa fa-heart"></i>18
                                </div>
                            </div> */}
                            <p>{nftData?.description}</p>
                            <div className="de_tab" style={{ display: "flex" }}>
                                <ul className="de_nav">
                                    <span
                                        onClick={() => buyMeticNftToken()}
                                        className="btn-main lead m-auto"
                                    >
                                        Buy With Metis
                                    </span>
                                </ul>
                                {userDepositAllowBalance == 0 ? (
                                    <ul>
                                        <span
                                            onClick={() => approveToken()}
                                            className="btn-main lead m-auto"
                                        >
                                            Approve peak
                                        </span>
                                    </ul>
                                ) : (
                                    <ul>
                                        <span
                                            onClick={() => buyPeakNftToken()}
                                            className="btn-main lead m-auto"
                                        >
                                            Buy with peak
                                        </span>
                                    </ul>
                                )}
                            </div>
                            <h6>Creator</h6>
                            <div className="item_author">
                                {/* <div className="author_list_pp">
                                    <span>
                                        <img
                                            className="lazy"
                                            src="./img/author/author-1.jpg"
                                            alt=""
                                        />
                                        <i className="fa fa-check"></i>
                                    </span>
                                </div> */}
                                <div className="author_list_info">
                                    <span>{nftData?.owner}</span>
                                </div>
                            </div>
                            <div className="spacer-40"></div>
                            <div className="de_tab">
                                <ul className="de_nav">
                                    <li id="Mainbtn" className="active">
                                        <span onClick={handleBtnClick}>
                                            Bids
                                        </span>
                                    </li>
                                    <li id="Mainbtn1" className="">
                                        <span onClick={handleBtnClick1}>
                                            History
                                        </span>
                                    </li>
                                </ul>

                                <div className="de_tab_content">
                                    coming Soon
                                    {/* {openMenu && (
                                        <div className="tab-1 onStep fadeIn">
                                            <div className="p_list">
                                                <div className="p_list_pp">
                                                    <span>
                                                        <img
                                                            className="lazy"
                                                            src="./img/author/author-1.jpg"
                                                            alt=""
                                                        />
                                                        <i className="fa fa-check"></i>
                                                    </span>
                                                </div>
                                                <div className="p_list_info">
                                                    Bid accepted{" "}
                                                    <b>0.005 ETH</b>
                                                    <span>
                                                        by <b>Monica Lucas</b>{" "}
                                                        at 6/15/2021, 3:20 AM
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p_list">
                                                <div className="p_list_pp">
                                                    <span>
                                                        <img
                                                            className="lazy"
                                                            src="./img/author/author-2.jpg"
                                                            alt=""
                                                        />
                                                        <i className="fa fa-check"></i>
                                                    </span>
                                                </div>
                                                <div className="p_list_info">
                                                    Bid <b>0.005 ETH</b>
                                                    <span>
                                                        by <b>Mamie Barnett</b>{" "}
                                                        at 6/14/2021, 5:40 AM
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p_list">
                                                <div className="p_list_pp">
                                                    <span>
                                                        <img
                                                            className="lazy"
                                                            src="./img/author/author-3.jpg"
                                                            alt=""
                                                        />
                                                        <i className="fa fa-check"></i>
                                                    </span>
                                                </div>
                                                <div className="p_list_info">
                                                    Bid <b>0.004 ETH</b>
                                                    <span>
                                                        by{" "}
                                                        <b>Nicholas Daniels</b>{" "}
                                                        at 6/13/2021, 5:03 AM
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p_list">
                                                <div className="p_list_pp">
                                                    <span>
                                                        <img
                                                            className="lazy"
                                                            src="./img/author/author-4.jpg"
                                                            alt=""
                                                        />
                                                        <i className="fa fa-check"></i>
                                                    </span>
                                                </div>
                                                <div className="p_list_info">
                                                    Bid <b>0.003 ETH</b>
                                                    <span>
                                                        by <b>Lori Hart</b> at
                                                        6/12/2021, 12:57 AM
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )} */}
                                    {/* {openMenu1 && (
                                        <div className="tab-2 onStep fadeIn">
                                            <div className="p_list">
                                                <div className="p_list_pp">
                                                    <span>
                                                        <img
                                                            className="lazy"
                                                            src="./img/author/author-5.jpg"
                                                            alt=""
                                                        />
                                                        <i className="fa fa-check"></i>
                                                    </span>
                                                </div>
                                                <div className="p_list_info">
                                                    Bid <b>0.005 ETH</b>
                                                    <span>
                                                        by <b>Jimmy Wright</b>{" "}
                                                        at 6/14/2021, 6:40 AM
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p_list">
                                                <div className="p_list_pp">
                                                    <span>
                                                        <img
                                                            className="lazy"
                                                            src="./img/author/author-1.jpg"
                                                            alt=""
                                                        />
                                                        <i className="fa fa-check"></i>
                                                    </span>
                                                </div>
                                                <div className="p_list_info">
                                                    Bid accepted{" "}
                                                    <b>0.005 ETH</b>
                                                    <span>
                                                        by <b>Monica Lucas</b>{" "}
                                                        at 6/15/2021, 3:20 AM
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p_list">
                                                <div className="p_list_pp">
                                                    <span>
                                                        <img
                                                            className="lazy"
                                                            src="./img/author/author-2.jpg"
                                                            alt=""
                                                        />
                                                        <i className="fa fa-check"></i>
                                                    </span>
                                                </div>
                                                <div className="p_list_info">
                                                    Bid <b>0.005 ETH</b>
                                                    <span>
                                                        by <b>Mamie Barnett</b>{" "}
                                                        at 6/14/2021, 5:40 AM
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p_list">
                                                <div className="p_list_pp">
                                                    <span>
                                                        <img
                                                            className="lazy"
                                                            src="./img/author/author-3.jpg"
                                                            alt=""
                                                        />
                                                        <i className="fa fa-check"></i>
                                                    </span>
                                                </div>
                                                <div className="p_list_info">
                                                    Bid <b>0.004 ETH</b>
                                                    <span>
                                                        by{" "}
                                                        <b>Nicholas Daniels</b>{" "}
                                                        at 6/13/2021, 5:03 AM
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p_list">
                                                <div className="p_list_pp">
                                                    <span>
                                                        <img
                                                            className="lazy"
                                                            src="./img/author/author-4.jpg"
                                                            alt=""
                                                        />
                                                        <i className="fa fa-check"></i>
                                                    </span>
                                                </div>
                                                <div className="p_list_info">
                                                    Bid <b>0.003 ETH</b>
                                                    <span>
                                                        by <b>Lori Hart</b> at
                                                        6/12/2021, 12:57 AM
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};
export default Colection;
