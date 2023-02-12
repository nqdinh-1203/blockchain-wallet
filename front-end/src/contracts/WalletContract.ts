import { ethers } from "ethers";
import { BaseInterface } from "./interfaces";
import { getWalletAbi } from "./utils/getAbi";
import { getWalletAddress } from "./utils/getAddress";

export default class WalletContract extends BaseInterface {
    constructor(provider: ethers.providers.Web3Provider) {
        super(provider, getWalletAddress(), getWalletAbi());
    }

    async setToken(address: string) {
        const tx = await this._contract.setToken(address, this._option);
        return this._handleTransactionRespone(tx);
    }

    async setOwner(address: string) {
        const tx = await this._contract.setWallet(address, this._option);
        return this._handleTransactionRespone(tx);
    }

    async transfer(addressTo: string, amount: number) {
        const tx = await this._contract.transfer(addressTo, this._numberToEth(amount), this._option);
        return this._handleTransactionRespone(tx);
    }

    async getTokenAddress(): Promise<string> {
        const tokenAddress = await this._contract.token();
        return tokenAddress;
    }

    async getOwnerAddress(): Promise<string> {
        const ownerAddress = await this._contract.wallet();
        return ownerAddress;
    }
}