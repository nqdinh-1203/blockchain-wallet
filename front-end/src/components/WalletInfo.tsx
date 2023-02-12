import { Button, HStack, Image, Text, Spacer } from "@chakra-ui/react"
import React from 'react'
import { numberFormat, showShortAddress } from "@/utils"

interface IProp {
    address?: string,
    amount: number,
    symbol: string
}

//showSortAddress(address)}
// {numberFormat(amount)}
//

export default function WalletInfo({ address, amount, symbol }: IProp) {
    return (
        <Button variant="outline" ml="10px">
            <HStack>
                <Text>{showShortAddress(address)}</Text>
                <Spacer />
                <Text>{numberFormat(amount)} {symbol}</Text>
            </HStack>
        </Button>
    )
}