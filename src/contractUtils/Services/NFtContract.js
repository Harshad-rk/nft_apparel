import { Contract, utils } from "ethers";
import NftBaseABI from "../Abi/NFTBase.json";

export const NFTBaseABIInterface = new utils.Interface(NftBaseABI);
const NFTBaseContractAddress = "0x19D9345d8c841Df35dB30883E06c28A21D4978b3";

export const NFTBaseContract = new Contract(NFTBaseContractAddress, NFTBaseABIInterface);

export const mintTokenFunc = "mint";
