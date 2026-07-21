import React from 'react';

import { Screen, EmptyState } from '../components';

/**
 * Stands in for modules that have not been built yet, so navigation can be exercised
 * end to end. Each is replaced as its module lands.
 */
export function makePlaceholder(title: string, message: string) {
  return function PlaceholderScreen() {
    return (
      <Screen>
        <EmptyState title={title} message={message} />
      </Screen>
    );
  };
}

export const HomeScreen = makePlaceholder(
  'Your desk',
  'Your dashboard, active simulation, and today’s briefs will appear here.',
);

export const CareersScreen = makePlaceholder(
  'Career catalogue',
  'Browse roles by category, compare tracks, and pick the one you want to try.',
);

export const SimulationsScreen = makePlaceholder(
  'My simulations',
  'Simulations you have started, with progress and the next mission in each.',
);

export const InboxScreen = makePlaceholder(
  'Inbox',
  'Messages from your AI manager and the company land here.',
);

export const ProfileScreen = makePlaceholder(
  'Profile',
  'Your badge, portfolio, certificates, and settings.',
);
