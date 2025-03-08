"use client";

import { useEffect } from "react";
import { useAuthStore, useSyncAuth } from "../../lib/store/authStore";
import { useUserStore } from "../../lib/store/userStore";

export default function ClientAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useSyncAuth();
  const { user } = useAuthStore();
  const { fetchUser } = useUserStore();

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  return <>{children}</>;
}
