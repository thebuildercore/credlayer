// @ts-nocheck
import { expect } from "chai";
import hre from "hardhat";

describe("CredLayerTrust Infrastructure - Security & Full Feature Audit", function () {
  let credLayer;
  let owner;
  let user1;
  let hacker;

  beforeEach(async function () {
    // TypeScript is blind to this file now, so it won't complain about hre.ethers
    [owner, user1, hacker] = await hre.ethers.getSigners();
    const CredLayerFactory = await hre.ethers.getContractFactory("CredLayerTrust");
    credLayer = await CredLayerFactory.deploy();
  });

  describe("1. Identity Registry & Access Control", function () {
    it("Should allow a user to register their own identity", async function () {
      await expect(credLayer.connect(user1).registerIdentity(user1.address, "Human User"))
        .to.emit(credLayer, "IdentityRegistered")
        .withArgs(user1.address, "Human User");
    });

    it("Should allow the AI Agent (owner) to register an identity for a user", async function () {
      await expect(credLayer.connect(owner).registerIdentity(user1.address, "dApp Protocol"))
        .to.emit(credLayer, "IdentityRegistered")
        .withArgs(user1.address, "dApp Protocol");
    });

    it("🚨 SECURITY: Should block a hacker from registering an identity for someone else", async function () {
      await expect(
        credLayer.connect(hacker).registerIdentity(user1.address, "AI Agent")
      ).to.be.revertedWith("CredLayer: Not authorized to register this identity");
    });
  });

  describe("2. Reputation Anchoring & Auto-Initialization", function () {
    const mockScore = 847;
    const mockRoot = "0x9f3ab41c";

    it("Should emit both IdentityRegistered and ReputationAnchored for a new user", async function () {
      await expect(
        credLayer.connect(owner).anchorReputation(user1.address, mockScore, 92, "Low Risk", mockRoot)
      )
        .to.emit(credLayer, "IdentityRegistered").withArgs(user1.address, "AI Agent")
        .and.to.emit(credLayer, "ReputationAnchored").withArgs(user1.address, mockScore, mockRoot);
    });

    it("🚨 SECURITY: Should block scores over 1000", async function () {
      await expect(
        credLayer.connect(owner).anchorReputation(user1.address, 1050, 90, "Low Risk", mockRoot)
      ).to.be.revertedWith("CredLayer: Score must be 0-1000 range");
    });
  });

  describe("3. Credential Registry & Immutability", function () {
    const storageUri = "0g-storage://blob";

    it("Should anchor and then revoke a credential", async function () {
      const docHash = hre.ethers.id("test-credential-v1"); 
      
      await credLayer.connect(owner).anchorCredential(docHash, storageUri);
      expect(await credLayer.verifyCredential(docHash)).to.be.true;

      await credLayer.connect(owner).revokeCredential(docHash);
      expect(await credLayer.verifyCredential(docHash)).to.be.false;
    });

    it("🚨 SECURITY: Should permanently block re-anchoring of a revoked credential hash", async function () {
      const docHash = hre.ethers.id("test-credential-v2"); 
      
      await credLayer.connect(owner).anchorCredential(docHash, storageUri);
      await credLayer.connect(owner).revokeCredential(docHash);
      
      await expect(
        credLayer.connect(owner).anchorCredential(docHash, "new-storage-uri")
      ).to.be.revertedWith("CredLayer: Credential hash already processed");
    });
  });

  describe("4. Ownership Transfer", function () {
    it("Should transfer ownership successfully", async function () {
      await expect(credLayer.connect(owner).transferOwnership(user1.address))
        .to.emit(credLayer, "OwnershipTransferred")
        .withArgs(owner.address, user1.address);
        
      expect(await credLayer.owner()).to.equal(user1.address);
    });
  });

  describe("5. Frontend QoL Getters", function () {
    const mockScore = 847;
    const mockConfidence = 92;
    const mockRisk = "Low Risk";
    const mockRoot = "0x9f3ab41c";

    it("Should retrieve the full trust profile for the frontend UI", async function () {
      await credLayer.connect(owner).anchorReputation(user1.address, mockScore, mockConfidence, mockRisk, mockRoot);
      const profile = await credLayer.getFullTrustProfile(user1.address);
      
      expect(profile.entityType).to.equal("AI Agent");
      expect(profile.trustScore).to.equal(mockScore);
      expect(profile.confidence).to.equal(mockConfidence);
      expect(profile.riskLevel).to.equal(mockRisk);
      expect(profile.storageRoot).to.equal(mockRoot);
      expect(profile.lastUpdated).to.be.greaterThan(0);
    });

    it("Should revert if trying to get a trust profile that does not exist", async function () {
      await expect(credLayer.getFullTrustProfile(hacker.address))
        .to.be.revertedWith("CredLayer: Subject profile does not exist yet");
    });

    it("Should retrieve the identity structure", async function () {
      await credLayer.connect(user1).registerIdentity(user1.address, "Human User");
      const identity = await credLayer.getIdentity(user1.address);
      
      expect(identity.entityType).to.equal("Human User");
      expect(identity.isInitialized).to.be.true;
    });

    it("Should revert if trying to get an identity that does not exist", async function () {
      await expect(credLayer.getIdentity(hacker.address))
        .to.be.revertedWith("CredLayer: Identity not found");
    });
  });
});