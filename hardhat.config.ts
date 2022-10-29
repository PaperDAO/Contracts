import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("deploy", "deploying", async (taskArgs, hre) => {
  const Whitepaper = await hre.ethers.getContractFactory("Whitepaper");
  const whitepaper = await Whitepaper.deploy();
  console.log("Deploying ", whitepaper.address);
  await whitepaper.deployed();
  console.log(whitepaper.address);
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    //-- Test
    rinkeby: {
      // url: process.env.RINKEBY_URL || "",
      url: "https://ethereum-rinkeby--rpc.datahub.figment.io/apikey/d58273bf8caa0c41cd34d4285657480a",
      accounts: [`${process.env.PRIVATE_KEY}`],
      //gas: 2100000,
      //gasPrice: 8000000000,
      gasPrice: 100000000,
    },
    goerli: {
      url: process.env.GOERLI_RPC || "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    mumbai: {
      // url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_KEY}`,
      // url: process.env.ALCHEMY_MUMBAI_URL,
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [`${process.env.PRIVATE_KEY}`],
      chainId: 80001,
      // gas: 2100000,
      // gas: 6000000,
      // gasPrice: 1000000000,
      // gasPrice: 8000000000, // default is 'auto' which breaks chains without the london hardfork
      gasPrice: 10000000000,
    },
    //-- Main
    polygon: {
      // url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      // url: process.env.ALCHEMY_POLYGON_URL,
      url: "https://rpc-mainnet.maticvigil.com/",
      // url: "https://matic-mainnet--jsonrpc.datahub.figment.io/apikey/d58273bf8caa0c41cd34d4285657480a",
      accounts: [`${process.env.PRIVATE_KEY}`],
      chainId: 137,
      // gasPrice: 1000000000
    },

    // GNOSIS Chain
    xdai: {
      url: "https://rpc.gnosischain.com",
      accounts: [`${process.env.PRIVATE_KEY}`],
      chainId: 100,
      // gas: 500000,
      // gasPrice: 1000000000
    },
  },

  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || undefined,
  },
};

export default config;
