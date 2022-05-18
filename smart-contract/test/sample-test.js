const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Coke Test Token Contract", function () {
  let CokeTestToken;
  let hardhatCokeTestToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let WHITELISTED;
  let DEFAULT_ADMIN_ROLE;

  before(async function () {
    // Get the ContractFactory and Signers here.
    CokeTestToken = await ethers.getContractFactory("CokeTestToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call CokeTestToken.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    hardhatCokeTestToken = await CokeTestToken.deploy();
    DEFAULT_ADMIN_ROLE = (await hardhatCokeTestToken.DEFAULT_ADMIN_ROLE()).toString();
    WHITELISTED = (await hardhatCokeTestToken.MINTER_ROLE()).toString();
    
  });

  it("Contract Owner has ADMIN Role and is Whitelisted", async function () {
    expect(await hardhatCokeTestToken.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.equal(true);
    expect(await hardhatCokeTestToken.hasRole(WHITELISTED, owner.address)).to.equal(true);
  });

  it("Owner can mint to any Address", async function () {
    expect(await hardhatCokeTestToken.balanceOf(addr1.address)).to.equal(0);
    
    await hardhatCokeTestToken.safeMint(addr1.address, "Ara Ara", {value: ethers.utils.parseEther("0.1")});
    expect(await hardhatCokeTestToken.balanceOf(addr1.address)).to.equal(1);
  });

  it("Owner can WHITELIST", async function () {
    expect(await hardhatCokeTestToken.hasRole(WHITELISTED, addr1.address)).to.equal(false);

    //default connection is of owner
    await hardhatCokeTestToken.grantRole(WHITELISTED, addr1.address);

    expect(await hardhatCokeTestToken.hasRole(WHITELISTED, addr1.address)).to.equal(true);

  });

  it('WHITELISTED address cannot WHITELIST another address', async function () {
    //addr1 is whitelisted
    expect(await hardhatCokeTestToken.hasRole(WHITELISTED, addr1.address)).to.equal(true);

    try {
      await hardhatCokeTestToken.connect(addr1).grantRole(WHITELISTED, addr2.address)
    } catch (error) {
      expect(error.message).to.include(`is missing role ${DEFAULT_ADMIN_ROLE}`)
    }
  });

  it("Only OWNER can remove from whitelist", async function () {
    expect(await hardhatCokeTestToken.hasRole(WHITELISTED, addr1.address)).to.equal(true);
    try {
      await hardhatCokeTestToken.connect(addr1).revokeRole(WHITELISTED, owner.address)
    } catch (error) {
      expect(error.message).to.include(`is missing role ${DEFAULT_ADMIN_ROLE}`);
    }

    await hardhatCokeTestToken.revokeRole(WHITELISTED, addr1.address);

    // WHITELISTED of addr1 should be revoked
    expect(await hardhatCokeTestToken.hasRole(WHITELISTED, addr1.address)).to.equal(false);
  });

  it("Only Whitelisted can mint", async function () {
    // addr1 not whitelisted
    await expect(hardhatCokeTestToken.connect(addr1).safeMint(addr1.address, "Ora Ora", {value: ethers.utils.parseEther("0.1")})).to.be.reverted;

    //reverted back to owner connection here
    await hardhatCokeTestToken.grantRole(WHITELISTED, addr1.address);
    await hardhatCokeTestToken.connect(addr1).safeMint(addr1.address, "Ura Ura", {value: ethers.utils.parseEther("0.1")});

    //addr1 should have 2 tokens.
    expect(await hardhatCokeTestToken.balanceOf(addr1.address)).to.equal(2);
    expect(await hardhatCokeTestToken.ownerOf(0)).to.equal(addr1.address);
    expect(await hardhatCokeTestToken.ownerOf(1)).to.equal(addr1.address);
  });

  it("Only NFT Owner can transfer ownership", async function () {
    //NFT owner for token 1 is addr1
    expect(await hardhatCokeTestToken.ownerOf(1)).to.equal(addr1.address);

    //Admin tries to transfer from addr1 to himself
    try {
      await hardhatCokeTestToken.transferFrom(addr1.address, owner.address, 1)
    } catch (error) {
      expect(error.message).to.include('ERC721: transfer caller is not owner nor approved')
    }

    //Owner addr1 transfers from addr1 to addr2
    await hardhatCokeTestToken.connect(addr1).transferFrom(addr1.address, addr2.address, 1);

    //New owner of token 1 should be addr2
    expect(await hardhatCokeTestToken.ownerOf(1)).to.equal(addr2.address);
    
  });
});
