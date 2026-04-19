"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ServerSidebar } from "@/components/layout/ServerSidebar";
import { ChannelSidebar } from "@/components/layout/ChannelSidebar";
import { MemberPanel } from "@/components/layout/MemberPanel";
import { ChatArea } from "@/components/chat/ChatArea";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { FullProfile } from "@/components/profile/FullProfile";
import { SpotifyPlayer } from "@/components/spotify/SpotifyPlayer";
import { VoiceChannel } from "@/components/voice/VoiceChannel";
import { VideoCall } from "@/components/voice/VideoCall";
import { MOCK_SERVERS, MOCK_MESSAGES, MOCK_USERS, CURRENT_USER } from "@/lib/mock-data";
import type { User, Message, Channel } from "@/lib/types";
import { generateId } from "@/lib/utils";

export default function AppPage() {
  const router = useRouter();
  const [currentServerId, setCurrentServerId] = useState(MOCK_SERVERS[0].id);
  const [currentChannelId, setCurrentChannelId] = useState(
    MOCK_SERVERS[0].categories[1].channels[0].id
  );
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [muted, setMuted] = useState(false);
  const [deafened, setDeafened] = useState(false);
  const [showMemberPanel, setShowMemberPanel] = useState(true);
  const [showSpotify, setShowSpotify] = useState(true);

  // Profile state
  const [profileCardUser, setProfileCardUser] = useState<User | null>(null);
  const [profileCardPos, setProfileCardPos] = useState({ x: 0, y: 0 });
  const [fullProfileUser, setFullProfileUser] = useState<User | null>(null);

  // Voice/Video state
  const [inVoice, setInVoice] = useState(false);
  const [inVideo, setInVideo] = useState(false);
  const [activeVoiceChannel, setActiveVoiceChannel] = useState<Channel | null>(null);

  const currentServer = MOCK_SERVERS.find((s) => s.id === currentServerId) ?? MOCK_SERVERS[0];

  const currentChannel = currentServer.categories
    .flatMap((c) => c.channels)
    .find((ch) => ch.id === currentChannelId) ??
    currentServer.categories[1].channels[0];

  const channelMessages = messages.filter((m) => m.channelId === currentChannelId);

  const handleClickUser = useCallback((user: User) => {
    setProfileCardUser(user);
    setProfileCardPos({ x: 200, y: 200 });
  }, []);

  const handleSelectChannel = (channelId: string) => {
    const channel = currentServer.categories
      .flatMap((c) => c.channels)
      .find((ch) => ch.id === channelId);

    if (!channel) return;

    if (channel.type === "voice" || channel.type === "stage") {
      setActiveVoiceChannel(channel);
      setInVoice(true);
      setInVideo(false);
    } else if (channel.type === "video") {
      setActiveVoiceChannel(channel);
      setInVideo(true);
      setInVoice(false);
    } else {
      setCurrentChannelId(channelId);
      setInVoice(false);
      setInVideo(false);
    }
  };

  const handleSendMessage = (content: string) => {
    const newMsg: Message = {
      id: generateId(),
      channelId: currentChannelId,
      authorId: CURRENT_USER.id,
      author: CURRENT_USER,
      content,
      createdAt: new Date().toISOString(),
      reactions: [],
      attachments: [],
      pinned: false,
      type: "default",
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const VOICE_PARTICIPANTS = MOCK_USERS.map((u) => ({
    user: u,
    muted: u.id === "user-2",
    deafened: false,
    cameraOff: false,
    speaking: u.id === "user-3",
    isLocal: u.id === CURRENT_USER.id,
  }));

  return (
    <div className="flex h-full overflow-hidden" style={{ background: "var(--lyra-primary-bg)" }}>
      {/* Server sidebar */}
      <ServerSidebar
        servers={MOCK_SERVERS}
        currentServerId={currentServerId}
        currentUser={CURRENT_USER}
        onSelectServer={(id) => {
          if (id !== "dm") {
            setCurrentServerId(id);
            const server = MOCK_SERVERS.find((s) => s.id === id);
            if (server) {
              const firstText = server.categories
                .flatMap((c) => c.channels)
                .find((ch) => ch.type === "text" || ch.type === "announcements");
              if (firstText) setCurrentChannelId(firstText.id);
            }
          }
        }}
        onOpenSettings={() => router.push("/settings")}
      />

      {/* Channel sidebar */}
      <ChannelSidebar
        server={currentServer}
        currentChannelId={currentChannelId}
        currentUser={CURRENT_USER}
        muted={muted}
        deafened={deafened}
        onSelectChannel={handleSelectChannel}
        onToggleMute={() => setMuted((v) => !v)}
        onToggleDeafen={() => setDeafened((v) => !v)}
        onOpenSettings={() => router.push("/settings")}
        onOpenProfile={() => setFullProfileUser(CURRENT_USER)}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {inVoice && activeVoiceChannel ? (
          <VoiceChannel
            channelName={activeVoiceChannel.name}
            participants={VOICE_PARTICIPANTS}
            currentUser={CURRENT_USER}
            onLeave={() => { setInVoice(false); setActiveVoiceChannel(null); }}
          />
        ) : inVideo && activeVoiceChannel ? (
          <VideoCall
            channelName={activeVoiceChannel.name}
            participants={VOICE_PARTICIPANTS}
            currentUser={CURRENT_USER}
            onLeave={() => { setInVideo(false); setActiveVoiceChannel(null); }}
          />
        ) : (
          <ChatArea
            channel={currentChannel}
            messages={channelMessages}
            currentUser={CURRENT_USER}
            onClickUser={handleClickUser}
            onSendMessage={handleSendMessage}
            showMemberPanel={showMemberPanel}
            onToggleMemberPanel={() => setShowMemberPanel((v) => !v)}
          />
        )}

        {/* Spotify player */}
        {showSpotify && CURRENT_USER.spotifyConnected && (
          <SpotifyPlayer />
        )}
      </div>

      {/* Member panel */}
      {showMemberPanel && !inVoice && !inVideo && (
        <MemberPanel
          members={MOCK_USERS}
          onClickUser={handleClickUser}
        />
      )}

      {/* Profile card popup */}
      {profileCardUser && (
        <ProfileCard
          user={profileCardUser}
          position={profileCardPos}
          onClose={() => setProfileCardUser(null)}
          onViewFullProfile={() => {
            setFullProfileUser(profileCardUser);
            setProfileCardUser(null);
          }}
          onMessage={() => setProfileCardUser(null)}
          onAddFriend={() => setProfileCardUser(null)}
        />
      )}

      {/* Full profile overlay */}
      {fullProfileUser && (
        <FullProfile
          user={fullProfileUser}
          onClose={() => setFullProfileUser(null)}
        />
      )}
    </div>
  );
}
