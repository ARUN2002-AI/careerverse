import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';
import type { CompanyType } from '../../simulation';

export interface CompanyCardProps {
  company: CompanyType;
  selected: boolean;
  onPress: () => void;
}

/** A labelled fact about the environment. */
function Facet({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: 2 }}>
      <Text variant="label" color="caption">
        {label}
      </Text>
      <Text variant="sm">{value}</Text>
    </View>
  );
}

/** A short bulleted list rendered from a string array (responsibilities, processes). */
function Bullets({ label, items }: { label: string; items: string[] }) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing[1] }}>
      <Text variant="label" color="caption">
        {label}
      </Text>
      {items.map((item, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: theme.spacing[2] }}>
          <Text variant="sm" color="brand">
            ·
          </Text>
          <Text variant="sm" color="secondary" style={{ flex: 1 }}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

/**
 * Selectable card for one company environment (Phase 2). Everything shown comes from
 * `company-types.json`, so the same card renders any environment. Selection is a brand-lit
 * border plus a soft brand fill, matching the Chip selected treatment.
 */
export function CompanyCard({ company, selected, onPress }: CompanyCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${company.name}. ${company.description}`}
      style={({ pressed }) => ({
        borderRadius: theme.radius.lg,
        padding: theme.layout.cardPadding,
        gap: theme.spacing[4],
        backgroundColor: selected ? theme.colors.brandSoft : theme.colors.surface,
        borderWidth: selected ? 1.5 : StyleSheet.hairlineWidth,
        borderColor: selected ? theme.colors.brand : theme.colors.divider,
        opacity: pressed ? theme.opacity.pressed : 1,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] }}>
        <Text variant="h3" style={{ flex: 1 }}>
          {company.name}
        </Text>
        {selected ? (
          <Text variant="body" color="brand" accessibilityLabel="Selected">
            ✓
          </Text>
        ) : (
          <Badge label={company.modifiers.paceLabel} tone="neutral" />
        )}
      </View>

      <Text variant="sm" color="secondary">
        {company.description}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          rowGap: theme.spacing[3],
          columnGap: theme.spacing[6],
        }}
      >
        <Facet label="Team size" value={company.teamSize} />
        <Facet label="Growth" value={company.growthSpeed} />
        <Facet label="Work style" value={company.workStyle} />
        <Facet label="Communication" value={company.communicationStyle} />
      </View>

      <Bullets label="What you own" items={company.responsibilities} />
    </Pressable>
  );
}
