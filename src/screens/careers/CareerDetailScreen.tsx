import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  Screen,
  Text,
  Button,
  Card,
  Badge,
  SectionHeader,
  DifficultyBadge,
  ErrorState,
} from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { getCareer, type RequiredSkill } from '../../simulation';
import { formatMoney, titleCase } from '../../utils/format';
import type { CareersStackParamList } from '../../navigation/types';
import type { StatusTone } from '../../components/ui/Badge';

type Props = NativeStackScreenProps<CareersStackParamList, 'CareerDetail'>;

const SKILL_TONE: Record<RequiredSkill['importance'], { tone: StatusTone; glyph?: string }> = {
  core: { tone: 'brand', glyph: '★' },
  important: { tone: 'accent', glyph: '◆' },
  optional: { tone: 'neutral' },
};

/** A back affordance for the header-less stack. */
function BackRow({ onPress }: { onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      style={{ alignSelf: 'flex-start', marginTop: theme.spacing[2] }}
    >
      <Text variant="sm" color="secondary">
        ‹ Back
      </Text>
    </Pressable>
  );
}

export function CareerDetailScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { careerId } = route.params;
  const career = useMemo(() => getCareer(careerId), [careerId]);

  if (!career) {
    return (
      <Screen>
        <ErrorState
          title="Career not found"
          message="This career is no longer available."
          actionLabel="Back to catalogue"
          onAction={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  const { overview, requiredSkills, roadmap, salary, futureOpportunities, learningPath } = career;
  const gap = theme.layout.sectionGap;

  return (
    <Screen scroll gradient>
      <BackRow onPress={() => navigation.goBack()} />

      {/* Hero */}
      <View style={{ marginTop: theme.spacing[6], gap: theme.spacing[2] }}>
        <Text variant="label" color="caption">
          {titleCase(overview.category)}
        </Text>
        <Text variant="display">{overview.title}</Text>
        <Text variant="body" color="secondary">
          {overview.tagline}
        </Text>
        <View style={{ flexDirection: 'row', marginTop: theme.spacing[2] }}>
          <DifficultyBadge level={overview.difficulty} />
        </View>
      </View>

      {/* Overview */}
      <View style={{ marginTop: gap }}>
        <SectionHeader title="Overview" />
        <Text variant="body" color="secondary">
          {overview.description}
        </Text>
      </View>

      {/* Required skills */}
      <View style={{ marginTop: gap }}>
        <SectionHeader title="Required skills" caption="What you’ll actually use on the job." />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] }}>
          {requiredSkills.map((skill) => {
            const t = SKILL_TONE[skill.importance];
            return <Badge key={skill.id} label={skill.name} tone={t.tone} glyph={t.glyph} />;
          })}
        </View>
      </View>

      {/* Roadmap */}
      <View style={{ marginTop: gap }}>
        <SectionHeader title="Career roadmap" />
        <View style={{ gap: theme.spacing[3] }}>
          {roadmap.map((stage, i) => (
            <Card key={stage.id} variant="outline">
              <View style={{ flexDirection: 'row', gap: theme.spacing[3] }}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: theme.radius.full,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.colors.brandSoft,
                  }}
                >
                  <Text variant="sm" color="brand">
                    {i + 1}
                  </Text>
                </View>
                <View style={{ flex: 1, gap: theme.spacing[1] }}>
                  <Text variant="label" color="caption">
                    {stage.durationLabel}
                  </Text>
                  <Text variant="bodyMd">{stage.title}</Text>
                  <Text variant="sm" color="secondary">
                    {stage.summary}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </View>

      {/* Salary */}
      <View style={{ marginTop: gap }}>
        <SectionHeader title="Salary insights" caption="Indicative ranges — they vary by region and company." />
        <View style={{ gap: theme.spacing[3] }}>
          {salary.map((s, i) => (
            <Card key={i} variant="solid">
              <Text variant="bodyMd">{s.region}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: theme.spacing[3],
                }}
              >
                {(['junior', 'mid', 'senior'] as const).map((tier) => (
                  <View key={tier} style={{ gap: theme.spacing[1] }}>
                    <Text variant="label" color="caption">
                      {titleCase(tier)}
                    </Text>
                    <Text variant="mono" color="primary">
                      {formatMoney(s[tier], s.currency)}
                    </Text>
                    <Text variant="xs" color="caption">
                      /{s.period}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          ))}
        </View>
      </View>

      {/* Future opportunities */}
      <View style={{ marginTop: gap }}>
        <SectionHeader title="Future opportunities" />
        <View style={{ gap: theme.spacing[3] }}>
          {futureOpportunities.map((op) => (
            <View key={op.id} style={{ gap: theme.spacing[1] }}>
              <Text variant="bodyMd">{op.title}</Text>
              <Text variant="sm" color="secondary">
                {op.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Learning path */}
      <View style={{ marginTop: gap }}>
        <SectionHeader title="Learning path" />
        <View style={{ gap: theme.spacing[3] }}>
          {learningPath.map((item, i) => (
            <View
              key={item.id}
              style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] }}
            >
              <Text variant="mono" color="brand">
                {String(i + 1).padStart(2, '0')}
              </Text>
              <Text variant="body" style={{ flex: 1 }}>
                {item.title}
              </Text>
              <Badge label={titleCase(item.type)} tone="neutral" />
            </View>
          ))}
        </View>
      </View>

      {/* CTA */}
      <Button
        label="Experience this career"
        fullWidth
        onPress={() => navigation.navigate('CompanySelect', { careerId })}
        style={{ marginTop: gap }}
      />
    </Screen>
  );
}
