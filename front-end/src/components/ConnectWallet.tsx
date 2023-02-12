import React from 'react'
import { Button, ButtonProps } from "@chakra-ui/react"

interface IProp extends ButtonProps {

}

export default function ConnectWallet({ ...props }: IProp) {
    return (
        <Button variant="primary" {...props} > Connect Wallet </Button>
    )
}
