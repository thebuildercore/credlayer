/**
 * Unified ABI for the single CredLayerTrust contract.
 * The Solidity sources live in contracts/ and are deployed by the team.
 * Once deployed, set NEXT_PUBLIC_CONTRACT_* env vars to the single deployed address.
 *
 * Any read/write performed by the UI MUST use these ABIs against the
 * configured addresses on 0G Chain.
 */

export const CredLayerTrustABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "documentHash",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "storageURI",
        "type": "string"
      }
    ],
    "name": "CredentialAnchored",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "documentHash",
        "type": "bytes32"
      }
    ],
    "name": "CredentialRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "entity",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "entityType",
        "type": "string"
      }
    ],
    "name": "IdentityRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "subject",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint16",
        "name": "trustScore",
        "type": "uint16"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "storageRoot",
        "type": "string"
      }
    ],
    "name": "ReputationAnchored",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_documentHash",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "_storageURI",
        "type": "string"
      }
    ],
    "name": "anchorCredential",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_subject",
        "type": "address"
      },
      {
        "internalType": "uint16",
        "name": "_trustScore",
        "type": "uint16"
      },
      {
        "internalType": "uint8",
        "name": "_confidence",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "_riskLevel",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_storageRoot",
        "type": "string"
      }
    ],
    "name": "anchorReputation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "credentialRegistry",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "documentHash",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "storageURI",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isValid",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_subject",
        "type": "address"
      }
    ],
    "name": "getFullTrustProfile",
    "outputs": [
      {
        "internalType": "string",
        "name": "entityType",
        "type": "string"
      },
      {
        "internalType": "uint16",
        "name": "trustScore",
        "type": "uint16"
      },
      {
        "internalType": "uint8",
        "name": "confidence",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "riskLevel",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "storageRoot",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "lastUpdated",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_subject",
        "type": "address"
      }
    ],
    "name": "getIdentity",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "entityType",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "registeredAt",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isInitialized",
            "type": "bool"
          }
        ],
        "internalType": "struct CredLayerTrust.Identity",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasReputation",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "identities",
    "outputs": [
      {
        "internalType": "string",
        "name": "entityType",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "registeredAt",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isInitialized",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_entity",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_entityType",
        "type": "string"
      }
    ],
    "name": "registerIdentity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "reputationRegistry",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "trustScore",
        "type": "uint16"
      },
      {
        "internalType": "uint8",
        "name": "confidence",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "riskLevel",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "storageRoot",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "lastUpdated",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_documentHash",
        "type": "bytes32"
      }
    ],
    "name": "revokeCredential",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_documentHash",
        "type": "bytes32"
      }
    ],
    "name": "verifyCredential",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Aliasing for backward compatibility in imports
export const IdentityRegistryABI = CredLayerTrustABI;
export const ReputationRegistryABI = CredLayerTrustABI;
export const CredentialRegistryABI = CredLayerTrustABI;

function getEnv(key: string): string {
  const v =
    (import.meta as any).env?.[`VITE_${key}`] ??
    (import.meta as any).env?.[`NEXT_PUBLIC_${key}`] ??
    "";
  return v as string;
}

export const CONTRACT_ADDRESSES = {
  identity: getEnv("CONTRACT_IDENTITY") as `0x${string}` | "",
  reputation: getEnv("CONTRACT_REPUTATION") as `0x${string}` | "",
  credential: getEnv("CONTRACT_CREDENTIAL") as `0x${string}` | "",
};

export function contractsConfigured(): boolean {
  return Boolean(
    CONTRACT_ADDRESSES.identity &&
      CONTRACT_ADDRESSES.reputation &&
      CONTRACT_ADDRESSES.credential,
  );
}
