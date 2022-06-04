import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractReceipt, Signer } from "ethers";

let WPContract: Contract;

//Addresses
let owner: Signer;
let tester: Signer;
let addrs: Signer[];

/*
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
*/

describe("Paper NFT", function () {
  before(async function () {
    
    //*** Signers ***/
    //Populate Accounts
    [owner, tester, ...addrs] = await ethers.getSigners();
    //Addresses
    this.ownerAddr = await owner.getAddress();
    this.testerAddr = await tester.getAddress();

    WPContract = await ethers.getContractFactory("Whitepaper").then(res => res.deploy());
    await WPContract.deployed();
  });

  it("Should Mint", async function () {
    //Mint for Tester
    WPContract.mint(this.testerAddr);
    //Mint By Tester (Open Minting)
    WPContract.connect(tester).mint(this.ownerAddr);
  });

  it("Should Write", async function () {
    WPContract.connect(tester).typewrite(1, "Hello, world!");
  });

  
  it("Should be Secure", async function () {
    
  });

});
