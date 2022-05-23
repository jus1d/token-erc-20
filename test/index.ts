import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

describe("Token contract", function () {

    let TokenERC20 : ContractFactory;
    let token : Contract;
    let owner : SignerWithAddress;
    let address1 : SignerWithAddress;
    let address2 : SignerWithAddress;

    beforeEach(async function () {
        [owner, address1, address2] = await ethers.getSigners();

        TokenERC20 = await ethers.getContractFactory("Poq");
        token = await TokenERC20.deploy('POQ Coin', 'POQ', 18, 10000000);

        await token.mint(address1.address, 100)
        await token.mint(address2.address, 100)
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await token.owner()).to.equal(owner.address);
        });
    });

    describe("Mint", function () {

        it("Should be called from owner", async function () {
            await expect(token.connect(owner).mint(address2.address, 100)).to.not.be.revertedWith("Mint must call contract's owner");
        });

        it("Should throw an error, when function called not from owner", async function () {
            await expect(token.connect(address1).mint(address2.address, 100)).to.be.revertedWith("Mint must call contract's owner");
        });

        it("Should correctly mint tokens", async function () {
            await token.connect(owner).mint(address2.address, 100);
            let balance2 = await token.balanceOf(address2.address);
            expect(balance2).to.equal(200); 
        });
    });

    describe("Allowance", function () {
        it("Should correctly allow first account to transfer tokens to second account", async function () {
            await token.connect(address1).approve(address2.address, 100);
            let allowance = await token.allowance(address1.address, address2.address);
            expect(allowance).to.equal(100);
        });
    });

    describe("Transaction", function () {
        it("Should correctly transfer tokens", async function () {
            await token.connect(address1).transfer(address2.address, 50);

            let balance1 = await token.balanceOf(address1.address);
            let balance2 = await token.balanceOf(address2.address);

            expect(balance1).to.equal(50);
            expect(balance2).to.equal(150);
        });

        it("Should correctly transfer tokens from first address to second address", async function () {
            await token.connect(address1).approve(address2.address, 100)
            await token.transferFrom(address1.address, address2.address, 100);

            let balance1 = await token.balanceOf(address1.address);
            let balance2 = await token.balanceOf(address2.address);

            expect(balance1).to.equal(0);
            expect(balance2).to.equal(200); 
        });

        describe("Transaction Errors", function () {
            it("Should return transaction error in transfer: Insufficient Balance", async function () {
                await expect(token.connect(address1).transfer(address2.address, 1000)).to.be.revertedWith("Insufficient Balance");
            });

            it("Should return transaction error in transfer from: Insufficient Balance", async function () {
                await expect(token.transferFrom(address1.address, address2.address, 1000)).to.be.revertedWith("Insufficient Balance");
            });

            it("Should return transaction error: No Allowance", async function () {
                await expect(token.transferFrom(address1.address, address2.address, 100)).to.be.revertedWith("No Allowance");
            });
        });
    });

    describe("Burn", function () {

        it("Should be called from owner", async function () {
            await expect(token.connect(owner).burn(address2.address, 100)).to.not.be.revertedWith("Burn must call contract's owner");
        });

        it("Should throw an error, when function called not from owner", async function () {
            await expect(token.connect(address1).burn(address2.address, 100)).to.be.revertedWith("Burn must call contract's owner");
        });

        it("Should correctly burn tokens", async function () {
            await expect(token.connect(owner).burn(address2.address, 100)).to.not.be.revertedWith("Burn must call contract's owner");
            let balance2 = await token.balanceOf(address2.address);
            expect(balance2).to.equal(0); 
        });
    });

});