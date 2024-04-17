import { LinearGradient } from 'expo-linear-gradient';
import { Link, Stack } from 'expo-router';
import { View, Pressable, Text, FlatList, StyleSheet } from 'react-native';

import { Container } from '~/components/Container';
import theme from '~/constants/colors';
import { useSleepStore } from '~/stores/sleepStore';

type PresetType = {
  id: string;
  title: string;
  napDuration: string;
  breathingMethod: string;
  breathingLightDuration: string;
  wakeUpLightDuration: string;
};

const presets: PresetType[] = [
  {
    id: '1',
    title: 'Quick Refresh',
    napDuration: '15',
    breathingMethod: 'Box Breathing',
    breathingLightDuration: '5',
    wakeUpLightDuration: '1',
  },
  {
    id: '2',
    title: 'Short Nap',
    napDuration: '20',
    breathingMethod: '4-7-8',
    breathingLightDuration: '5',
    wakeUpLightDuration: '1',
  },
  {
    id: '3',
    title: 'Standard Nap',
    napDuration: '30',
    breathingMethod: 'Box Breathing',
    breathingLightDuration: '10',
    wakeUpLightDuration: '2',
  },
  {
    id: '4',
    title: 'Presentation',
    napDuration: '3',
    breathingMethod: 'Box Breathing',
    breathingLightDuration: '1',
    wakeUpLightDuration: '1',
  },
];

export default function Home() {
  const { setNapDuration, setBreathingMethod, setBreathingLightDuration, setWakeUpLightDuration } =
    useSleepStore();

  const applyPreset = (preset: PresetType) => {
    setNapDuration(preset.napDuration);
    setBreathingMethod(preset.breathingMethod);
    setBreathingLightDuration(preset.breathingLightDuration);
    setWakeUpLightDuration(preset.wakeUpLightDuration);
  };

  return (
    <>
      <View style={styles.container}>
        <Container>
          <View>
            <Text style={styles.title}>👋 Hello!</Text>
          </View>
          <View>
            <Text style={styles.subtitle}>💤 Here are some presets</Text>
            <FlatList
              data={presets}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <Link href="/(tabs)/sleep/alarm" asChild>
                  <Pressable onPress={() => applyPreset(item)}>
                    {({ pressed }) => (
                      <View style={[styles.presetItem, pressed && styles.pressedDetailsContainer]}>
                        <Text style={[styles.presetTitle, pressed && styles.pressedTitle]}>
                          {item.title}
                        </Text>
                        <View style={[styles.presetDetailsContainer]}>
                          <Text style={styles.presetDetail}>{item.napDuration} minutes</Text>
                          <Text style={styles.presetDetail}>{item.breathingMethod}</Text>
                        </View>
                      </View>
                    )}
                  </Pressable>
                </Link>
              )}
              contentContainerStyle={styles.presetsList}
            />
          </View>

          <View style={styles.customPowerNapContainer}>
            <Text style={styles.subtitle}>Start your own custom power nap</Text>
            <Link href="/(tabs)/sleep/alarm" asChild>
              <Pressable>
                <LinearGradient
                  // Button Linear Gradient
                  start={{ x: 0.1, y: 0.9 }}
                  end={{ x: 0.9, y: 0.1 }}
                  colors={['#0575FF', '#FF64AE']}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Start Power Nap</Text>
                </LinearGradient>
              </Pressable>
            </Link>
          </View>
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginVertical: 30,
  },
  subtitle: {
    color: theme.colors.white,
    fontWeight: '500',
    fontSize: 18,
  },
  button: {
    alignItems: 'center',
    borderRadius: 12,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  customPowerNapContainer: {
    marginVertical: 50,
    gap: 15,
  },

  presetsList: {
    marginTop: 20,
    gap: 10,
  },
  presetItem: {
    backgroundColor: theme.colors.cardColor,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  presetTitle: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  presetDetail: {
    color: '#686a73',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
  },
  presetDetailsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  pressedTitle: {
    color: theme.colors.black,
  },
  pressedDetailsContainer: {
    backgroundColor: theme.colors.white,
    // borderRadius: 12,
    // padding: 10,
  },
});
