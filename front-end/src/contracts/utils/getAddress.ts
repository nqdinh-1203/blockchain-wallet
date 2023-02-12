import { AddressType, SMART_ADDRESS } from "./common";

const getAddress = (address: AddressType) => {
    // const CHAIN_ID = getChainIdFromEnv() as keyof AddressType;
    return address[97];
}

export const getWalletAddress = () => getAddress(SMART_ADDRESS.WALLET);
export const getDefaultTokenAddress = () => getAddress(SMART_ADDRESS.TOKEN);