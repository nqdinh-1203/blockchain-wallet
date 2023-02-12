import { ConnectWallet, WalletInfo } from '@/components'
import TokenContract from '@/contracts/TokenContract'
import WalletContract from '@/contracts/WalletContract'
import { IReception, IWalletInfo } from '@/_types_'
import { Button, Flex, Heading, Input, List, ListItem, Spacer, Text } from '@chakra-ui/react'
import { ethers } from 'ethers'
import React from 'react'
import HistoryItem from './components/HistoryItem'

declare var window: any;

export default function WalletView() {
    const [receptAddress, setReceptAddress] = React.useState<string>('');
    const [receptAmount, setReceptAmount] = React.useState<number>(0);
    const [history, setHistory] = React.useState<IReception[]>([]);
    const [tokenAddress, setTokenAddress] = React.useState<string>('');
    const [symbolToken, setSymbolToken] = React.useState<string>('');

    // console.log(tokenAddress);

    const [web3Provider, setWeb3Provider] = React.useState<ethers.providers.Web3Provider>();
    const [txHash, setTxHash] = React.useState<string>("");
    const [wallet, setWallet] = React.useState<IWalletInfo>();

    const handleConnectWeb3 = async () => {
        if (window.ethereum) {
            console.log("...connecting web3");

            const provider = new ethers.providers.Web3Provider(window.ethereum, undefined);
            await provider.send("eth_requestAccounts", []);

            const signer = provider.getSigner();

            const walletContract = new WalletContract(provider);
            const addressToken = await walletContract._contract.token();
            const address = await signer.getAddress();
            const tx = await walletContract._contract.setWallet(address);
            setTxHash(tx);
            console.log(addressToken);
            console.log(await walletContract._contract.wallet());

            const tokenContract = new TokenContract(provider, addressToken);
            const symbol = await tokenContract._contract.symbol();

            const bigBalance = await tokenContract._contract.balanceOf(address);
            const ethBalance = Number.parseFloat(ethers.utils.formatEther(bigBalance));

            setSymbolToken(symbol);
            setWallet({ address, amount: ethBalance });
            setWeb3Provider(provider);
            setTokenAddress(addressToken);

            console.log("...connected web3");
        }
    }

    const handleTransfer = async (address: string, amount: number) => {
        console.log({ address, amount });
        if (!web3Provider || !wallet) return;

        const tokenContract = new TokenContract(web3Provider, tokenAddress);
        const symbol = await tokenContract._contract.symbol();

        const walletContract = new WalletContract(web3Provider);
        const signer = await web3Provider.getSigner();
        const txApprove = await (await tokenContract._contract.connect(signer)).approve(walletContract._contractAddress, amount);
        setTxHash(txApprove);

        const tx = await walletContract._contract.transfer(address, amount);

        const bigBalance = await tokenContract._contract.balanceOf(address);
        const ethBalance = Number.parseFloat(ethers.utils.formatEther(bigBalance));

        setTxHash(tx);
        setHistory(prev => [...prev, { address, amount }]);
        setWallet({ ...wallet, amount: ethBalance });
        setReceptAddress('');
        setReceptAmount(0);
    }

    // Khi import token mới thì phải set Token mới cho contract Wallet
    const handleImportTokenAddress = async (addressToken: string) => {
        console.log("...importing token ", addressToken);
        if (!web3Provider || !wallet) return;

        setHistory([]);
        const walletContract = new WalletContract(web3Provider);
        const tx = await walletContract._contract.setToken(addressToken);

        console.log(await walletContract._contract.token());

        const tokenContract = new TokenContract(web3Provider, addressToken);
        const symbol = await tokenContract._contract.symbol();

        const signer = await web3Provider.getSigner();

        const address = await signer.getAddress();
        const bigBalance = await tokenContract._contract.balanceOf(address);
        const ethBalance = Number.parseFloat(ethers.utils.formatEther(bigBalance));

        setSymbolToken(symbol);
        setWallet({ address, amount: ethBalance });
        setTxHash(tx);
        setTokenAddress(addressToken);

        console.log("...import done");
    }

    return (
        <Flex
            w={{ base: "full", lg: "70%" }}
            flexDirection="column"
            margin="50px auto"
        >
            <Flex paddingBottom="30px">
                <Heading size="lg" fontWeight="bold">
                    Blockchain Wallet
                </Heading>

                <Spacer />

                {/* <ConnectWallet></ConnectWallet> */}
                {!wallet && <ConnectWallet onClick={handleConnectWeb3} />}
                {wallet && <WalletInfo
                    address={wallet?.address}
                    amount={wallet?.amount || 0}
                    symbol={symbolToken}
                />}
            </Flex>

            <Flex>
                <Text
                    paddingRight="20px"
                    fontWeight="bold"
                    fontSize="20px"
                >
                    Import another token
                </Text>
                <Input
                    w="60%"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    placeholder="Input token address here"
                >
                </Input>
                <Button
                    marginLeft="30px"
                    fontSize="20px"
                    onClick={() => handleImportTokenAddress(tokenAddress)}
                >
                    Import
                </Button>
            </Flex>

            <Flex
                my="50px"
            >
                <Flex w="40%" flexDirection="column">
                    <Text
                        paddingRight="20px"
                        fontWeight="bold"
                        fontSize="20px"
                    >Recipent</Text>
                    <Input
                        value={receptAddress}
                        onChange={(e) => setReceptAddress(e.target.value)}
                    />

                    <Text
                        paddingTop="20px"
                        paddingRight="20px"
                        fontWeight="bold"
                        fontSize="20px"
                    >Amount</Text>
                    <Input
                        value={receptAmount}
                        onChange={(e) => setReceptAmount(Number.parseFloat(e.target.value))}
                    />

                    <Button variant="primary" w="50%" my="30px"
                        onClick={() => handleTransfer(receptAddress, receptAmount)}
                    >Transfer
                    </Button>
                </Flex>

                <Spacer />
                <Flex
                    w="50%"
                    flexDirection="column"
                >
                    <Text
                        paddingRight="20px"
                        fontWeight="bold"
                        fontSize="35px"
                        paddingBottom="40px"
                    >History</Text>
                    <List>
                        {
                            history.map((item, index) => (
                                <HistoryItem
                                    key={index}
                                    address={item.address}
                                    amount={item.amount}
                                ></HistoryItem>
                            ))
                        }
                    </List>
                </Flex>
            </Flex>
        </Flex>
    )
}