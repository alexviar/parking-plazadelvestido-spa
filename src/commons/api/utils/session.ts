import { sessionLifetime } from "../../../configs/api";
import { apiUrl } from "../baseQuery";

let sessionExpiresAt: number = Number(localStorage.getItem("sessionExpiresAt"));
let refreshSessionPromise: Promise<void> | null = null;

export async function refreshSession() {
  if (refreshSessionPromise) {
    await refreshSessionPromise;
    return;
  }

  refreshSessionPromise = (async () => {
    try {
      await fetch(`${apiUrl}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include"
      });

      const lifetimeInMilliseconds = sessionLifetime * 60 * 1000; // 2h
      sessionExpiresAt = Date.now() + lifetimeInMilliseconds;
      localStorage.setItem("sessionExpiresAt", sessionExpiresAt.toString());
    } finally {
      // Asegura que siempre se limpie, incluso si falla el fetch
      refreshSessionPromise = null;
    }
  })();

  await refreshSessionPromise;
}

export async function refreshSessionIfExpired() {
  if (Date.now() >= sessionExpiresAt) {
    await refreshSession();
  }
}
