import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractReceipt, Signer } from "ethers";

let WPContract: Contract;

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
