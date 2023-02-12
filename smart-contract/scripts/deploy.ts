import { ethers, hardhatArguments } from "hardhat";
import * as Config from "./config";

async function main() {
  await Config.initConfig();
  const network = hardhatArguments.network ? hardhatArguments.network : "dev";
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from address: ", deployer.address);

  // const Token = await ethers.getContractFactory("Token");
  // const token = await Token.deploy();
  // console.log("Token address: ", token.address);
  // Config.setConfig(network + '.Token', token.address);

  // const Vault = await ethers.getContractFactory("Vault");
  // const vault = await Vault.deploy();
  // console.log("Vault address: ", vault.address);
  // Config.setConfig(network + ".Vault", vault.address);

  // const USDT = await ethers.getContractFactory("USDT");
  // const usdt = await USDT.deploy();
  // console.log("USDT address: ", await usdt.address);
  // Config.setConfig(network + '.USDT', await usdt.address);

  const Wallet = await ethers.getContractFactory("Wallet");
  const tokenAddress = "0x9B29b8a58E166Cc13d3ea8A7617f1D70528D6460";
  const ownerAddress = "0x24A8427EFb2D4bB03A44286feDb8D8fE662916d8";
  const wallet = await Wallet.deploy(ownerAddress, tokenAddress);
  console.log("Wallet address: ", await wallet.address);
  Config.setConfig(network + '.Wallet', await wallet.address);

  await Config.updateConfig();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });