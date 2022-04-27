import { Contract, utils } from "ethers";
import MarketPlaceABI from "../Abi/MarketPlace.json";

export const MarketPlaceABIInterface = new utils.Interface(MarketPlaceABI);
const MarketPlaceContractAddress = "0x591B7459Fe25AB3263aef2b088A6621D6280D790";

export const MarketPlaceContract = new Contract(MarketPlaceContractAddress, MarketPlaceABIInterface);

export const totalNFTsOnMarketplace = (Contract) => ({
  abi: MarketPlaceABIInterface,
  address: Contract,
  method: "getListedNFTsOnMarketplaceLength",
});

export const getListedNFTCall = (Contract, nftAddress) => ({
  abi: MarketPlaceABIInterface,
  address: Contract,
  method: "getListedTokenIds",
  args: [nftAddress],
});

export const getNumberOfListedNFTsCall = (Contract, nftAddress) => ({
  abi: MarketPlaceABIInterface,
  address: Contract,
  method: "getNumberOfListedNFTs",
  args: [nftAddress],
});

export const getPeakAddressCall = (Contract) => ({
  abi: MarketPlaceABIInterface,
  address: Contract,
  method: "getPeakAddress",
});

export const getRoyaltyAmountCall = (Contract, nftAddress, tokenId) => ({
  abi: MarketPlaceABIInterface,
  address: Contract,
  method: "getRoyaltyAmount",
  args: [nftAddress, tokenId],
});

export const getNFTA = (Contract) => ({
  abi: MarketPlaceABIInterface,
  address: Contract,
  method: "NFTA",
});

export const getNFTATreasury = (Contract) => ({
  abi: MarketPlaceABIInterface,
  address: Contract,
  method: "NFTATreasury",
});

export const getOwner = (Contract) => ({
  abi: MarketPlaceABIInterface,
  address: Contract,
  method: "owner",
});

export const getPlatformFee = (Contract) => ({
  abi: MarketPlaceABIInterface,
  address: Contract,
  method: "platformFee",
});

export const getListedNFTs = (contract, tokenId) => ({
  abi: MarketPlaceABIInterface,
  address: contract,
  method: "listedNFTsOnMarketplace",
  args: [tokenId],
});

export const buyTokenFunc = "buyToken";

export const listTokenToMarketplaceFunc = "listTokenToMarketplace";

export const TokenContractAddress = "0xAC08645B3E02B759500d78bB4F687F3855aBfa67";

export const onERC1155BatchReceivedFunc = "onERC1155BatchReceived";

export const onERC1155ReceivedFunc = "onERC1155Received";

export const onERC721ReceivedFunc = "onERC721Received";

export const participateInAuctionFunc = "participateInAuction";

export const refundAuctionTokensFunc = "refundAuctionTokens";

export const renounceOwnershipFunc = "renounceOwnershipFunc";

export const setPlatformFeesFunc = "setPlatformFees";

export const startAuctionFunc = "startAuction";

export const transferOwnershipFunc = "transferOwnership";

export const unlistTokenFromMarketplaceFunc = "unlistTokenFromMarketplace";

export const updateListedTokenFunc = "updateListedToken";

export const upgradeToFunc = "upgradeTo";

export const upgradeToAndCallFunc = "upgradeToAndCall";
