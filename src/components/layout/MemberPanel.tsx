"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import type { User } from "@/lib/types";

interface MemberPanelProps {
  members: User[];
  onClickUser: (user: User) => void;
  className?: string;
}

function groupMembers(members: User[]) {
  const online = members.filter((m) => m.status !== "offline" && m.status !== "invisible");
  const offline = members.filter((m) => m.status === "offline" || m.status === "invisible");
  return { online, offline };
}

export function MemberPanel({ members, onClickUser, className }: MemberPanelProps) {
  const { online, offline } = groupMembers(members);

  return (
    <aside className={cn("glass-sidebar-right flex flex-col w-[224px] flex-shrink-0 py-4 overflow-y-auto", className)}>
      <div className="px-3 mb-2">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--lyra-text-muted)" }}>
          Online — {online.length}
        </p>
      </div>
      {online.map((m) => <MemberRow key={m.id} member={m} onClick={() => onClickUser(m)} />)}

      {offline.length > 0 && (
        <>
          <div className="px-3 mt-4 mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--lyra-text-muted)" }}>
              Offline — {offline.length}
            </p>
          </div>
          {offline.map((m) => <MemberRow key={m.id} member={m} onClick={() => onClickUser(m)} dim />)}
        </>
      )}
    </aside>
  );
}

function MemberRow({ member, onClick, dim }: { member: User; onClick: () => void; dim?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn("flex items-center gap-3 px-3 py-1.5 mx-1 rounded-lg transition-all duration-150 text-left", dim && "opacity-40")}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--lyra-glass-hover)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
    >
      <div className="relative flex-shrink-0">
        <Avatar displayName={member.displayName} src={member.avatar} shape={member.avatarShape} size={32} />
        <StatusIndicator
          status={member.status}
          size="sm"
          className="absolute -bottom-0.5 -right-0.5 border-2 border-transparent"
        />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: member.displayColor || "var(--lyra-text-primary)" }}>
          {member.displayName}
        </p>
        {member.customStatus && (
          <p className="text-xs truncate" style={{ color: "var(--lyra-text-muted)" }}>{member.customStatus}</p>
        )}
      </div>
    </button>
  );
}
