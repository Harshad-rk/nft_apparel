import { Contract, utils } from "ethers";
import NftBaseABI from "../Abi/NFTBase.json";

export const NFTBaseABIInterface = new utils.Interface(NftBaseABI);
const NFTBaseContractAddress = "0x79f22287A71e8fF2EF0b0576eFAb4aB9680Ad418";

export const NFTBaseContract = new Contract(NFTBaseContractAddress, NFTBaseABIInterface);

export const getTokenURI = (contract, tokenId) => ({
  abi: NFTBaseABIInterface,
  address: contract,
  method: "_tokenURI",
  args: [tokenId],
});

export const mintTokenFunc = "mint";
