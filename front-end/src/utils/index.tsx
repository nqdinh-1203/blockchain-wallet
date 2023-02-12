export const numberFormat = (number: number | string) => new Intl.NumberFormat().format(Number(number));

export const showShortAddress = (address?: string): string => {
    return `${address?.substring(0, 6)}...${address?.substring(
        address.length - 6,
        address.length,
    )}`
}

export const showTransactionHash = (transHash: string): string => {
    return `${transHash?.substring(0, 10)}${"".padStart(5, "*")}${transHash?.substring(transHash.length - 10, transHash.length)}`;
}