import { describe, expect, it } from "vitest";
import {
  applySignedContract,
  isOperatorStoreUpdate,
  storeSnapshotsEqual,
  type ContractStore,
} from "../shared/storeSync";

const initialStore: ContractStore = {
  contracts: [
    {
      id: "CTR-001",
      worker: "Ana Lima",
      company: "Mercado Central",
      workerSigned: false,
      employerSigned: true,
    },
  ],
  notifications: 0,
  audits: [],
};

const signedPayload = {
  id: "CTR-001",
  worker: "Ana Lima",
  workerSigned: true as const,
  workerSignature: "data:image/png;base64,aGVsbG8=",
  signedAt: "2026-10-28T05:00:00.000Z",
};

describe("WebSocket store sync", () => {
  it("does not classify initial/reconnect snapshots as operator edits", () => {
    expect(
      isOperatorStoreUpdate({
        type: "store-sync",
        source: "snapshot",
        payload: initialStore,
      })
    ).toBe(false);
    expect(
      isOperatorStoreUpdate({ type: "store-sync", payload: initialStore })
    ).toBe(true);
    expect(isOperatorStoreUpdate({ type: "accounts-sync" })).toBe(false);
  });

  it("compares equivalent snapshots regardless of object key order", () => {
    expect(
      storeSnapshotsEqual(
        { contracts: [{ id: "CTR-001", workerSigned: false }] },
        { contracts: [{ workerSigned: false, id: "CTR-001" }] }
      )
    ).toBe(true);
    expect(
      storeSnapshotsEqual(initialStore, {
        ...initialStore,
        notifications: 1,
      })
    ).toBe(false);
  });
});

describe("signed contract receipt", () => {
  it("keeps a return link pending until its contract has synchronized", () => {
    const result = applySignedContract(
      { contracts: [], notifications: 0, audits: [] },
      signedPayload,
      "audit-1"
    );

    expect(result.status).toBe("missing");
    expect(result.store.contracts).toHaveLength(0);
  });

  it("records the signature, timestamp, notification, and audit once the contract exists", () => {
    const result = applySignedContract(
      initialStore,
      signedPayload,
      "audit-1",
      "agora"
    );

    expect(result.status).toBe("updated");
    expect(result.store.contracts[0]).toMatchObject({
      workerSigned: true,
      workerSignature: signedPayload.workerSignature,
      signedAt: signedPayload.signedAt,
    });
    expect(result.store.notifications).toBe(1);
    expect(result.store.audits?.[0]).toMatchObject({
      action: "Contrato assinado recebido",
      detail: "CTR-001 • Ana Lima",
    });
  });

  it("does not duplicate an already received signature or audit", () => {
    const first = applySignedContract(initialStore, signedPayload, "audit-1");
    const second = applySignedContract(first.store, signedPayload, "audit-2");

    expect(first.status).toBe("updated");
    expect(second.status).toBe("duplicate");
    expect(second.store).toBe(first.store);
    expect(second.store.notifications).toBe(1);
    expect(second.store.audits).toHaveLength(1);
  });

  it("rejects a signature for a different worker or an invalid image payload", () => {
    const wrongWorker = applySignedContract(
      initialStore,
      { ...signedPayload, worker: "Outra Pessoa" },
      "audit-1"
    );
    const invalidImage = applySignedContract(
      initialStore,
      { ...signedPayload, workerSignature: "not-an-image" },
      "audit-2"
    );

    expect(wrongWorker.status).toBe("invalid");
    expect(invalidImage.status).toBe("invalid");
    expect(initialStore.notifications).toBe(0);
  });
});
