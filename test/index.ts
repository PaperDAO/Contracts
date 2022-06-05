import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractReceipt, Signer } from "ethers";

let WPContract: Contract;

//Addresses
let owner: Signer;
let tester: Signer;
let notOwner: Signer;
let addrs: Signer[];

const content = ["Hello, world!", "What's up?","","Yo!"];
const contentProcessed = "data:application/json;base64,eyJuYW1lIjogInRlc3RNRSIsImltYWdlX2RhdGEiOiAiPHN2ZyB3aWR0aD0nMjQ5NCcgaGVpZ2h0PSczNTIzJyB2aWV3Qm94PScwIDAgMjQ5NCAzNTIzJyBmaWxsPSdub25lJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPiA8ZyBmaWx0ZXI9J3VybCgjZmlsdGVyMF9kXzE4MTVfMjAwNzUpJz4gPHBhdGggZD0nTTAgMC41SDI0ODBWMzUwOC41SDE4NC42NDJMMCAzMzA5Ljc5VjAuNVonIGZpbGw9J3doaXRlJy8+IDxwYXRoIGQ9J00xODcuMTQyIDMzMDkuNzlWMzMwNy4yOUgxODQuNjQySDIuNVYzSDI0NzcuNVYzNTA2SDE4Ny4xNDJWMzMwOS43OVpNMTgyLjE0MiAzMzEyLjI5VjM1MDIuMTRMNS43MzU1NiAzMzEyLjI5SDE4Mi4xNDJaJyBzdHJva2U9JyNBM0ExQTEnIHN0cm9rZS13aWR0aD0nNScvPiA8L2c+IDxkZWZzPiA8ZmlsdGVyIGlkPSdmaWx0ZXIwX2RfMTgxNV8yMDA3NScgeD0nMCcgeT0nMC41JyB3aWR0aD0nMjQ5NCcgaGVpZ2h0PSczNTIyJyBmaWx0ZXJVbml0cz0ndXNlclNwYWNlT25Vc2UnIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0nc1JHQic+IDxmZUZsb29kIGZsb29kLW9wYWNpdHk9JzAnIHJlc3VsdD0nQmFja2dyb3VuZEltYWdlRml4Jy8+PGZlQ29sb3JNYXRyaXggaW49J1NvdXJjZUFscGhhJyB0eXBlPSdtYXRyaXgnIHZhbHVlcz0nMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAnIHJlc3VsdD0naGFyZEFscGhhJy8+IDxmZU9mZnNldCBkeD0nMTAnIGR5PScxMCcvPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249JzInLz4gPGZlQ29tcG9zaXRlIGluMj0naGFyZEFscGhhJyBvcGVyYXRvcj0nb3V0Jy8+IDxmZUNvbG9yTWF0cml4IHR5cGU9J21hdHJpeCcgdmFsdWVzPScwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjI1IDAnLz4gPGZlQmxlbmQgbW9kZT0nbm9ybWFsJyBpbjI9J0JhY2tncm91bmRJbWFnZUZpeCcgcmVzdWx0PSdlZmZlY3QxX2Ryb3BTaGFkb3dfMTgxNV8yMDA3NScvPiA8ZmVCbGVuZCBtb2RlPSdub3JtYWwnIGluPSdTb3VyY2VHcmFwaGljJyBpbjI9J2VmZmVjdDFfZHJvcFNoYWRvd18xODE1XzIwMDc1JyByZXN1bHQ9J3NoYXBlJy8+IDwvZmlsdGVyPjwvZGVmcz48dGV4dCB4PScyMDAnIHk9JzI1MCcgZm9udC1mYW1pbHk9J0FyaWFsJyBmb250LXNpemU9JzUzLjMnIGZpbGw9J2JsYWNrJz5IZWxsbywgd29ybGQhPC90ZXh0Pjx0ZXh0IHg9JzIwMCcgeT0nMzUwJyBmb250LWZhbWlseT0nQXJpYWwnIGZvbnQtc2l6ZT0nNTMuMycgZmlsbD0nYmxhY2snPldoYXQncyB1cD88L3RleHQ+PHRleHQgeD0nMjAwJyB5PSc0NTAnIGZvbnQtZmFtaWx5PSdBcmlhbCcgZm9udC1zaXplPSc1My4zJyBmaWxsPSdibGFjayc+PC90ZXh0Pjx0ZXh0IHg9JzIwMCcgeT0nNTUwJyBmb250LWZhbWlseT0nQXJpYWwnIGZvbnQtc2l6ZT0nNTMuMycgZmlsbD0nYmxhY2snPllvITwvdGV4dD48L3N2Zz4ifQ==";
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
    [owner, tester,notOwner, ...addrs] = await ethers.getSigners();
    //Addresses
    this.ownerAddr = await owner.getAddress();
    this.testerAddr = await tester.getAddress();

    WPContract = await ethers.getContractFactory("Whitepaper").then(res => res.deploy());
    await WPContract.deployed();



    // WPContract.connect(tester).myAddress();
    // WPContract.connect(owner).myAddress();
    // WPContract.connect(addrs[3]).myAddress();

  });

  it("Should Mint", async function () {
    //Mint for Tester
    WPContract.mint(this.testerAddr);
    //Mint By Tester (Open Minting)
    WPContract.connect(tester).mint(this.ownerAddr);
  });

  it("Should be Secure", async function () {

     const receipt = WPContract.connect(notOwner).typewrite(1, content);
     
     await expect(receipt).to.be.revertedWith("Only the owner can call this function");

  });

  it("Should Write", async function () {
    await WPContract.connect(tester).typewrite(1, content);
    let tx = await WPContract.connect(owner).typewrite(2, content);
    tx.wait();
    //Expected Event
    await expect(tx).to.emit(WPContract, 'URI').withArgs(contentProcessed, 2);

          
 });

  
  it("Should Not Again", async function () {
    const receipt = WPContract.connect(tester).typewrite(1, content);
    await expect(receipt).to.be.revertedWith("Paper Already Written");    
  });
  
  it("Should Mint Long", async function () {

  });
  
});
