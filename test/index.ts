import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractReceipt, Signer } from "ethers";

let WPContract: Contract;

//Addresses
let owner: Signer;
let tester: Signer;
let notOwner: Signer;
let addrs: Signer[];

const pageName = "Whitepaper Name";
const content = ["Hello, world!", "What's up?", "", "Yo!"];
const contentProcessed =
  "data:application/json;base64,eyJuYW1lIjogIk5hbWUyIiwiaW1hZ2VfZGF0YSI6ICI8c3ZnIHdpZHRoPScyNDk0JyBoZWlnaHQ9JzM1MjMnIHZpZXdCb3g9JzAgMCAyNDk0IDM1MjMnIGZpbGw9J25vbmUnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+IDxnIGZpbHRlcj0ndXJsKCNmaWx0ZXIwX2RfMTgxNV8yMDA3NSknPiA8cGF0aCBkPSdNMCAwLjVIMjQ4MFYzNTA4LjVIMTg0LjY0MkwwIDMzMDkuNzlWMC41WicgZmlsbD0nd2hpdGUnLz4gPHBhdGggZD0nTTE4Ny4xNDIgMzMwOS43OVYzMzA3LjI5SDE4NC42NDJIMi41VjNIMjQ3Ny41VjM1MDZIMTg3LjE0MlYzMzA5Ljc5Wk0xODIuMTQyIDMzMTIuMjlWMzUwMi4xNEw1LjczNTU2IDMzMTIuMjlIMTgyLjE0MlonIHN0cm9rZT0nI0EzQTFBMScgc3Ryb2tlLXdpZHRoPSc1Jy8+IDwvZz4gPGRlZnM+IDxmaWx0ZXIgaWQ9J2ZpbHRlcjBfZF8xODE1XzIwMDc1JyB4PScwJyB5PScwLjUnIHdpZHRoPScyNDk0JyBoZWlnaHQ9JzM1MjInIGZpbHRlclVuaXRzPSd1c2VyU3BhY2VPblVzZScgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSdzUkdCJz4gPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0nMCcgcmVzdWx0PSdCYWNrZ3JvdW5kSW1hZ2VGaXgnLz48ZmVDb2xvck1hdHJpeCBpbj0nU291cmNlQWxwaGEnIHR5cGU9J21hdHJpeCcgdmFsdWVzPScwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxMjcgMCcgcmVzdWx0PSdoYXJkQWxwaGEnLz4gPGZlT2Zmc2V0IGR4PScxMCcgZHk9JzEwJy8+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0nMicvPiA8ZmVDb21wb3NpdGUgaW4yPSdoYXJkQWxwaGEnIG9wZXJhdG9yPSdvdXQnLz4gPGZlQ29sb3JNYXRyaXggdHlwZT0nbWF0cml4JyB2YWx1ZXM9JzAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjUgMCcvPiA8ZmVCbGVuZCBtb2RlPSdub3JtYWwnIGluMj0nQmFja2dyb3VuZEltYWdlRml4JyByZXN1bHQ9J2VmZmVjdDFfZHJvcFNoYWRvd18xODE1XzIwMDc1Jy8+IDxmZUJsZW5kIG1vZGU9J25vcm1hbCcgaW49J1NvdXJjZUdyYXBoaWMnIGluMj0nZWZmZWN0MV9kcm9wU2hhZG93XzE4MTVfMjAwNzUnIHJlc3VsdD0nc2hhcGUnLz4gPC9maWx0ZXI+PC9kZWZzPjx0ZXh0IHg9JzIwMCcgeT0nMjUwJyBmb250LWZhbWlseT0nQXJpYWwnIGZvbnQtc2l6ZT0nNTMuMycgZmlsbD0nYmxhY2snPkhlbGxvLCB3b3JsZCE8L3RleHQ+PHRleHQgeD0nMjAwJyB5PSczNTAnIGZvbnQtZmFtaWx5PSdBcmlhbCcgZm9udC1zaXplPSc1My4zJyBmaWxsPSdibGFjayc+V2hhdCdzIHVwPzwvdGV4dD48dGV4dCB4PScyMDAnIHk9JzQ1MCcgZm9udC1mYW1pbHk9J0FyaWFsJyBmb250LXNpemU9JzUzLjMnIGZpbGw9J2JsYWNrJz48L3RleHQ+PHRleHQgeD0nMjAwJyB5PSc1NTAnIGZvbnQtZmFtaWx5PSdBcmlhbCcgZm9udC1zaXplPSc1My4zJyBmaWxsPSdibGFjayc+WW8hPC90ZXh0Pjwvc3ZnPiJ9";
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
    [owner, tester, notOwner, ...addrs] = await ethers.getSigners();
    //Addresses
    this.ownerAddr = await owner.getAddress();
    this.testerAddr = await tester.getAddress();
    //Deploy Contract
    WPContract = await ethers
      .getContractFactory("Whitepaper")
      .then((res) => res.deploy());
    await WPContract.deployed();
  });

  it("Should Mint", async function () {
    //Mint for Tester
    await WPContract.mint(this.testerAddr, { value: 0});
    //Mint By Tester (Open Minting)
    await WPContract.connect(tester).mint(this.ownerAddr, { value: 0});
  });

  it("Should be Secure", async function () {
    await WPContract.mint(this.testerAddr);
    const receipt = WPContract.connect(notOwner).typewrite(1, pageName, content);
    await expect(receipt).to.be.revertedWith("Only the owner can write the paper");
  });

  it("Should Write", async function () {
    await WPContract.connect(tester).typewrite(1, "Name1", content);
    let tx = await WPContract.connect(owner).typewrite(2, "Name2", content);
    tx.wait();
    //Expected Event
    await expect(tx).to.emit(WPContract, "URI").withArgs(contentProcessed, 2);
  });

  it("Should Not Again", async function () {
    const receipt = WPContract.connect(tester).typewrite(1, pageName, content);
    await expect(receipt).to.be.revertedWith("Paper Already Written");
  });

  it("Should Mint Long", async function () {
    let inputArray = [];
    //75 Rows of Data
    for (let i = 1; i <= 74; i++) {
      inputArray.push("This is line " + i);
    }
    // console.log("75 rows doc",  inputArray);
    WPContract.mint(this.testerAddr);
    //Change
    let tx = await WPContract.connect(tester).typewrite(3, pageName, inputArray);
    tx.wait();
    //Get
    let result = await WPContract.getText(3);
    // console.log("74 rows doc",  result);
    //Match
    expect(result.toString()).to.equal(inputArray.toString());
  });

  it("1% Royalties", async function () {
    const price = 1000;
    const royalties = await WPContract.royaltyInfo(1, price);
    const treasury = await WPContract.treasury();
    // console.log("Royalties", {royalties, price});
    //Expect 1%
    expect(royalties.royaltyAmount).to.equal(price / 100);
    expect(royalties.receiver).to.equal(treasury);
  });

  it("Price Increment", async function () {
    const priceStart = 1;
    let price1 = await WPContract.price(1);
    // console.log("Mint Price for 1", price1);
    expect(price1).to.equal(0);

    let price100 = await WPContract.price(100);
    // console.log("Mint Price for 1", price100);
    expect(price100).to.equal(0);

    let price1000 = await WPContract.price(1000);
    // console.log("Mint Price for 1", price1000);
    expect(price1000).to.equal(1);

    let price10000 = await WPContract.price(10000);
    // console.log("Mint Price for 1", price10000);
    expect(price10000).to.equal(10);
  });

  it("Next Token Price", async function () {
    let mintPrice = await WPContract.mintPrice();
    // console.log("Mint Price for next token" + mintPrice, mintPrice);
    expect(mintPrice).to.equal(0);
    //
  });
});
