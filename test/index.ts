import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractReceipt, Signer } from "ethers";

let WPContract: Contract;

//Addresses
let owner: Signer;
let tester: Signer;
let addrs: Signer[];

const content = ["Hello, world!", "What's up?","","Yo!"];

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

  it("Should be Secure", async function () {

    console.log(`Owner: ${this.ownerAddr} | Tester: ${this.testerAddr}`);

    await expect(
      WPContract.connect(addrs[3]).typewrite(1, content)
    ).to.be.revertedWith("ERROR");

    WPContract.connect(addrs[4]).typewrite(1, content)

  });

  it("Should Write", async function () {
    WPContract.connect(tester).typewrite(1, content);
    WPContract.connect(owner).typewrite(2, content);

    await expect(
      WPContract.connect(tester).typewrite(1, content)
    ).to.be.revertedWith("Sorry, Assets are non-transferable");

    
 
    // WPContract.connect(owner).typewrite(2, content);
  });

  
  it("Should Not Again", async function () {

  });
  
});
