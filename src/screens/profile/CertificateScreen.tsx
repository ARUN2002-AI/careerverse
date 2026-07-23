import React, { useMemo } from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import {
  Screen,
  ScreenHeader,
  Text,
  Card,
  Badge,
  Button,
  StatTile,
  ProgressBar,
  RadialProgress,
  SectionHeader,
  EmptyState,
} from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useSimulation } from '../../simulation';
import { deriveCertificate } from '../../utils/certificate';
import type { ProfileStackParamList, MainTabParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Certificate'>;

export function CertificateScreen({ navigation }: Props) {
  const theme = useTheme();
  const { state, career, companyType } = useSimulation();
  const tabNav = navigation.getParent<BottomTabNavigationProp<MainTabParamList>>();

  const report = useMemo(
    () =>
      state && career && companyType ? deriveCertificate(career, companyType, state) : null,
    [state, career, companyType],
  );

  if (!state || !career || !companyType || !report) {
    return (
      <Screen scroll>
        <ScreenHeader title="Certificate" onBack={() => navigation.goBack()} backLabel="Profile" />
        <EmptyState
          title="No active career"
          message="Join a company and complete the career to earn a certificate."
          style={{ marginTop: theme.spacing[8] }}
        />
      </Screen>
    );
  }

  const gap = theme.layout.sectionGap;

  return (
    <Screen scroll gradient>
      <ScreenHeader
        eyebrow={career.overview.title}
        title="Certificate"
        caption={report.earned ? 'Awarded on completing the full career.' : 'Earned on completing the full career.'}
        onBack={() => navigation.goBack()}
        backLabel="Profile"
        trailing={
          report.earned ? (
            <Badge label="Awarded" tone="success" glyph="✓" />
          ) : (
            <Badge label="In progress" tone="neutral" glyph="○" />
          )
        }
      />

      {report.earned ? (
        <EarnedCertificate report={report} />
      ) : (
        <LockedCertificate
          report={report}
          onGoToMissions={() => tabNav?.navigate('Simulations', { screen: 'MissionBoard' })}
        />
      )}

      <Text variant="xs" color="caption" align="center" style={{ marginTop: gap }}>
        {report.certificate?.description ?? 'Complete the career to unlock your certificate.'}
      </Text>
    </Screen>
  );
}

function EarnedCertificate({ report }: { report: ReturnType<typeof deriveCertificate> }) {
  const theme = useTheme();
  const gap = theme.layout.sectionGap;

  return (
    <>
      {/* The certificate itself — a premium glass award card. */}
      <Card
        variant="glass"
        elevation="e3"
        style={{ marginTop: theme.spacing[5], gap: theme.spacing[3], alignItems: 'center', paddingVertical: theme.spacing[6] }}
      >
        <Badge label="CareerVerse" tone="brand" glyph="✦" />
        <Text variant="h2" align="center">
          {report.certificate?.title ?? 'Career Certificate'}
        </Text>
        <Text variant="sm" color="secondary" align="center">
          This certifies that the holder completed the
        </Text>
        <Text variant="h3" color="brand" align="center">
          {report.recipientRole}
        </Text>
        <Text variant="sm" color="secondary" align="center">
          career simulation at a {report.company}, reaching {report.levelTitle}.
        </Text>

        <View style={{ marginVertical: theme.spacing[2] }}>
          <RadialProgress
            value={report.performanceScore / 100}
            tone="success"
            centerLabel={`${report.performanceScore}`}
            centerCaption="Final score"
            accessibilityLabel={`Final performance score ${report.performanceScore} out of 100`}
          />
        </View>

        <View style={{ height: 1, alignSelf: 'stretch', backgroundColor: theme.colors.divider }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch' }}>
          <View style={{ gap: 2 }}>
            <Text variant="label" color="caption">
              Awarded
            </Text>
            <Text variant="sm">{report.awardedDate}</Text>
          </View>
          <View style={{ gap: 2, alignItems: 'flex-end' }}>
            <Text variant="label" color="caption">
              Employee ID
            </Text>
            <Text variant="mono">{report.employeeId}</Text>
          </View>
        </View>
      </Card>

      {/* What it recognises */}
      <View style={{ marginTop: gap }}>
        <SectionHeader title="What you achieved" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[3] }}>
          <StatTile
            label="Missions"
            value={`${report.missionsCompleted}/${report.missionsTotal}`}
            tone="brand"
          />
          <StatTile label="Skills mastered" value={`${report.skillsMastered}`} />
          <StatTile label="Final level" value={report.levelTitle} />
        </View>
      </View>

      <View style={{ marginTop: gap }}>
        <Card variant="solid">
          <Text variant="sm" color="secondary">
            {report.summaryHeadline}
          </Text>
        </Card>
      </View>

      {report.improvementAreas.length > 0 && (
        <View style={{ marginTop: gap }}>
          <SectionHeader title="Where to grow next" />
          <Card variant="solid" style={{ gap: theme.spacing[1] }}>
            {report.improvementAreas.map((a, i) => (
              <Text key={i} variant="sm" color="secondary">
                • {a}
              </Text>
            ))}
          </Card>
        </View>
      )}
    </>
  );
}

function LockedCertificate({
  report,
  onGoToMissions,
}: {
  report: ReturnType<typeof deriveCertificate>;
  onGoToMissions: () => void;
}) {
  const theme = useTheme();
  const gap = theme.layout.sectionGap;
  const pct = Math.round(report.progressRatio * 100);

  return (
    <>
      <Card
        variant="glass"
        style={{ marginTop: theme.spacing[5], gap: theme.spacing[4], alignItems: 'center', paddingVertical: theme.spacing[6] }}
      >
        <RadialProgress
          value={report.progressRatio}
          tone="brand"
          centerLabel={`${pct}%`}
          centerCaption="To certificate"
          accessibilityLabel={`${pct} percent toward the certificate`}
        />
        <Text variant="h3" align="center">
          {report.certificate?.title ?? 'Career Certificate'}
        </Text>
        <Text variant="sm" color="secondary" align="center">
          Finish the career to unlock and personalise your certificate.
        </Text>
      </Card>

      <View style={{ marginTop: gap }}>
        <SectionHeader title="What’s left" caption="Complete these to earn the certificate." />
        <Card variant="solid" style={{ gap: theme.spacing[2] }}>
          {report.requirements.map((req, i) => (
            <RequirementRow key={i} met={req.met} label={req.label} detail={req.detail} />
          ))}
        </Card>
      </View>

      <View style={{ marginTop: gap }}>
        <ProgressBar
          value={report.progressRatio}
          label="Overall progress"
          trailing={`${pct}%`}
        />
      </View>

      <Button
        label="Continue your missions"
        variant="secondary"
        fullWidth
        onPress={onGoToMissions}
        style={{ marginTop: gap }}
        trailing={<Text variant="bodyMd" color="brand">→</Text>}
      />
    </>
  );
}

/** Read-only requirement line: a status glyph (never colour-only), label, and detail. */
function RequirementRow({ met, label, detail }: { met: boolean; label: string; detail: string }) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing[3],
        paddingVertical: theme.spacing[2],
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: theme.radius.sm,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: met ? theme.colors.brand : 'transparent',
          borderWidth: met ? 0 : 1.5,
          borderColor: theme.colors.divider,
        }}
      >
        <Text variant="sm" color={met ? 'onBrand' : 'caption'}>
          {met ? '✓' : '○'}
        </Text>
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="bodyMd" color={met ? 'primary' : 'secondary'}>
          {label}
        </Text>
        <Text variant="xs" color="caption">
          {detail}
        </Text>
      </View>
    </View>
  );
}
