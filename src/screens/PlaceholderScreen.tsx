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
