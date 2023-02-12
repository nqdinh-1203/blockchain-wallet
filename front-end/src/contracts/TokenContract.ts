import { ethers } from "ethers";
import { Erc20Interface } from "./interfaces";
import { getRPC } from "./utils/common";
import { getTokenAbi } from "./utils/getAbi";
import { getDefaultTokenAddress } from "./utils/getAddress";

export default class TokenContract extends Erc20Interface {
    constructor(provider: ethers.providers.Web3Provider, address?: string) {
        if (address && address !== '')
            super(provider, address, getTokenAbi());
        else
            super(provider, getDefaultTokenAddress(), getTokenAbi())
    }
}