import { BadgeCheck, Crown } from "lucide-react";

export function UserBadges({ vip, verified, vipExpiresAt }: { vip?: boolean; verified?: boolean; vipExpiresAt?: string | null }) {
  const vipActive = vip && (!vipExpiresAt || new Date(vipExpiresAt) > new Date());
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      {verified && (
        <BadgeCheck className="h-4 w-4 text-verified" aria-label="DVX Verified">
          <title>DVX Verified</title>
        </BadgeCheck>
      )}
      {vipActive && (
        <span className="inline-flex items-center gap-0.5 rounded bg-vip px-1.5 py-0.5 text-[10px] font-bold uppercase text-vip-foreground">
          <Crown className="h-3 w-3" /> VIP
        </span>
      )}
    </span>
  );
}
