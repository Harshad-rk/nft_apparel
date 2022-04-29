import React, { useEffect, useState } from "react";
import Clock from "../components/Clock";
import Footer from "../components/footer";
import axios from "axios";
import { useEthers } from "@usedapp/core";
import { useUtilContractFunction } from "../../utils/useDappUtility";
import {
    NFTBaseContract,
    mintTokenFunc,
} from "../../contractUtils/Services/NFtContract";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { useNavigate } from "@reach/router";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import * as Yup from "yup";
import black from "../../assets/black.jpg";
import {
    listTokenToMarketplaceFunc,
    MarketPlaceContract,
} from "../../contractUtils/Services/MarketPlace";
import { listTokenToMarketplace } from "../../utility/contractMethods/Marketplace";
import { utils } from "ethers";
import {
    tokenName,
    tokenSymbol,
    tokenURI,
    mintToken,
    balanceOfToken,
    setApproveForAllToken,
    tokenAllowance,
} from "../../utility/contractMethods/NFTBase";
import { toast } from "react-toastify";
import { MarketPlaceAddress } from "../../config";

export default function Createpage() {
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

    // const { account } = useEthers();
    const [file, setFile] = useState();
    const [createLoader, setCreateLoader] = useState(false);
    const [listLoader, setListLoader] = useState(false);

    const [imgIpfsHashUrl, setImgIpfsHashURL] = useState();
    console.log("imgIpfsHashUrl: ", imgIpfsHashUrl);
    const navigate = useNavigate();
    // const { isWalletConnected } = useSelector(
    //     (state) => state.masterDataReducer,
    // );
    const fileHandler = (e) => {
        setFile(e.target.files[0]);
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required("Name required"),
            description: Yup.string()
                .min(10, "Description must be minimum 30 character")
                .required("Description required"),
        }),
        onSubmit: async (values) => {
            setCreateLoader(true);
            const body = {
                image: imgIpfsHashUrl,
                name: values?.name,
                description: values?.description,
            };
            const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

            try {
                const filePin = await axios.post(url, body, {
                    headers: {
                        pinata_api_key: apiKey,
                        pinata_secret_api_key: secretApiKey,
                    },
                });
                const mint = await mintToken(
                    account,
                    `https://gateway.pinata.cloud/ipfs/${filePin?.data?.IpfsHash}`,
                );
                if (mint.status) {
                    formik.resetForm();
                    setImgIpfsHashURL("");
                    toast.success("Token Minted");
                } else {
                    toast.error(mint.error.message);
                }
                setCreateLoader(false);
            } catch (err) {
                toast.error(err.message);
                console.log(err);
                setCreateLoader(false);
            }
        },
    });

    const ListNFT = useUtilContractFunction(
        MarketPlaceContract,
        listTokenToMarketplaceFunc,
    );
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
                const checkApprove = await tokenAllowance(
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
                        toast.success("Token Listed");
                        formikHandler.resetForm();
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
                        toast.success("Token Approved");
                        formikHandler.resetForm();

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
                            toast.success("Token Listed");
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

    const formikTouch = formik?.touched;
    const formikErr = formik?.errors;
    const formikHanlderTouch = formikHandler?.touched;
    const formikHanlderErr = formikHandler?.errors;

    const apiKey = "61acfb88c4a44410878c";
    const secretApiKey =
        "544b05976a5d0e1aefab730e720ae3c49daa2977a25fc636e18242f52db0db65";

    const ImgIpfsHash = async (file) => {
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        const data = new FormData();

        data.append("file", file);
        try {
            const filePin = await axios.post(url, data, {
                headers: {
                    pinata_api_key: apiKey,
                    pinata_secret_api_key: secretApiKey,
                },
            });
            setImgIpfsHashURL(
                `https://ipfs.io/ipfs/${filePin?.data?.IpfsHash}`,
            );
        } catch (err) {
            console.log(err);
        }
    };

    // const mintNFT = useUtilContractFunction(NFTBaseContract, mintTokenFunc);

    useEffect(() => {
        file && ImgIpfsHash(file);
    }, [file]);

    // useEffect(() => {
    //     if (mintNFT.state.status === "Success") {
    //         formik.resetForm();
    //         setFile();
    //     }
    // }, [mintNFT.state]);

    const mintTokenFunction = async (userAccount, uri) => {
        try {
            if (account && imgIpfsHashUrl) {
                const mintTokenData = await mintToken(userAccount, uri);
                if (mintTokenData.status) {
                    toast.success("Token Minted");
                } else {
                    toast.error(mintTokenData.error.message);
                }
            }
        } catch (err) {
            toast.error(err);
        }
    };

    return (
        <div>
            <section className="jumbotron breadcumb no-bg">
                <div className="mainbreadcumb">
                    <div className="container">
                        <div className="row m-10-hor">
                            <div className="col-12">
                                <h1 className="text-center">Create</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container">
                <div className="row">
                    <div className="col-lg-7 offset-lg-1 mb-5">
                        <form
                            id="form-create-item"
                            className="form-border"
                            action="#"
                            onSubmit={formik.handleSubmit}
                        >
                            <div className="field-set">
                                <h5>Upload file</h5>

                                <div className="d-create-file">
                                    <p id="file_name">
                                        PNG, JPG, GIF, WEBP or MP4. Max 200mb.
                                    </p>

                                    <p>{file && file.name}</p>

                                    <div className="browse">
                                        <input
                                            type="button"
                                            id="get_file"
                                            className="btn-main"
                                            value="Browse"
                                        />
                                        <input
                                            id="upload_file"
                                            type="file"
                                            onChange={(e) => fileHandler(e)}
                                        />
                                    </div>
                                </div>

                                <div className="spacer-single"></div>

                                <h5>Title</h5>
                                <input
                                    type="text"
                                    name="item_title"
                                    className="form-control"
                                    style={{
                                        border:
                                            formikTouch?.name &&
                                            formikErr?.name &&
                                            "0.5px solid red",
                                    }}
                                    id="item_title"
                                    value={formik?.values?.name}
                                    onChange={(e) =>
                                        formik.setFieldValue(
                                            "name",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g. 'Crypto Funk"
                                />
                                <div className="spacer-10"></div>

                                <h5>Description</h5>
                                <textarea
                                    data-autoresize
                                    name="item_desc"
                                    id="item_desc"
                                    style={{
                                        border:
                                            formikTouch?.description &&
                                            formikErr?.description &&
                                            "0.5px solid red",
                                    }}
                                    value={formik?.values?.description}
                                    onChange={(e) =>
                                        formik.setFieldValue(
                                            "description",
                                            e.target.value,
                                        )
                                    }
                                    className="form-control"
                                    placeholder="e.g. 'This is very limited item'"
                                ></textarea>

                                <div className="spacer-10"></div>

                                {/* <h5>Price</h5>
                                <input
                                    type="text"
                                    name="item_price"
                                    id="item_price"
                                    style={{
                                        border:
                                            formikTouch?.price &&
                                            formikErr?.price &&
                                            "0.5px solid red",
                                    }}
                                    value={formik?.values?.price}
                                    onChange={(e) =>
                                        formik.setFieldValue(
                                            "price",
                                            e.target.value,
                                        )
                                    }
                                    className="form-control"
                                    placeholder="enter price for one item (ETH)"
                                />

                                <div className="spacer-10"></div>

                                <h5>Royalties</h5>
                                <input
                                    type="text"
                                    name="item_royalties"
                                    id="item_royalties"
                                    style={{
                                        border:
                                            formikTouch?.royalties &&
                                            formikErr?.royalties &&
                                            "0.5px solid red",
                                    }}
                                    value={formik?.values?.royalties}
                                    onChange={(e) =>
                                        formik.setFieldValue(
                                            "royalties",
                                            e.target.value,
                                        )
                                    }
                                    className="form-control"
                                    placeholder="suggested: 0, 10%, 20%, 30%. Maximum is 70%"
                                /> */}

                                <div className="spacer-10"></div>
                                {imgIpfsHashUrl && imgIpfsHashUrl !== "" && (
                                    <h5>IPFS Hash</h5>
                                )}
                                <h5>{imgIpfsHashUrl}</h5>
                                <div className="spacer-10"></div>

                                {(formikTouch?.name ||
                                    formikTouch?.description ||
                                    formikTouch?.price ||
                                    formikTouch?.royalties) &&
                                    !account && (
                                        <h5 style={{ color: "red" }}>
                                            Inputs are required
                                        </h5>
                                    )}
                                <div className="spacer-10"></div>
                                {createLoader ? (
                                    <input
                                        type="submit"
                                        id="submit"
                                        className="btn-main"
                                        style={{ background: "gray" }}
                                        value={"Loading..."}
                                        disabled={true}
                                    />
                                ) : (
                                    account && (
                                        <input
                                            type="submit"
                                            id="submit"
                                            className="btn-main"
                                            style={{
                                                background: !file && "gray",
                                            }}
                                            value={"Create Item"}
                                            disabled={!file}
                                        />
                                    )
                                )}

                                {!account && (
                                    <input
                                        type="submit"
                                        id="submit"
                                        className="btn-main"
                                        value={"Connect wallet"}
                                        onClick={() => navigate("/wallet")}
                                    />
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="col-lg-3 col-sm-6 col-xs-12">
                        <h5>Preview item</h5>
                        <div className="nft__item m-0">
                            {/* <div className="de_countdown">
                                <Clock deadline="December, 30, 2021" />
                            </div>
                            <div className="author_list_pp">
                                <span>
                                    <img
                                        className="lazy"
                                        src="./img/author/author-1.jpg"
                                        alt=""
                                    />
                                    <i className="fa fa-check"></i>
                                </span>
                            </div> */}
                            <div className="nft__item_wrap">
                                <span>
                                    <img
                                        src={
                                            (!file && black) ||
                                            (file && URL.createObjectURL(file))
                                        }
                                        id="get_file_2"
                                        className="lazy nft__item_preview"
                                        alt=""
                                    />
                                </span>
                            </div>
                            <div className="nft__item_info">
                                <span>Title</span>
                                <span>
                                    <h4>{formik.values.name}</h4>
                                </span>
                                <span>Description</span>

                                <span>
                                    <h5>{formik.values.description}</h5>
                                </span>
                                {/* <div className="nft__item_price">
                                    0.08 ETH<span>1/20</span>
                                </div>
                                <div className="nft__item_action">
                                    <span>Place a bid</span>
                                </div>
                                <div className="nft__item_like">
                                    <i className="fa fa-heart"></i>
                                    <span>50</span>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
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
                                    value={formikHandler?.values?.tokenAmout}
                                    onChange={(e) =>
                                        formikHandler.setFieldValue(
                                            "tokenAmout",
                                            e.target.value.trim(),
                                        )
                                    }
                                    className="form-control"
                                    placeholder="Enter token amount of ERC1155, if it's ERC721 enter 0"
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
                                    value={formikHandler?.values?.priceMetis}
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

                                <h5>Set royalty fee (In Percentage)</h5>
                                <input
                                    name="setRoyalFee"
                                    id="item_desc"
                                    style={{
                                        border:
                                            formikHanlderTouch?.setRoyalFee &&
                                            formikHanlderErr?.setRoyalFee &&
                                            "0.5px solid red",
                                    }}
                                    value={formikHandler?.values?.setRoyalFee}
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
                                {listLoader ? (
                                    <input
                                        type="submit"
                                        id="submit"
                                        className="btn-main"
                                        value={"Loading..."}
                                        style={{ background: "gray" }}
                                    />
                                ) : (
                                    account && (
                                        <input
                                            type="submit"
                                            id="submit"
                                            className="btn-main"
                                            value={"List NFT"}
                                        />
                                    )
                                )}
                                {!account && (
                                    <input
                                        type="submit"
                                        id="submit"
                                        className="btn-main"
                                        value={"Connect wallet"}
                                        onClick={() => navigate("/wallet")}
                                    />
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
