import { Flex, ListItem, Spacer, Text } from '@chakra-ui/react'
import React from 'react'

interface IProps {
    index?: number
    address: string;
    amount: number;
}

import { showShortAddress } from '@/utils';

export default function HistoryItemFlex({ index, address, amount }: IProps) {
    return (
        <ListItem key={index} paddingY="10px">
            <Flex flexDirection="row">
                <Text fontWeight="bold"
                    fontSize="20px"
                > {showShortAddress(address)}</ Text>
                <Spacer />
                <Text fontWeight="bold"
                    fontSize="20px">{amount}</Text>
            </Flex>
        </ListItem >
    )
}
