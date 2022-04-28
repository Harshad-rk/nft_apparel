import React, { Component, useState, useEffect } from "react";
import Clock from "../components/Clock";
import Footer from "../components/footer";
import { createGlobalStyle } from "styled-components";
import { useLocation, useNavigate } from "@reach/router";
import { useWeb3React } from "@web3-react/core";
import {
    getNumberOfListedNFT,
    listTokenToMarketplace,
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
import {
    tokenName,
    tokenSymbol,
    tokenURI,
    mintToken,
    balanceOfToken,
    setApproveForAllToken,
    NfttokenAllowance,
} from "../../utility/contractMethods/NFTBase";
import { MarketPlaceAddress } from "../../config";
import { Button, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { utils } from "ethers";

import * as Yup from "yup";

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
    const [show, setShow] = useState(false);
    const [listLoader, setListLoader] = useState(false);
    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        if ((address, id, account, peakAddress)) {
            const getNoOfNft = async () => {
                const nftTotalData = await getTokenList(address, id);
                console.log(
                    "%c 🥔 nftTotalData: ",
                    "font-size:20px;background-color: #FFDD4D;color:#fff;",
                    nftTotalData,
                );

                if (nftTotalData.status) {
                    setNftData(nftTotalData.data);
                }
            };
            getNoOfNft();
        }
    }, [address, account, id, peakAddress]);

    useEffect(() => {
        if (account) {
            const getNoOfNftd = async () => {
                const nftTotalData = await getPeakAddress();

                setPeakAddress(nftTotalData);
            };
            getNoOfNftd();
        }
    }, [account]);

    useEffect(() => {
        if (account && peakAddress) {
            const getUserDepositAllowBalance = async () => {
                const allowanceRes = await tokenAllowance(
                    MarketPlaceAddress,
                    peakAddress,
                    account,
                );
                setUserDepositAllowBalance(allowanceRes / 10 ** 18);
            };
            getUserDepositAllowBalance();
        }
    }, [account, peakAddress, changeState]);

    const getTokenList = (address, id) => {
        return new Promise(async (resolve) => {
            let NFTAddressData = await getNFTDetails(address, id);
            if (NFTAddressData.nftAddress == NFTAddressData.secondaryOwner) {
                setIsListed(false);
            }
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
    const [isListed, setIsListed] = React.useState(true);
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
    const formikHandler = useFormik({
        initialValues: {
            nftAddres: "",
            tokenID: "",
            tokenAmout: "",
            priceMetis: "",
            pricePeak: "",
            setRoyalFee: "",
        },
        validationSchema: Yup.object().shape({
            nftAddres: Yup.string().required("Field required"),
            tokenID: Yup.string().required("Field required"),
            tokenAmout: Yup.string().required("Field required"),
            priceMetis: Yup.string().required("Field required"),
            pricePeak: Yup.string().required("Field required"),
            setRoyalFee: Yup.string().required("Field required"),
        }),
        onSubmit: async (values) => {
            try {
                setListLoader(true);
                const checkApprove = await NfttokenAllowance(
                    values?.nftAddres,
                    MarketPlaceAddress,
                    account,
                );
                if (checkApprove) {
                    const listToken = await listTokenToMarketplace(
                        values?.nftAddres,
                        parseInt(values?.tokenID),
                        utils.parseUnits(values?.tokenAmout, 18),
                        utils.parseUnits(values?.priceMetis, 18),
                        utils.parseUnits(values?.pricePeak, 18),
                        Number(values?.setRoyalFee),
                        true,
                        account,
                    );
                    if (listToken.status) {
                        toast.success("token Listed");
                        // =================
                        axios
                            .post("http://52.33.6.138:3000/user/create", {
                                nftAddress: values?.nftAddres,
                                tokenId: parseInt(values?.tokenID),
                                isERC721: true,
                                pricePeak: values?.pricePeak,
                                priceMetis: values?.priceMetis,
                                owner: account,
                                isListed: true,
                                isOnSale: true,
                            })
                            .then((res) => {
                                console.log(
                                    "%c 🥚 res: ",
                                    "font-size:20px;background-color: #7F2B82;color:#fff;",
                                    res,
                                );
                            });
                    } else {
                        toast.error(listToken.error.message);
                    }
                } else {
                    const approve = await setApproveForAllToken(
                        account,
                        values?.nftAddres,
                    );
                    if (approve.status) {
                        toast.success("token Approved");
                        const listToken = await listTokenToMarketplace(
                            values?.nftAddres,
                            parseInt(values?.tokenID),
                            utils.parseUnits(values?.tokenAmout, 18),
                            utils.parseUnits(values?.priceMetis, 18),
                            utils.parseUnits(values?.pricePeak, 18),
                            Number(values?.setRoyalFee),
                            true,
                            account,
                        );
                        if (listToken.status) {
                            toast.success("token Listed");
                            // =================
                            axios.post("http://52.33.6.138:3000/user/create", {
                                nftAddress: values?.nftAddres,
                                tokenId: parseInt(values?.tokenID),
                                isERC721: true,
                                pricePeak: values?.pricePeak,
                                priceMetis: values?.priceMetis,
                                owner: account,
                                isListed: true,
                                isOnSale: true,
                            });
                        } else {
                            toast.error(listToken.error.message);
                        }
                    } else {
                        toast.error(approve.error.message);
                    }
                }
                setListLoader(false);
            } catch (error) {
                setListLoader(false);
                toast.error(error.message);
            }
        },
    });
    const formikHanlderTouch = formikHandler?.touched;
    const formikHanlderErr = formikHandler?.errors;

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
                                {isListed ? (
                                    <>
                                        <ul>
                                            <span
                                                onClick={() =>
                                                    buyMeticNftToken()
                                                }
                                                className="btn-main lead m-auto"
                                            >
                                                Buy With Matic
                                            </span>
                                        </ul>

                                        {userDepositAllowBalance == 0 ? (
                                            <ul>
                                                <span
                                                    onClick={() =>
                                                        approveToken()
                                                    }
                                                    className="btn-main lead m-auto"
                                                >
                                                    Approve peak
                                                </span>
                                            </ul>
                                        ) : (
                                            <ul>
                                                <span
                                                    onClick={() =>
                                                        buyPeakNftToken()
                                                    }
                                                    className="btn-main lead m-auto"
                                                >
                                                    Buy with peak
                                                </span>
                                            </ul>
                                        )}
                                    </>
                                ) : (
                                    <ul className="de_nav">
                                        <span
                                            onClick={() => {
                                                handleShow();
                                                formikHandler.resetForm();
                                                formikHandler.setFieldValue(
                                                    "nftAddres",
                                                    address,
                                                );
                                                formikHandler.setFieldValue(
                                                    "tokenID",
                                                    id,
                                                );
                                            }}
                                            className="btn-main lead m-auto"
                                        >
                                            Token List
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
                                    <span>
                                        {nftData?.owner &&
                                        nftData?.owner !=
                                            "0x0000000000000000000000000000000000000000"
                                            ? nftData.owner
                                            : account}
                                    </span>
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

            <Modal show={show} onHide={handleClose} size="lg">
                {/* <Modal.Header closeButton>
                    <Modal.Title>List your NFT</Modal.Title>
                </Modal.Header> */}
                <Modal.Body>
                    <div className="row">
                        <div className="col-lg-7 offset-lg-1 mb-5">
                            <form
                                id="form-create-item"
                                className="form-border"
                                action="#"
                                onSubmit={formikHandler.handleSubmit}
                            >
                                <div className="field-set">
                                    <h1>List your NFT</h1>
                                    <h5>NFT address</h5>
                                    <input
                                        type="text"
                                        name="nftAddres"
                                        style={{
                                            border:
                                                formikHanlderTouch?.nftAddres &&
                                                formikHanlderErr?.nftAddres &&
                                                "0.5px solid red",
                                        }}
                                        id="item_title"
                                        value={formikHandler?.values?.nftAddres}
                                        onChange={(e) =>
                                            formikHandler.setFieldValue(
                                                "nftAddres",
                                                e.target.value.trim(),
                                            )
                                        }
                                        className="form-control"
                                        placeholder="e.g. 'nft address"
                                    />
                                    <div className="spacer-10"></div>

                                    <h5>Token Id</h5>
                                    <input
                                        name="tokenID"
                                        id="item_desc"
                                        style={{
                                            border:
                                                formikHanlderTouch?.tokenID &&
                                                formikHanlderErr?.tokenID &&
                                                "0.5px solid red",
                                        }}
                                        value={formikHandler?.values?.tokenID}
                                        onChange={(e) =>
                                            formikHandler.setFieldValue(
                                                "tokenID",
                                                e.target.value.trim(),
                                            )
                                        }
                                        className="form-control"
                                        placeholder=""
                                    ></input>

                                    <div className="spacer-10"></div>

                                    <h5>Token amount</h5>
                                    <input
                                        type="text"
                                        name="tokenAmout"
                                        id="item_price"
                                        style={{
                                            border:
                                                formikHanlderTouch?.tokenAmout &&
                                                formikHanlderErr?.tokenAmout &&
                                                "0.5px solid red",
                                        }}
                                        value={
                                            formikHandler?.values?.tokenAmout
                                        }
                                        onChange={(e) =>
                                            formikHandler.setFieldValue(
                                                "tokenAmout",
                                                e.target.value.trim(),
                                            )
                                        }
                                        className="form-control"
                                        placeholder="enter price for one item (ETH)"
                                    />

                                    <div className="spacer-10"></div>

                                    <h5>Price Metis</h5>
                                    <input
                                        name="priceMetis"
                                        id="item_desc"
                                        style={{
                                            border:
                                                formikHanlderTouch?.priceMetis &&
                                                formikHanlderErr?.priceMetis &&
                                                "0.5px solid red",
                                        }}
                                        value={
                                            formikHandler?.values?.priceMetis
                                        }
                                        onChange={(e) =>
                                            formikHandler.setFieldValue(
                                                "priceMetis",
                                                e.target.value.trim(),
                                            )
                                        }
                                        className="form-control"
                                        placeholder=""
                                    ></input>

                                    <div className="spacer-10"></div>

                                    <h5>Price Peak</h5>
                                    <input
                                        name="pricePeak"
                                        id="item_desc"
                                        style={{
                                            border:
                                                formikHanlderTouch?.pricePeak &&
                                                formikHanlderErr?.pricePeak &&
                                                "0.5px solid red",
                                        }}
                                        value={formikHandler?.values?.pricePeak}
                                        onChange={(e) =>
                                            formikHandler.setFieldValue(
                                                "pricePeak",
                                                e.target.value.trim(),
                                            )
                                        }
                                        className="form-control"
                                        placeholder=""
                                    ></input>
                                    <div className="spacer-10"></div>

                                    <h5>Set royalty fee</h5>
                                    <input
                                        name="setRoyalFee"
                                        id="item_desc"
                                        style={{
                                            border:
                                                formikHanlderTouch?.setRoyalFee &&
                                                formikHanlderErr?.setRoyalFee &&
                                                "0.5px solid red",
                                        }}
                                        value={
                                            formikHandler?.values?.setRoyalFee
                                        }
                                        onChange={(e) =>
                                            formikHandler.setFieldValue(
                                                "setRoyalFee",
                                                e.target.value.trim(),
                                            )
                                        }
                                        className="form-control"
                                        placeholder=""
                                    ></input>
                                    <div className="spacer-10"></div>
                                    {(formikHanlderTouch?.nftAddres ||
                                        formikHanlderTouch?.tokenID ||
                                        formikHanlderTouch?.tokenAmout ||
                                        formikHanlderTouch?.priceMetis ||
                                        formikHanlderTouch?.pricePeak ||
                                        formikHanlderTouch?.setRoyalFee) &&
                                        !account && (
                                            <h5 style={{ color: "red" }}>
                                                Inputs are required
                                            </h5>
                                        )}
                                    <div className="spacer-10"></div>
                                    <div
                                        style={{
                                            display: "-webkit-inline-flex",
                                        }}
                                    >
                                        {listLoader ? (
                                            <input
                                                type="submit"
                                                disabled
                                                className="btn-main"
                                                value={"Loading"}
                                                style={{ background: "gray" }}
                                            />
                                        ) : account ? (
                                            <input
                                                type="submit"
                                                id="submit"
                                                className="btn-main"
                                                value={"List NFT"}
                                            />
                                        ) : (
                                            ""
                                        )}
                                        {!account && (
                                            <input
                                                type="submit"
                                                id="submit"
                                                className="btn-main"
                                                value={"Connect wallet"}
                                                onClick={() =>
                                                    navigate("/wallet")
                                                }
                                            />
                                        )}

                                        <input
                                            id="submit"
                                            onClick={handleClose}
                                            className="btn-main"
                                            value={"Cancle"}
                                            style={{
                                                marginLeft: "10px",
                                                background: "gray",
                                            }}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Footer />
        </div>
    );
};

export default Colection;
