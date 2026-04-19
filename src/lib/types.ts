export type UserStatus = "online" | "idle" | "dnd" | "offline" | "invisible";
export type AvatarShape = "circle" | "square" | "squircle";
export type AppRole = "owner" | "admin" | "user" | "guest";
export type MessageDensity = "compact" | "comfortable" | "cozy";

export type PrivacyLevel = "everyone" | "friends" | "nobody";

export interface PrivacySettings {
  bio: PrivacyLevel;
  customLinks: PrivacyLevel;
  status: PrivacyLevel;
  widgets: PrivacyLevel;
  mutualInfo: PrivacyLevel;
  joinDate: PrivacyLevel;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface IdentityTag {
  id: string;
  label: string;
  color: string;
}

export interface Badge {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number;
  progress: number;
  isPlaying: boolean;
  previewUrl?: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  avatarType?: "image" | "gif" | "mp4";
  avatarShape: AvatarShape;
  avatarEffect?: string;
  banner?: string;
  bannerType?: "image" | "gif" | "animated";
  status: UserStatus;
  customStatus?: string;
  pronouns?: string;
  bio?: string;
  identityTags: IdentityTag[];
  badges: Badge[];
  customLinks: SocialLink[];
  displayColor?: string;
  displayFont?: string;
  role: AppRole;
  joinedAt: string;
  spotifyConnected: boolean;
  nowPlaying?: SpotifyTrack;
  privacy: PrivacySettings;
  theme?: string;
  customCSS?: string;
}

export interface ServerProfile {
  serverId: string;
  userId: string;
  displayName?: string;
  avatar?: string;
  banner?: string;
  bio?: string;
}

export type ChannelType =
  | "text"
  | "voice"
  | "video"
  | "announcements"
  | "music"
  | "polls"
  | "events"
  | "stage"
  | "forum"
  | "custom";

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  categoryId?: string;
  serverId: string;
  topic?: string;
  unread: boolean;
  mentionCount: number;
  customIcon?: string;
}

export interface Category {
  id: string;
  name: string;
  serverId: string;
  collapsed: boolean;
  channels: Channel[];
}

export interface Server {
  id: string;
  name: string;
  icon?: string;
  ownerId: string;
  categories: Category[];
  memberCount: number;
  boostCount: number;
}

export interface Reaction {
  emoji: string;
  count: number;
  userIds: string[];
  animated: boolean;
}

export interface Attachment {
  id: string;
  url: string;
  type: "image" | "video" | "audio" | "file";
  name: string;
  size: number;
  width?: number;
  height?: number;
}

export interface Message {
  id: string;
  channelId: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: string;
  editedAt?: string;
  reactions: Reaction[];
  attachments: Attachment[];
  replyTo?: Message;
  pinned: boolean;
  type: "default" | "system" | "reply";
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  preview: ThemePreview;
  tokens: ThemeTokens;
}

export interface ThemePreview {
  primaryBg: string;
  secondaryBg: string;
  sidebarBg: string;
  accent: string;
  textPrimary: string;
}

export interface ThemeTokens {
  primaryBg: string;
  secondaryBg: string;
  tertiaryBg: string;
  sidebarBg: string;
  channelSidebarBg: string;
  chatBg: string;
  messageBg: string;
  accent: string;
  accentHover: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  buttonPrimary: string;
  buttonPrimaryText: string;
  inputBg: string;
  inputBorder: string;
  statusOnline: string;
  statusIdle: string;
  statusDnd: string;
  statusOffline: string;
  scrollbar: string;
  scrollbarHover: string;
}
