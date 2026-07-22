import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';

export interface EmployeeBadgeProps {
  /** Role title, e.g. the career title. */
  roleTitle: string;
  /** Company / environment name. */
  companyName: string;
  /** Monospaced employee ID. */
  employeeId: string;
  /** Current ladder level title, e.g. "Intern". */
  levelTitle: string;
  /** Optional holder name; falls back to the role as the identity line. */
  holderName?: string;
  style?: ViewStyle;
}

/**
 * The signature Employee Badge (DESIGN_SYSTEM.md §1) — a glass card with a lit violet top
 * edge carrying the user's role, company, level, and employee ID. This one object carries the
 * whole "you are an employee" premise, so it is a shared component reused on the onboarding
 * finale, Home, Profile, and the Certificate. Purely presentational and data-driven.
 */
export function EmployeeBadge({
  roleTitle,
  companyName,
  employeeId,
  levelTitle,
  holderName,
  style,
}: EmployeeBadgeProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={`Employee badge. ${holderName ?? roleTitle}, ${roleTitle} at ${companyName}. Level ${levelTitle}. ID ${employeeId}.`}
      style={[
        {
          borderRadius: theme.radius.lg,
          padding: theme.spacing[5],
          gap: theme.spacing[4],
          backgroundColor: theme.colors.glass,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.glassBorder,
          borderTopColor: theme.colors.lightEdge,
          borderTopWidth: 1,
          overflow: 'hidden',
        },
        theme.elevation.e2,
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View
          style={{
            paddingHorizontal: theme.spacing[3],
            paddingVertical: theme.spacing[1],
            borderRadius: theme.radius.sm,
            borderWidth: 1,
            borderColor: theme.colors.brand,
          }}
        >
          <Text variant="mono" color="brand">
            CV
          </Text>
        </View>
        <Text variant="label" color="caption">
          Employee
        </Text>
      </View>

      <View style={{ gap: theme.spacing[1] }}>
        <Text variant="h2">{holderName ?? roleTitle}</Text>
        <Text variant="sm" color="secondary">
          {roleTitle} · {companyName}
        </Text>
      </View>

      <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: theme.colors.divider }} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ gap: 2 }}>
          <Text variant="label" color="caption">
            ID
          </Text>
          <Text variant="mono" color="primary">
            {employeeId}
          </Text>
        </View>
        <View style={{ gap: 2, alignItems: 'flex-end' }}>
          <Text variant="label" color="caption">
            Level
          </Text>
          <Text variant="bodyMd" color="brand">
            {levelTitle}
          </Text>
        </View>
      </View>
    </View>
  );
}
