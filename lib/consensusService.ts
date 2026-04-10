import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface ConsensusStatus {
  verified: number;
  total: number;
  hasConsensus: boolean;
}

/**
 * Calculates the consensus state for a given user's trustee network.
 * Consensus is achieved when ≥ 2/3 of all trustees have status "Verified".
 */
export async function getConsensusStatus(
  userEmail: string
): Promise<ConsensusStatus> {
  const trusteesRef = collection(db, "users", userEmail, "trustees");
  const snap = await getDocs(trusteesRef);

  const total = snap.size;
  const verified = snap.docs.filter(
    (d) => d.data().status === "Verified"
  ).length;

  const hasConsensus = total > 0 && verified / total >= 2 / 3;

  return { verified, total, hasConsensus };
}
