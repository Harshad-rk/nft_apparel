import { Link } from "@reach/router";
import React, { Component, useState } from "react";
import styled from "styled-components";
import Clock from "./Clock";

const Outer = styled.div`
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 8px;
`;

const Responsive = ({ myNftList }) => {
    const [height, setHeight] = useState(0);

    function onImgLoad({ target: img }) {
        let currentHeight = height;
        if (currentHeight < img.offsetHeight) {
            setHeight(img.offsetHeight);
        }
    }

    return (
        <div className="row">
            {myNftList.map((nft, index) => (
                <div
                    key={index}
                    className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
                >
                    <Link
                        to={`/itemDetail/${nft.nftAddress}/${nft.tokenId}`}
                        key={index}
                    >
                        <div className="nft__item">
                            {/* { nft.deadline &&
                        <div className="de_countdown">
                            <Clock deadline={nft.deadline} />
                        </div>
                    }
                    <div className="author_list_pp">
                        <span onClick={()=> window.open(nft.authorLink, "_self")}>                                    
                            <img className="lazy" src={nft.authorImg} alt=""/>
                            <i className="fa fa-check"></i>
                        </span>
                    </div> */}
                            <div
                                className="nft__item_wrap"
                                style={{ height: `${height}px` }}
                            >
                                <Outer>
                                    <span
                                        onClick={() =>
                                            window.open(
                                                nft.previewLink,
                                                "_self",
                                            )
                                        }
                                    >
                                        <img
                                            onLoad={onImgLoad}
                                            src={nft.image}
                                            className="lazy nft__item_preview"
                                            alt=""
                                        />
                                    </span>
                                </Outer>
                            </div>
                            <div className="nft__item_info">
                                <span
                                    onClick={() =>
                                        window.open(nft.nftLink, "_self")
                                    }
                                >
                                    <h4>{nft.name}</h4>
                                </span>
                                {nft.metisPrice ? (
                                    <div className="nft__item_price">
                                        {nft.metisPrice / 10 ** 18}
                                        <span></span>
                                    </div>
                                ) : (
                                    ""
                                )}
                                {/* <div className="nft__item_action">
                            <span onClick={()=> window.open(nft.bidLink, "_self")}>Place a bid</span>
                        </div>
                        <div className="nft__item_like">
                            <i className="fa fa-heart"></i><span>{nft.likes}</span>
                        </div>                             */}
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default Responsive;
