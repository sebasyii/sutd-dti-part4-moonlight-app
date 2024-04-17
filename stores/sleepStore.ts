import { create } from 'zustand';

type SleepState = {
  napDuration: string;
  breathingMethod: string;
  breathingLightDuration: string;
  wakeUpLightDuration: string;
  setNapDuration: (duration: string) => void;
  setBreathingMethod: (method: string) => void;
  setBreathingLightDuration: (time: string) => void;
  setWakeUpLightDuration: (duration: string) => void;
};

export const useSleepStore = create<SleepState>((set) => ({
  napDuration: '15',
  breathingMethod: '4-7-8',
  breathingLightDuration: '5',
  wakeUpLightDuration: '1',
  setNapDuration: (duration) => set({ napDuration: duration }),
  setBreathingMethod: (method) => set({ breathingMethod: method }),
  setBreathingLightDuration: (time) => set({ breathingLightDuration: time }),
  setWakeUpLightDuration: (duration) => set({ wakeUpLightDuration: duration }),
}));
