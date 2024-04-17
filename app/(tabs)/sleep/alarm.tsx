import { SimpleLineIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Container } from '~/components/Container';
import theme from '~/constants/colors';
import { useSleepStore } from '~/stores/sleepStore';

export default function Alarm() {
  const { napDuration, breathingMethod, breathingLightDuration, wakeUpLightDuration } =
    useSleepStore();

  const sleepData = [
    {
      id: 0,
      slug: 'nap-duration',
      title: 'Nap Duration',
      value: napDuration,
      displayValue: `${napDuration} minute${Number(napDuration) > 1 ? 's' : ''}`,
    },
    {
      id: 1,
      slug: 'breathing-method',
      title: 'Breathing Method',
      value: breathingMethod,
      displayValue: breathingMethod,
    },
    {
      id: 2,
      slug: 'breathing-light-duration',
      title: 'Breathing Light Duration',
      value: breathingLightDuration,
      displayValue: `${breathingLightDuration} minute${Number(breathingLightDuration) > 1 ? 's' : ''}`,
    },
    {
      id: 3,
      slug: 'wake-up-light-duration',
      title: 'Wake Up Light Duration',
      value: wakeUpLightDuration,
      displayValue: `${wakeUpLightDuration} minute${Number(wakeUpLightDuration) > 1 ? 's' : ''}`,
    },
  ];

  return (
    <>
      <View style={styles.container}>
        <Container>
          <FlatList
            data={sleepData}
            contentContainerStyle={{ gap: 5 }}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Link href={`/(tabs)/sleep/${item.slug}`} asChild>
                <Pressable>
                  {({ pressed }) => (
                    <View style={[styles.itemContainer, pressed && styles.pressedContainer]}>
                      <Text style={[styles.itemText, pressed && styles.pressedText]}>
                        {item.title}
                      </Text>
                      <View style={styles.itemTextWithIcon}>
                        <Text style={[styles.itemText, pressed && styles.pressedText]}>
                          {item.displayValue.length > 15
                            ? `${item.displayValue.slice(0, 15)}...`
                            : item.displayValue}
                        </Text>
                        <SimpleLineIcons style={styles.icon} name="arrow-right" />
                      </View>
                    </View>
                  )}
                </Pressable>
              </Link>
            )}
          />
        </Container>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.colors.backgroundColor,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.cardColor,
    marginBottom: 2,
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 18,
  },
  pressedContainer: {
    backgroundColor: theme.colors.white,
  },
  pressedText: {
    color: theme.colors.black,
  },
  itemText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  text: {
    color: '#000',
  },
  itemTextWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  icon: {
    color: theme.colors.white,
  },
});
