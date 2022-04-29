import React, { Component, useState, useEffect } from "react";
import ColumnZero from "../components/ColumnZero";
import ColumnZeroTwo from "../components/ColumnZeroTwo";
import ColumnZeroThree from "../components/ColumnZeroThree";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import {
    getNumberOfListedNFT,
    listedNFTsOnMarketplace,
    getNFTDetails,
    tokenListedByUser,
} from "../../utility/contractMethods/Marketplace";
import { tokenURI } from "../../utility/contractMethods/NFTBase";
import axios from "axios";
import { Link } from "@reach/router";
import { userToken } from "../../utility/contractMethods/NFTBase";
import {
    tokenApprove,
    tokenAllowance,
} from "../../utility/contractMethods/token";
import { useWeb3React } from "@web3-react/core";
import { NFTAddress } from "../../config";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #212428;
  }
`;

const Colection = function () {
    const { account } = useWeb3React();

    const [totalNFT, setTotalNft] = useState([]);
    const [NftListData, setNftListData] = useState([]);
    const [listedNftListData, setListedNftListData] = useState([]);

    useEffect(() => {
        if (account) {
            const getNoOfNft = async () => {
                const nftTotalData = await userToken(account, NFTAddress);
                let updateData = [];
                nftTotalData.forEach((element) => {
                    updateData.push(element);
                });

                setTotalNft(updateData);
            };
            getNoOfNft();
        }
    }, [account]);

    useEffect(() => {
        if (account) {
            const getNoOfNft = async () => {
                const nftTotalData = await tokenListedByUser(account);
                let updateData = [];

                for (let ele of nftTotalData) {
                    const d = await getListedTokenList(ele);

                    if (d.status) {
                        updateData.push(d.data);
                    }
                }

                setListedNftListData(updateData);
            };
            getNoOfNft();
        }
    }, [account]);

    useEffect(() => {
        if (totalNFT.length > 0) {
            const getNoOfNft = async () => {
                let nftList = [];
                for (let ele of totalNFT) {
                    const nftTotalData = await getTokenList(ele);

                    if (nftTotalData.status) {
                        nftList.push(nftTotalData.data);
                    }
                }
                setNftListData(nftList);
            };
            getNoOfNft();
        }
    }, [totalNFT]);

    const getTokenList = (index) => {
        return new Promise(async (resolve) => {
            let nftData = await tokenURI(index, NFTAddress);
            if (nftData) {
                const NftData = await axios.get(nftData);
                if (NftData && NftData.data) {
                    resolve({
                        status: true,
                        data: {
                            name: NftData.data.name,
                            image: NftData.data.image,
                            nftAddress: NFTAddress,
                            tokenId: index,
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

    const getListedTokenList = (index) => {
        return new Promise(async (resolve) => {
            let nftData = await tokenURI(index.tokenId, index.nftAddress);
            if (nftData) {
                const NftData = await axios.get(nftData);
                if (NftData && NftData.data) {
                    resolve({
                        status: true,
                        data: {
                            name: NftData.data.name,
                            image: NftData.data.image,
                            nftAddress: index.nftAddress,
                            tokenId: index.tokenId,
                            royalties: NftData.data.royalties,
                            metisPrice: index.metisPrice,
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

    const [openMenu, setOpenMenu] = React.useState(true);
    const [openMenu1, setOpenMenu1] = React.useState(false);
    const [openMenu2, setOpenMenu2] = React.useState(false);
    const handleBtnClick = (): void => {
        setOpenMenu(!openMenu);
        setOpenMenu1(false);
        setOpenMenu2(false);
        document.getElementById("Mainbtn").classList.add("active");
        document.getElementById("Mainbtn1").classList.remove("active");
        document.getElementById("Mainbtn2").classList.remove("active");
    };
    const handleBtnClick1 = (): void => {
        setOpenMenu1(!openMenu1);
        setOpenMenu2(false);
        setOpenMenu(false);

        document.getElementById("Mainbtn1") &&
            document.getElementById("Mainbtn1").classList.add("active");
        document.getElementById("Mainbtn") &&
            document.getElementById("Mainbtn").classList.remove("active");
        document.getElementById("Mainbtn2") &&
            document.getElementById("Mainbtn2").classList.remove("active");
    };
    const handleBtnClick2 = (): void => {
        setOpenMenu2(!openMenu2);
        setOpenMenu(false);
        setOpenMenu1(false);
        document.getElementById("Mainbtn2").classList.add("active");
        document.getElementById("Mainbtn").classList.remove("active");
        document.getElementById("Mainbtn1").classList.remove("active");
    };

    return (
        <div>
            <GlobalStyles />

            <section className="container no-bottom">
                <div className="row">
                    <div className="spacer-double"></div>
                    <div className="col-md-12">
                        <div className="d_profile de-flex">
                            <div className="de-flex-col">
                                <div className="profile_avatar">
                                    <img
                                        src="./img/author_single/author_thumbnail.jpg"
                                        alt=""
                                    />
                                    <i className="fa fa-check"></i>
                                    <div className="profile_name">
                                        <h4>
                                            {/* <span className="profile_username">
                                                {account}
                                            </span> */}

                                            {/* <span className="profile_username">
                                                @monicaaa
                                            </span> */}
                                            <span
                                                id="wallet"
                                                className="profile_wallet"
                                            >
                                                {account}
                                            </span>
                                            <button
                                                id="btn_copy"
                                                title="Copy Text"
                                            >
                                                Copy
                                            </button>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="profile_follow de-flex">
                                <div className="de-flex-col">
                                    <div className="profile_follower">
                                        500 followers
                                    </div>
                                </div>
                                <div className="de-flex-col">
                                    <span className="btn-main">Follow</span>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </section>

            <section className="container no-top">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="items_filter">
                            <ul className="de_nav text-left">
                                <li id="Mainbtn" className="active">
                                    <span onClick={handleBtnClick}>
                                        On Sale
                                    </span>
                                </li>
                                <li id="Mainbtn1" className="">
                                    <span onClick={handleBtnClick1}>
                                        Created
                                    </span>
                                </li>
                                {/* <li id="Mainbtn2" className="">
                                    <span onClick={handleBtnClick2}>Liked</span>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                </div>
                {openMenu && (
                    <div id="zero1" className="onStep fadeIn">
                        <ColumnZeroTwo myNftList={listedNftListData} />
                    </div>
                )}
                {openMenu1 && (
                    <div id="zero2" className="onStep fadeIn">
                        <ColumnZeroTwo myNftList={NftListData} />
                    </div>
                )}
                {openMenu2 && (
                    <div id="zero3" className="onStep fadeIn">
                        <ColumnZeroThree />
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
};
export default Colection;
