import { createFileRoute } from "@tanstack/react-router";
import { useAccount, useDisconnect, useReadContract, useWriteContract } from "wagmi";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CONTRACT_ADDRESSES, CredLayerTrustABI } from "@/contracts";
import { ZG_CHAIN_ID, ZG_RPC_URL, ZG_STORAGE_INDEXER } from "@/lib/zg-chain";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings · CredLayer" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();

  // Admin Section
  const { data: owner } = useReadContract({
    abi: CredLayerTrustABI,
    address: CONTRACT_ADDRESSES.reputation || undefined,
    functionName: "owner",
  });
  const isAdmin = address && owner && address.toLowerCase() === (owner as string).toLowerCase();

  const { writeContractAsync: writeContract } = useWriteContract();
  const [newOwner, setNewOwner] = useState("");
  const [entityType, setEntityType] = useState("");

  async function handleTransferOwnership() {
    if (!newOwner || !newOwner.startsWith("0x") || newOwner.length !== 42) {
      toast.error("Invalid address format");
      return;
    }
    try {
      const tx = await writeContract({
        abi: CredLayerTrustABI,
        address: CONTRACT_ADDRESSES.reputation,
        functionName: "transferOwnership",
        args: [newOwner as `0x${string}`],
      });
      toast.success("Ownership transfer initiated", { description: tx });
      setNewOwner("");
    } catch (e: any) {
      toast.error("Transfer failed", { description: e?.shortMessage || e?.message });
    }
  }

  // Identity Registration
  const { data: identityData } = useReadContract({
    abi: CredLayerTrustABI,
    address: CONTRACT_ADDRESSES.reputation || undefined,
    functionName: "getIdentity",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!CONTRACT_ADDRESSES.reputation },
  });

  const isInitialized = identityData ? (identityData as any).isInitialized : false;
  const currentEntityType = identityData ? (identityData as any).entityType : "";
  const registeredAt = identityData ? Number((identityData as any).registeredAt) : 0;

  async function handleRegisterIdentity() {
    if (!entityType) {
      toast.error("Entity type is required");
      return;
    }
    try {
      const tx = await writeContract({
        abi: CredLayerTrustABI,
        address: CONTRACT_ADDRESSES.reputation,
        functionName: "registerIdentity",
        args: [address as `0x${string}`, entityType],
      });
      toast.success("Identity registration initiated", { description: tx });
      setEntityType("");
    } catch (e: any) {
      toast.error("Registration failed", { description: e?.shortMessage || e?.message });
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Wallet, network, and contract configuration.
        </p>
      </header>

      {isAdmin && (
        <section className="glass-panel space-y-4 p-6 border border-primary/50">
          <h2 className="font-semibold text-primary">Admin Controls</h2>
          <Row label="Transfer Ownership">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="New Owner Address (0x...)" 
                value={newOwner} 
                onChange={(e) => setNewOwner(e.target.value)} 
                className="max-w-md text-xs font-mono"
              />
              <Button size="sm" onClick={handleTransferOwnership}>Transfer</Button>
            </div>
          </Row>
        </section>
      )}

      <section className="glass-strong space-y-4 p-6">
        <h2 className="font-semibold">Identity Profile</h2>
        {isInitialized ? (
          <>
            <Row label="Entity Type">{currentEntityType}</Row>
            <Row label="Registered At">{new Date(registeredAt * 1000).toLocaleString()}</Row>
          </>
        ) : (
          <Row label="Register Identity">
            <div className="flex flex-col gap-2 max-w-sm">
              <Input 
                placeholder="Entity Type (e.g., Human, AI Agent)" 
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
              />
              <Button size="sm" onClick={handleRegisterIdentity}>Register on 0G Chain</Button>
            </div>
          </Row>
        )}
      </section>

      <section className="glass-strong space-y-4 p-6">
        <h2 className="font-semibold">Wallet</h2>
        <Row label="Address"><code className="font-mono text-xs">{address}</code></Row>
        <Row label="Connector">{connector?.name ?? "—"}</Row>
        <Button variant="outline" onClick={() => disconnect()}>Disconnect</Button>
      </section>

      <section className="glass-panel space-y-4 p-6">
        <h2 className="font-semibold">0G Network</h2>
        <Row label="Chain ID">{ZG_CHAIN_ID}</Row>
        <Row label="RPC"><code className="break-all font-mono text-xs">{ZG_RPC_URL}</code></Row>
        <Row label="Storage Indexer">
          <code className="break-all font-mono text-xs">{ZG_STORAGE_INDEXER}</code>
        </Row>
      </section>

      <section className="glass-panel space-y-4 p-6">
        <h2 className="font-semibold">Contracts</h2>
        <Row label="IdentityRegistry">
          <code className="font-mono text-xs">{CONTRACT_ADDRESSES.identity || "(not deployed)"}</code>
        </Row>
        <Row label="ReputationRegistry">
          <code className="font-mono text-xs">{CONTRACT_ADDRESSES.reputation || "(not deployed)"}</code>
        </Row>
        <Row label="CredentialRegistry">
          <code className="font-mono text-xs">{CONTRACT_ADDRESSES.credential || "(not deployed)"}</code>
        </Row>
      </section>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr] items-start gap-3 text-sm">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div>{children}</div>
    </div>
  );
}
