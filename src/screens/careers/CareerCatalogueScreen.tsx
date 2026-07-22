import React, { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen, Text, Chip, CareerCard, EmptyState } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { listCareers, type ResolvedCareer } from '../../simulation';
import { titleCase } from '../../utils/format';
import type { CareersStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<CareersStackParamList, 'Catalogue'>;

const ALL = '__all__';

export function CareerCatalogueScreen({ navigation }: Props) {
  const theme = useTheme();

  // The catalogue is entirely data-driven: careers and their categories come from the engine
  // registry. Adding a career JSON makes it appear here with zero screen changes.
  const careers = useMemo(() => listCareers(), []);
  const categories = useMemo(
    () => Array.from(new Set(careers.map((c) => c.overview.category))),
    [careers],
  );

  const [active, setActive] = useState<string>(ALL);
  const filtered = useMemo(
    () => (active === ALL ? careers : careers.filter((c) => c.overview.category === active)),
    [careers, active],
  );

  const renderHeader = () => (
    <View style={{ paddingTop: theme.spacing[4], gap: theme.spacing[3] }}>
      <View style={{ gap: theme.spacing[2] }}>
        <Text variant="label" color="caption">
          Career catalogue
        </Text>
        <Text variant="display">Choose a career</Text>
        <Text variant="body" color="secondary">
          Pick a role to experience. You’ll join a real company and do the actual work.
        </Text>
      </View>

      {categories.length > 1 && (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme.spacing[2],
            marginTop: theme.spacing[2],
          }}
        >
          <Chip label="All" selected={active === ALL} onPress={() => setActive(ALL)} />
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={titleCase(cat)}
              selected={active === cat}
              onPress={() => setActive(cat)}
            />
          ))}
        </View>
      )}
    </View>
  );

  return (
    <Screen>
      <FlatList
        data={filtered}
        keyExtractor={(item: ResolvedCareer) => item.overview.id}
        ListHeaderComponent={renderHeader}
        ListHeaderComponentStyle={{ marginBottom: theme.spacing[5] }}
        renderItem={({ item }) => (
          <CareerCard
            career={item}
            onPress={() => navigation.navigate('CareerDetail', { careerId: item.overview.id })}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing[3] }} />}
        ListEmptyComponent={
          <EmptyState
            title="No careers here yet"
            message="Try a different category — more careers are on the way."
          />
        }
        contentContainerStyle={{
          paddingBottom: theme.spacing[8],
          gap: 0,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}
