import React, { Component, useState, useEffect } from "react";
import Clock from "./Clock";
import { useWeb3React } from "@web3-react/core";
import { getNumberOfListedNFT } from "../../utility/contractMethods/Marketplace";

const Responsive = () => {
    const { account } = useWeb3React();
    console.log(
        "%c 🥘 account: ",
        "font-size:20px;background-color: #FFDD4D;color:#fff;",
        account,
    );
    const [totalNFT, setTotalNft] = useState(0);

    const dummyData = [
        {
            deadline: "December, 30, 2021",
            authorLink: "#",
            nftLink: "#",
            bidLink: "#",
            authorImg: "./img/author/author-1.jpg",
            previewImg: "./img/items/static-1.jpg",
            title: "Pinky Ocean",
            price: "0.08 ETH",
            bid: "1/20",
            likes: 50,
        },
        {
            deadline: "",
            authorLink: "#",
            nftLink: "#",
            bidLink: "#",
            authorImg: "./img/author/author-10.jpg",
            previewImg: "./img/items/static-2.jpg",
            title: "Deep Sea Phantasy",
            price: "0.06 ETH",
            bid: "1/22",
            likes: 80,
        },
        {
            deadline: "",
            authorLink: "#",
            nftLink: "#",
            bidLink: "#",
            authorImg: "./img/author/author-11.jpg",
            previewImg: "./img/items/static-3.jpg",
            title: "Rainbow Style",
            price: "0.05 ETH",
            bid: "1/11",
            likes: 97,
        },
        {
            deadline: "January, 1, 2022",
            authorLink: "#",
            nftLink: "#",
            bidLink: "#",
            authorImg: "./img/author/author-12.jpg",
            previewImg: "./img/items/static-4.jpg",
            title: "Two Tigers",
            price: "0.08 ETH",
            bid: "1/20",
            likes: 50,
        },
        {
            deadline: "",
            authorLink: "#",
            nftLink: "#",
            bidLink: "#",
            authorImg: "./img/author/author-9.jpg",
            previewImg: "./img/items/anim-4.webp",
            title: "The Truth",
            price: "0.08 ETH",
            bid: "1/20",
            likes: 50,
        },
        {
            deadline: "January, 15, 2022",
            authorLink: "#",
            nftLink: "#",
            bidLink: "#",
            authorImg: "./img/author/author-2.jpg",
            previewImg: "./img/items/anim-2.webp",
            title: "Running Puppets",
            price: "0.08 ETH",
            bid: "1/20",
            likes: 50,
        },
        {
            deadline: "",
            authorLink: "#",
            nftLink: "#",
            bidLink: "#",
            authorImg: "./img/author/author-3.jpg",
            previewImg: "./img/items/anim-1.webp",
            title: "USA Wordmation",
            price: "0.08 ETH",
            bid: "1/20",
            likes: 50,
        },
        {
            deadline: "",
            authorLink: "#",
            nftLink: "#",
            bidLink: "#",
            authorImg: "./img/author/author-4.jpg",
            previewImg: "./img/items/anim-5.webp",
            title: "Loop Donut",
            price: "0.08 ETH",
            bid: "1/20",
            likes: 50,
        },
        {
            deadline: "January, 3, 2022",
            authorLink: "#",
            nftLink: "#",
            bidLink: "#",
            authorImg: "./img/author/author-5.jpg",
            previewImg: "./img/items/anim-3.webp",
            title: "Lady Copter",
            price: "0.08 ETH",
            bid: "1/20",
            likes: 50,
        },
        {
            deadline: "",
            authorLink: "#",
            nftLink: "#",
            bidLink: "#",
            authorImg: "./img/author/author-7.jpg",
            previewImg: "./img/items/static-5.jpg",
            title: "Purple Planet",
            price: "0.08 ETH",
            bid: "1/20",
            likes: 50,
        },
        {
            deadline: "",
            authorLink: "#",
            nftLink: "#",
            bidLink: "#",
            authorImg: "./img/author/author-6.jpg",
            previewImg: "./img/items/anim-6.webp",
            title: "Oh Yeah!",
            price: "0.08 ETH",
            bid: "1/20",
            likes: 50,
        },
        {
            deadline: "January, 10, 2022",
            authorLink: "#",
            nftLink: "#",
            bidLink: "#",
            authorImg: "./img/author/author-8.jpg",
            previewImg: "./img/items/anim-7.webp",
            title: "This is Our Story",
            price: "0.08 ETH",
            bid: "1/20",
            likes: 50,
        },
        {
            deadline: "",
            authorLink: "#",
            nftLink: "#",
            bidLink: "#",
            authorImg: "./img/author/author-9.jpg",
            previewImg: "./img/items/static-6.jpg",
            title: "Pixel World",
            price: "0.08 ETH",
            bid: "1/20",
            likes: 50,
        },
        {
            deadline: "January, 10, 2022",
            authorLink: "#",
            nftLink: "#",
            bidLink: "#",
            authorImg: "./img/author/author-12.jpg",
            previewImg: "./img/items/anim-8.webp",
            title: "I Believe I Can Fly",
            price: "0.08 ETH",
            bid: "1/20",
            likes: 50,
        },
    ];

    useEffect(() => {
        if (account) {
            const getNoOfNft = async () => {
                const nftTotalData = await getNumberOfListedNFT();
                setTotalNft(nftTotalData);
            };
            getNoOfNft();
        }
    }, [account]);

    const [nfts, setNfts] = useState(this.dummyData.slice(0, 8));
    const [height, setHeight] = useState(0);

    const loadMore = () => {
        let nftState = nfts;
        let start = nftState.length;
        let end = nftState.length + 4;
        setNfts([...nftState, ...dummyData.slice(start, end)]);
    };

    function onImgLoad({ target: img }) {
        let currentHeight = height;
        if (currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight);
        }
    }

    return (
        <div className="row">
            {nfts.map((nft, index) => (
                <div
                    key={index}
                    className="d-item col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4"
                >
                    <div className="nft__item m-0">
                        {nft.deadline && (
                            <div className="de_countdown">
                                <Clock deadline={nft.deadline} />
                            </div>
                        )}
                        <div className="author_list_pp">
                            <span
                                onClick={() =>
                                    window.open(nft.authorLink, "_self")
                                }
                            >
                                <img
                                    className="lazy"
                                    src={nft.authorImg}
                                    alt=""
                                />
                                <i className="fa fa-check"></i>
                            </span>
                        </div>
                        <div
                            className="nft__item_wrap"
                            style={{ height: `${height}px` }}
                        >
                            <span>
                                <img
                                    onLoad={onImgLoad}
                                    src={nft.previewImg}
                                    className="lazy nft__item_preview"
                                    alt=""
                                />
                            </span>
                        </div>
                        <div className="nft__item_info">
                            <span
                                onClick={() =>
                                    window.open(nft.nftLink, "_self")
                                }
                            >
                                <h4>{nft.title}</h4>
                            </span>
                            <div className="nft__item_price">
                                {nft.price}
                                <span>{nft.bid}</span>
                            </div>
                            <div className="nft__item_action">
                                <span
                                    onClick={() =>
                                        window.open(nft.bidLink, "_self")
                                    }
                                >
                                    Place a bid
                                </span>
                            </div>
                            <div className="nft__item_like">
                                <i className="fa fa-heart"></i>
                                <span>{nft.likes}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {nfts.length !== dummyData.length && (
                <div className="col-lg-12">
                    <div className="spacer-single"></div>
                    <span
                        onClick={() => loadMore()}
                        className="btn-main lead m-auto"
                    >
                        Load More
                    </span>
                </div>
            )}
        </div>
    );
};

export default Responsive;
