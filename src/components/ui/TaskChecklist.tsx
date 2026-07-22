import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { CheckRow } from './CheckRow';

export interface TaskChecklistItem {
  id: string;
  label: string;
  description?: string;
}

export interface TaskChecklistProps {
  items: TaskChecklistItem[];
  checkedIds: string[];
  onToggle: (id: string) => void;
  style?: ViewStyle;
}

/**
 * A controlled checklist built from CheckRow. Reused for the work-session task list, and any
 * future step-completion UI. Fully data-driven — the caller supplies the items.
 */
export function TaskChecklist({ items, checkedIds, onToggle, style }: TaskChecklistProps) {
  const theme = useTheme();
  const checked = new Set(checkedIds);

  return (
    <View style={[{ gap: theme.spacing[3] }, style]}>
      {items.map((item) => (
        <CheckRow
          key={item.id}
          label={item.label}
          description={item.description}
          checked={checked.has(item.id)}
          onToggle={() => onToggle(item.id)}
        />
      ))}
    </View>
  );
}
