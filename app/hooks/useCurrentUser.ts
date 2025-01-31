import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs"; // If using Clerk for authentication
import { currentProfile } from "@/lib/current-profile";

export const useCurrentUser = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await currentProfile();
        setUser(profile);
      } catch (error) {
        console.error("Error fetching user profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};
