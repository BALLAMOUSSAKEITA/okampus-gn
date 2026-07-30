"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { subscribeToPushNotifications } from "@/lib/push-notifications";

interface PushNotificationSetupProps {
  enabled: boolean;
}

export default function PushNotificationSetup({ enabled }: PushNotificationSetupProps) {
  const { data: session } = useSession();
  const [status, setStatus] = useState<"idle" | "prompting" | "done" | "unsupported">("idle");

  useEffect(() => {
    if (!enabled || !session?.user) return;
    if (typeof window === "undefined") return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setStatus("unsupported");
      return;
    }
    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) return;

    if (Notification.permission === "granted") {
      void subscribeToPushNotifications().then((ok) => {
        setStatus(ok ? "done" : "idle");
      });
      return;
    }

    if (Notification.permission === "default") {
      setStatus("prompting");
    }
  }, [enabled, session?.user]);

  const handleEnable = async () => {
    if (!session?.user) return;
    setStatus("prompting");
    const ok = await subscribeToPushNotifications();
    setStatus(ok ? "done" : "idle");
  };

  if (!enabled || status === "unsupported" || status === "done") return null;
  if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) return null;

  return (
    <div className="mb-4 rounded-lg border border-[#99c5ff] bg-[#eef5ff] px-4 py-3">
      <p className="text-sm font-medium text-[#121117]">
        Recois une notification sur ton téléphone quand un bachelier t&apos;écrit.
      </p>
      <button
        type="button"
        onClick={handleEnable}
        disabled={status === "prompting"}
        className="mt-2 text-sm font-semibold text-[#14b887] hover:underline disabled:opacity-60"
      >
        {status === "prompting" ? "Activation..." : "Activer les notifications"}
      </button>
    </div>
  );
}
