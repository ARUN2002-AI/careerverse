import React, { useMemo } from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  Screen,
  ScreenHeader,
  Text,
  Card,
  Badge,
  SectionHeader,
  EmptyState,
} from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useSimulation } from '../../simulation';
import { deriveResume, type ResumeExperienceEntry } from '../../utils/resume';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Resume'>;

export function ResumeScreen({ navigation }: Props) {
  const theme = useTheme();
  const { state, career, companyType } = useSimulation();

  const resume = useMemo(
    () => (state && career && companyType ? deriveResume(career, companyType, state) : null),
    [state, career, companyType],
  );

  if (!state || !career || !companyType || !resume) {
    return (
      <Screen scroll>
        <ScreenHeader title="Resume" onBack={() => navigation.goBack()} backLabel="Profile" />
        <EmptyState
          title="No active career"
          message="Join a company and your resume builds itself as you work."
          style={{ marginTop: theme.spacing[8] }}
        />
      </Screen>
    );
  }

  const gap = theme.layout.sectionGap;

  return (
    <Screen scroll gradient>
      <ScreenHeader
        eyebrow="Auto-built from your run"
        title="Resume"
        caption="A live record of the role, the work, and the skills — updated every mission."
        onBack={() => navigation.goBack()}
        backLabel="Profile"
        trailing={resume.complete ? <Badge label="Complete" tone="success" glyph="✓" /> : undefined}
      />

      {/* Header block — the résumé masthead */}
      <Card variant="glass" style={{ marginTop: theme.spacing[5], gap: theme.spacing[2] }}>
        <Text variant="h1">{resume.headline}</Text>
        <Text variant="bodyMd" color="brand">
          {resume.levelTitle} · {resume.company}
        </Text>
        <View style={{ height: 1, backgroundColor: theme.colors.divider, marginVertical: theme.spacing[1] }} />
        <Text variant="mono" color="secondary">
          {resume.employeeId}
        </Text>
        <Text variant="sm" color="secondary">
          {resume.email}
        </Text>
        <Text variant="xs" color="caption">
          {resume.period}
        </Text>
      </Card>

      {/* Summary */}
      <View style={{ marginTop: gap }}>
        <SectionHeader title="Professional summary" />
        <Card variant="solid">
          <Text variant="sm" color="secondary">
            {resume.summary}
          </Text>
        </Card>
      </View>

      {/* Experience */}
      <View style={{ marginTop: gap }}>
        <SectionHeader title="Experience" />
        <View style={{ gap: theme.spacing[3] }}>
          {resume.experience.map((entry, i) => (
            <ExperienceCard key={i} entry={entry} />
          ))}
        </View>
      </View>

      {/* Key skills */}
      {resume.keySkills.length > 0 && (
        <View style={{ marginTop: gap }}>
          <SectionHeader title="Key skills" />
          <Card variant="solid">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] }}>
              {resume.keySkills.map((s, i) => (
                <Badge key={i} label={`${s.name} · ${s.levelLabel}`} tone="brand" glyph="◆" />
              ))}
            </View>
          </Card>
        </View>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <View style={{ marginTop: gap }}>
          <SectionHeader title="Selected projects" />
          <Card variant="solid" style={{ gap: theme.spacing[3] }}>
            {resume.projects.map((p, i) => (
              <View key={i} style={{ gap: 2 }}>
                <Text variant="bodyMd">{p.title}</Text>
                <Text variant="xs" color="caption">
                  {p.deliverable}
                </Text>
              </View>
            ))}
          </Card>
        </View>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <View style={{ marginTop: gap }}>
          <SectionHeader title="Certifications" />
          <Card variant="solid" style={{ gap: theme.spacing[2] }}>
            {resume.certifications.map((c, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: theme.spacing[2], alignItems: 'center' }}>
                <Text variant="bodyMd" color="brand">
                  ✦
                </Text>
                <Text variant="sm">{c}</Text>
              </View>
            ))}
          </Card>
        </View>
      )}

      <Text variant="xs" color="caption" align="center" style={{ marginTop: gap }}>
        Everything here reflects real work done in this simulation.
      </Text>
    </Screen>
  );
}

function ExperienceCard({ entry }: { entry: ResumeExperienceEntry }) {
  const theme = useTheme();
  return (
    <Card variant="solid" style={{ gap: theme.spacing[2] }}>
      <Text variant="h3">{entry.title}</Text>
      <Text variant="sm" color="brand">
        {entry.company}
      </Text>
      <Text variant="xs" color="caption">
        {entry.period}
      </Text>
      {entry.bullets.length > 0 && (
        <View style={{ gap: theme.spacing[1], marginTop: theme.spacing[1] }}>
          {entry.bullets.map((b, i) => (
            <Text key={i} variant="sm" color="secondary">
              • {b}
            </Text>
          ))}
        </View>
      )}
    </Card>
  );
}
