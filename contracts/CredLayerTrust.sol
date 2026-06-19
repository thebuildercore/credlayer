// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CredLayer Core Infrastructure Stack
 * @notice Combines Identity, Reputation, and Credential Registries for 0G Galileo.
 */
contract CredLayerTrust {
    address public owner;

    struct Identity {
        string entityType;
        uint256 registeredAt;
        bool isInitialized;
    }

    struct TrustProfile {
        uint16 trustScore;
        uint8 confidence;
        string riskLevel;
        string storageRoot;
        uint256 lastUpdated;
    }

    struct Credential {
        bytes32 documentHash;
        string storageURI;
        uint256 timestamp;
        bool isValid;
    }

    mapping(address => Identity) public identities;
    mapping(address => TrustProfile) public reputationRegistry;
    mapping(address => bool) public hasReputation;
    mapping(bytes32 => Credential) public credentialRegistry;

    event IdentityRegistered(address indexed entity, string entityType);
    event ReputationAnchored(address indexed subject, uint16 trustScore, string storageRoot);
    event CredentialAnchored(bytes32 indexed documentHash, address indexed issuer, string storageURI);
    event CredentialRevoked(bytes32 indexed documentHash);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "CredLayer: Unauthorized caller");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    
    // SECURITY PATCH: OWNERSHIP TRANSFER
    // ==========================================
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "CredLayer: Invalid address");
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
    }

  
    // SECURITY PATCH: RESTRICTED IDENTITY
    // ==========================================
    function registerIdentity(address _entity, string calldata _entityType) external {
        require(!identities[_entity].isInitialized, "CredLayer: Identity already initialized");
        require(msg.sender == _entity || msg.sender == owner, "CredLayer: Not authorized to register this identity");
        
        identities[_entity] = Identity({
            entityType: _entityType,
            registeredAt: block.timestamp,
            isInitialized: true
        });

        emit IdentityRegistered(_entity, _entityType);
    }

    // REPUTATION & CREDENTIAL ANCHORING
    // ==========================================
    function anchorReputation(
        address _subject,
        uint16 _trustScore,
        uint8 _confidence,
        string calldata _riskLevel,
        string calldata _storageRoot
    ) external onlyOwner {
        require(_trustScore <= 1000, "CredLayer: Score must be 0-1000 range");
        require(_confidence <= 100, "CredLayer: Confidence cannot exceed 100%");
        
        if (!identities[_subject].isInitialized) {
            identities[_subject] = Identity({
                entityType: "AI Agent",
                registeredAt: block.timestamp,
                isInitialized: true
            });
            // FIX 1: Emit the event so the frontend dashboard indexes the new agent!
            emit IdentityRegistered(_subject, "AI Agent");
        }

        reputationRegistry[_subject] = TrustProfile({
            trustScore: _trustScore,
            confidence: _confidence,
            riskLevel: _riskLevel,
            storageRoot: _storageRoot,
            lastUpdated: block.timestamp
        });
        
        hasReputation[_subject] = true;

        emit ReputationAnchored(_subject, _trustScore, _storageRoot);
    }

    function anchorCredential(bytes32 _documentHash, string calldata _storageURI) external onlyOwner {
        // FIX 2: Check timestamp to ensure a revoked credential can never be overwritten or reactivated
        require(credentialRegistry[_documentHash].timestamp == 0, "CredLayer: Credential hash already processed");

        credentialRegistry[_documentHash] = Credential({
            documentHash: _documentHash,
            storageURI: _storageURI,
            timestamp: block.timestamp,
            isValid: true
        });

        emit CredentialAnchored(_documentHash, msg.sender, _storageURI);
    }

    function revokeCredential(bytes32 _documentHash) external onlyOwner {
        require(credentialRegistry[_documentHash].isValid, "CredLayer: Credential not active");
        credentialRegistry[_documentHash].isValid = false;
        
        emit CredentialRevoked(_documentHash);
    }

   
    // FRONTEND QoL GETTERS
    // ==========================================
    function getFullTrustProfile(address _subject) external view returns (
        string memory entityType,
        uint16 trustScore,
        uint8 confidence,
        string memory riskLevel,
        string memory storageRoot,
        uint256 lastUpdated
    ) {
        require(hasReputation[_subject], "CredLayer: Subject profile does not exist yet");
        Identity memory id = identities[_subject];
        TrustProfile memory rep = reputationRegistry[_subject];
        
        return (id.entityType, rep.trustScore, rep.confidence, rep.riskLevel, rep.storageRoot, rep.lastUpdated);
    }

    function getIdentity(address _subject) external view returns (Identity memory) {
        require(identities[_subject].isInitialized, "CredLayer: Identity not found");
        return identities[_subject];
    }

    function verifyCredential(bytes32 _documentHash) external view returns (bool) {
        return credentialRegistry[_documentHash].isValid;
    }
}