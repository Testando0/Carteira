export type SignedContractPayload = {
  id: string;
  worker: string;
  workerSigned: true;
  workerSignature: string;
  signedAt: string;
};

type ContractRecord = {
  id: string;
  worker: string;
  workerSigned: boolean;
  workerSignature?: string;
  signedAt?: string;
  [key: string]: unknown;
};

type AuditRecord = {
  id: string;
  action: string;
  detail: string;
  when: string;
  tone: string;
};

export type ContractStore = {
  contracts: ContractRecord[];
  notifications?: number;
  audits?: AuditRecord[];
  [key: string]: unknown;
};

export type SignatureReceipt<T> = {
  status: "updated" | "duplicate" | "missing" | "invalid";
  store: T;
};

export function parseSignedContractPayload(
  payload: unknown
): SignedContractPayload | null {
  if (!payload || typeof payload !== "object") return null;
  const signed = payload as Partial<SignedContractPayload>;
  if (
    typeof signed.id !== "string" ||
    !signed.id.trim() ||
    typeof signed.worker !== "string" ||
    !signed.worker.trim() ||
    signed.workerSigned !== true ||
    typeof signed.workerSignature !== "string" ||
    !/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(signed.workerSignature) ||
    typeof signed.signedAt !== "string" ||
    Number.isNaN(Date.parse(signed.signedAt))
  ) {
    return null;
  }
  return {
    id: signed.id,
    worker: signed.worker,
    workerSigned: true,
    workerSignature: signed.workerSignature,
    signedAt: signed.signedAt,
  };
}

export function isOperatorStoreUpdate(message: unknown): boolean {
  if (!message || typeof message !== "object") return false;
  const candidate = message as { type?: unknown; source?: unknown };
  return candidate.type === "store-sync" && candidate.source !== "snapshot";
}

export function storeSnapshotsEqual(left: unknown, right: unknown): boolean {
  const stableStringify = (value: unknown) =>
    JSON.stringify(value, (_key, current) => {
      if (current && typeof current === "object" && !Array.isArray(current)) {
        const record = current as Record<string, unknown>;
        return Object.fromEntries(
          Object.keys(record)
            .sort()
            .map(key => [key, record[key]])
        );
      }
      return current;
    });
  return stableStringify(left) === stableStringify(right);
}

export function applySignedContract<T extends ContractStore>(
  store: T,
  payload: unknown,
  auditId: string,
  receivedAt = "agora"
): SignatureReceipt<T> {
  const signed = parseSignedContractPayload(payload);
  if (!signed) return { status: "invalid", store };
  const current = store.contracts.find(contract => contract.id === signed.id);
  if (!current) return { status: "missing", store };
  if (current.worker !== signed.worker) return { status: "invalid", store };
  if (current.workerSigned && current.workerSignature) {
    return current.workerSignature === signed.workerSignature
      ? { status: "duplicate", store }
      : { status: "invalid", store };
  }
  const next = {
    ...store,
    notifications: (store.notifications || 0) + 1,
    contracts: store.contracts.map(contract =>
      contract.id === signed.id
        ? {
            ...contract,
            workerSigned: true,
            workerSignature: signed.workerSignature,
            signedAt: signed.signedAt,
          }
        : contract
    ),
    audits: [
      {
        id: auditId,
        action: "Contrato assinado recebido",
        detail: `${signed.id} • ${signed.worker}`,
        when: receivedAt,
        tone: "green",
      },
      ...(store.audits || []),
    ],
  };
  return { status: "updated", store: next as T };
}
