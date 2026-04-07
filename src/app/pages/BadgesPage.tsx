import { Award, Lock, Sparkles } from "lucide-react";

interface Badge {
  name: string;
  icon: string;
  earned: boolean;
  description: string;
}

export function BadgesPage() {
  const badges: Badge[] = [
    { name: "First Order", icon: "🎉", earned: true, description: "Complete your first mystery order" },
    { name: "Collector", icon: "🏆", earned: true, description: "Own 10+ shirts" },
    { name: "Trader", icon: "🔄", earned: true, description: "Complete 5 trades" },
    { name: "Mystery Master", icon: "⭐", earned: true, description: "Complete 15 orders" },
    { name: "Global Fan", icon: "🌍", earned: false, description: "Collect shirts from 10 countries" },
    { name: "Legend", icon: "👑", earned: false, description: "Complete 50 orders" },
  ];

  const earnedCount = badges.filter((badge) => badge.earned).length;

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge) => (
            <div
              key={badge.name}
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
      </div>
    </div>
  );
}
