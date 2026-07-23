export { Text } from './ui/Text';
export type { TextProps } from './ui/Text';

export { Button } from './ui/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './ui/Button';

export { Card } from './ui/Card';
export type { CardProps, CardVariant } from './ui/Card';

export { Input } from './ui/Input';
export type { InputProps } from './ui/Input';

export { Badge, Chip } from './ui/Badge';
export type { BadgeProps, ChipProps, StatusTone } from './ui/Badge';

export {
  EmptyState,
  ErrorState,
  SuccessState,
  LoadingState,
  Skeleton,
} from './ui/StateViews';
export type { SkeletonProps } from './ui/StateViews';

export { SectionHeader } from './ui/SectionHeader';
export type { SectionHeaderProps } from './ui/SectionHeader';

export { ScreenHeader } from './ui/ScreenHeader';
export type { ScreenHeaderProps } from './ui/ScreenHeader';

export { CheckRow } from './ui/CheckRow';
export type { CheckRowProps } from './ui/CheckRow';

export { StatTile } from './ui/StatTile';
export type { StatTileProps } from './ui/StatTile';

export { ProgressBar } from './ui/ProgressBar';
export type { ProgressBarProps } from './ui/ProgressBar';

export { RadialProgress } from './ui/RadialProgress';
export type { RadialProgressProps } from './ui/RadialProgress';

export { ListRow } from './ui/ListRow';
export type { ListRowProps } from './ui/ListRow';

export { TaskChecklist } from './ui/TaskChecklist';
export type { TaskChecklistProps, TaskChecklistItem } from './ui/TaskChecklist';

export { SegmentedControl } from './ui/SegmentedControl';
export type { SegmentedControlProps, SegmentedOption } from './ui/SegmentedControl';

export { Screen } from './layout/Screen';
export type { ScreenProps } from './layout/Screen';

// Career-domain presentational components (consume the simulation engine's data types).
export { DifficultyBadge, CareerCard, CompanyCard, MissionCard } from './career';
export type { CareerCardProps, CompanyCardProps, MissionCardProps, MissionStatus } from './career';

// Workplace components (personas, chat, the signature Employee Badge, communication).
export {
  PersonaAvatar,
  PersonaCard,
  ChatMessage,
  EmployeeBadge,
  ThreadRow,
  ChatComposer,
  MeetingCard,
  CoachingCard,
} from './workplace';
export type {
  PersonaAvatarProps,
  PersonaCardProps,
  ChatMessageProps,
  EmployeeBadgeProps,
  ThreadRowProps,
  ChatComposerProps,
  MeetingCardProps,
  CoachingCardProps,
} from './workplace';

// Onboarding (Phase 3) frame components.
export { JoiningProgress, JoiningScene } from './joining';
export type { JoiningProgressProps, JoiningSceneProps, JoiningSceneAction } from './joining';

// Workday (Phase 7) components.
export {
  WorkTimer,
  ProgressTimeline,
  AttendanceCard,
  ScheduleCard,
  TeamCard,
  FeedbackCard,
  ReviewCard,
  SummaryCard,
  ActivityCard,
} from './workday';
export type {
  WorkTimerProps,
  ProgressTimelineProps,
  ProgressTimelineStep,
  AttendanceCardProps,
  ScheduleCardProps,
  TeamCardProps,
  FeedbackCardProps,
  ReviewCardProps,
  SummaryCardProps,
  SummaryStat,
  ActivityCardProps,
  ActivityItem,
} from './workday';
