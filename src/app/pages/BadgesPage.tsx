import { useMemo, useState } from "react";
import { Award, Lock, Sparkles } from "lucide-react";
import { useAsyncEffect } from "../hooks/useAsyncEffect";
import { Spinner } from "../components/ui/spinner";
import { getUserBadges, type UserBadge } from "../services/badgeService";
import { useAppSelector } from "../store/hooks";

export function BadgesPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useAsyncEffect(async ({ isActive }) => {
    if (!user) {
      setBadges([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      const items = await getUserBadges(user.uid);
      if (!isActive()) return;
      setBadges(items);
      setIsLoading(false);
    } catch {
      if (!isActive()) return;
      setLoadError("Failed to load badges from Firestore.");
      setBadges([]);
      setIsLoading(false);
    }
  }, [user]);

  const earnedCount = useMemo(() => badges.filter((badge) => badge.earned).length, [badges]);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Badges</h1>
          <p className="text-muted-foreground">Track your achievements and unlock new milestones.</p>
        </div>

        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-500/10 p-2">
              <Award className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <div className="font-bold">{earnedCount} / {badges.length} Earned</div>
              <div className="text-sm text-muted-foreground">Keep ordering and trading to unlock all badges.</div>
            </div>
          </div>
        </div>

        {loadError && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {loadError}
          </div>
        )}

        {isLoading && (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <Spinner className="h-8 w-8 text-red-500" />
            <p className="text-muted-foreground text-lg">Loading badges</p>
          </div>
        )}

        {!isLoading && badges.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card/40 py-16 text-center">
            <p className="text-lg font-semibold">No badges found</p>
            <p className="mt-2 text-sm text-muted-foreground">Your badges collection is empty for this account.</p>
          </div>
        )}

        {!isLoading && badges.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`rounded-xl border p-6 transition-shadow ${
                  badge.earned
                    ? "border-red-500/30 bg-gradient-to-br from-red-500/10 to-zinc-500/10 hover:shadow-lg"
                    : "border-border bg-card opacity-80"
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="text-4xl">{badge.icon}</div>
                  {badge.earned ? (
                    <div className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-500">
                      <Sparkles className="h-3 w-3" />
                      Earned
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      Locked
                    </div>
                  )}
                </div>

                <h2 className="mb-1 text-xl font-bold">{badge.name}</h2>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
