import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "@ethersproject/contracts";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import * as chai from "chai";
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Wallet Contract", () => {
    let wallet: Contract;
    let token: Contract;
    let addr1, addr2: SignerWithAddress;

    async function deployTokenFixture() {
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy();
        await token.deployed();

        [addr1, addr2] = await ethers.getSigners();

        const Wallet = await ethers.getContractFactory("Wallet");
        wallet = await Wallet.deploy(addr1.address, token.address);
        await wallet.deployed();

        // Fixtures can return anything you consider useful for your tests
        return { token, wallet, addr1, addr2 };
    }

    it("should deploy the wallet contract and the token contract", async () => {
        const { token, wallet } = await loadFixture(deployTokenFixture);

        expect(await wallet.token()).to.eq(token.address);
    });

    it("Should set the right owner", async function () {
        // We use loadFixture to setup our environment, and then assert that
        // things went well
        const { token, addr1 } = await loadFixture(deployTokenFixture);

        // `expect` receives a value and wraps it in an assertion object. These
        // objects have a lot of utility methods to assert values.

        // This test expects the owner variable stored in the contract to be
        // equal to our Signer's owner.
        expect(await token.owner()).to.equal(addr1.address);
    });

    it("should change the token", async () => {
        const { wallet } = await loadFixture(deployTokenFixture);

        const anotherToken = await (await ethers.getContractFactory("USDT")).deploy();
        await anotherToken.deployed();

        await wallet.setToken(anotherToken.address);
        expect(await wallet.token()).to.equal(anotherToken.address);
    });

    it("should change the owner", async () => {
        const { wallet, addr2 } = await loadFixture(deployTokenFixture);

        await wallet.setWallet(addr2.address);

        expect(await wallet.wallet()).to.equal(addr2.address);
    });

    it("should transfer tokens from addr1 to addr2", async () => {
        const { token, wallet, addr1, addr2 } = await loadFixture(deployTokenFixture);

        const amount = 10;

        await token.connect(addr1).approve(wallet.address, amount);

        await wallet.transfer(addr2.address, amount);

        expect(await token.balanceOf(addr2.address)).to.equal(amount);
    });

    it("should not transfer tokens if the amount is zero", async () => {
        const { token, wallet, addr2 } = await loadFixture(deployTokenFixture);

        const amount = 0;

        await token.approve(wallet.address, amount);
        await expect(wallet.transfer(addr2.address, amount)).revertedWith("Amount is zero");
    });

    // it("should not transfer tokens if the sender has insufficient funds", async () => {
    //     const { token, wallet, addr1, addr2 } = await loadFixture(deployTokenFixture);

    //     const amountMint = ethers.utils.parseEther("10");
    //     await token.mint(addr2.address, amountMint);

    //     await wallet.setWallet(addr2.address);

    //     const amount = ethers.utils.parseEther("20");
    //     await token.connect(addr2).approve(wallet.address, amountMint);
    //     await expect(wallet.transfer(addr1, amountMint)).revertedWith("Insufficient token in sender balance");
    // });

    // it("should withdraw ether from the contract", async () => {
    //     const { token, wallet, addr1 } = await loadFixture(deployTokenFixture);

    //     // const balanceBefore = await token.balanceOf(wallet.address);

    //     const amount = ethers.utils.parseEther("10");

    //     await token.mint(wallet.address, amount);

    //     await token.approve(wallet.address, amount);
    //     await expect(wallet.withdraw()).to.changeTokenBalances(token, [wallet.address, addr1], [-amount, amount]);

    //     // expect(await ethers.provider.getBalance(wallet.address)).to.eq(balanceBefore);
    // });
})