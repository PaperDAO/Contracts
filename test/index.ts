import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractReceipt, Signer } from "ethers";

let WPContract: Contract;

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});


describe("Paper NFT", function () {
  before(async function () {
    WPContract = await ethers.getContractFactory("Whitepaper").then(res => res.deploy());
  });

  it("Should Mint", async function () {
    
  });

  it("Should Write", async function () {
    
  });

  
  it("Should be Secure", async function () {
    
  });

});
