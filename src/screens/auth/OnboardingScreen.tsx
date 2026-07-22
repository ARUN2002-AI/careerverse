import React, { useRef, useState, useCallback } from 'react';
import { View, FlatList, useWindowDimensions, Pressable, type ViewToken } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Screen, Text, Button, Card } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

interface Slide {
  eyebrow: string;
  title: string;
  body: string;
  /** The concrete artefact this stage of the product produces. */
  artefact: { label: string; value: string };
}

/**
 * Three slides, one per stage of the product promise: pick a role, do the work,
 * leave with proof. Each slide shows the artefact that stage produces, so onboarding
 * demonstrates the product rather than describing it.
 */
const SLIDES: Slide[] = [
  {
    eyebrow: 'Step one',
    title: 'Take a role',
    body: 'Choose a career and a company type. You get a title, a team, and a manager on day one.',
    artefact: { label: 'Assigned role', value: 'Frontend Engineer · Startup' },
  },
  {
    eyebrow: 'Step two',
    title: 'Do the work',
    body: 'Real briefs land in your inbox. Ship them, get reviewed, and handle the feedback.',
    artefact: { label: 'Open ticket', value: 'CV-114 · Fix checkout drop-off' },
  },
  {
    eyebrow: 'Step three',
    title: 'Leave with proof',
    body: 'Finish the simulation with a portfolio, a skill report, and a certificate that shows what you did.',
    artefact: { label: 'Issued', value: 'Performance report · 8.4 / 10' },
  },
];

export function OnboardingScreen({ navigation }: Props) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems[0]?.index;
    if (typeof first === 'number') setIndex(first);
  }).current;

  const isLast = index === SLIDES.length - 1;

  const advance = useCallback(() => {
    if (isLast) {
      navigation.navigate('Register');
    } else {
      listRef.current?.scrollToIndex({ index: index + 1, animated: !theme.reduceMotion });
    }
  }, [isLast, index, navigation, theme.reduceMotion]);

  // Slides span the full width, so this screen opts out of Screen's horizontal padding.
  const slideWidth = width;

  return (
    <Screen bleed gradient>
      <View style={{ flex: 1 }}>
        <FlatList
          ref={listRef}
          data={SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.title}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
          getItemLayout={(_, i) => ({ length: slideWidth, offset: slideWidth * i, index: i })}
          renderItem={({ item }) => (
            <View
              style={{
                width: slideWidth,
                paddingHorizontal: theme.screenX,
                justifyContent: 'center',
              }}
            >
              <Text variant="label" color="caption">
                {item.eyebrow}
              </Text>
              <Text variant="display" style={{ marginTop: theme.spacing[2] }}>
                {item.title}
              </Text>
              <Text variant="body" color="secondary" style={{ marginTop: theme.spacing[3] }}>
                {item.body}
              </Text>

              <Card variant="glass" style={{ marginTop: theme.spacing[8] }}>
                <Text variant="label" color="caption">
                  {item.artefact.label}
                </Text>
                <Text variant="mono" color="brand" style={{ marginTop: theme.spacing[2] }}>
                  {item.artefact.value}
                </Text>
              </Card>
            </View>
          )}
        />

        <View style={{ paddingHorizontal: theme.screenX, paddingBottom: theme.spacing[6] }}>
          {/* Progress reads as a row of bars; the active one widens. */}
          <View
            style={{ flexDirection: 'row', gap: theme.spacing[2], marginBottom: theme.spacing[6] }}
            accessibilityRole="progressbar"
            accessibilityLabel={`Step ${index + 1} of ${SLIDES.length}`}
          >
            {SLIDES.map((slide, i) => (
              <View
                key={slide.title}
                style={{
                  height: 3,
                  width: i === index ? 28 : 12,
                  borderRadius: theme.radius.full,
                  backgroundColor: i === index ? theme.colors.brand : theme.colors.divider,
                }}
              />
            ))}
          </View>

          <Animated.View entering={theme.reduceMotion ? undefined : FadeIn.duration(theme.motion.base)}>
            <Button
              label={isLast ? 'Create your account' : 'Next'}
              fullWidth
              onPress={advance}
            />
          </Animated.View>

          <Pressable
            onPress={() => navigation.navigate('Login')}
            hitSlop={12}
            accessibilityRole="button"
            style={{ alignSelf: 'center', marginTop: theme.spacing[4] }}
          >
            <Text variant="sm" color="secondary">
              I already have an account
            </Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
