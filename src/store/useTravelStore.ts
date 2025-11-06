import { create } from 'zustand';
import type { TripInput, Preferences, TravelPlan } from '../types';

interface TravelState {
  tripInput: TripInput;
  preferences: Preferences;
  travelPlan: TravelPlan | null;
  currentStep: number;
  isLoading: boolean;

  setTripInput: (input: Partial<TripInput>) => void;
  setPreferences: (prefs: Partial<Preferences>) => void;
  setTravelPlan: (plan: TravelPlan | null) => void;
  setCurrentStep: (step: number) => void;
  setIsLoading: (loading: boolean) => void;
  resetAll: () => void;
}

const initialTripInput: TripInput = {
  departure: null,
  destination: null,
  departureTime: '',
  duration: 1,
};

const initialPreferences: Preferences = {
  interests: [],
  foodPreferences: [],
  budget: 'medium',
  pace: 'moderate',
};

export const useTravelStore = create<TravelState>((set) => ({
  tripInput: initialTripInput,
  preferences: initialPreferences,
  travelPlan: null,
  currentStep: 0,
  isLoading: false,

  setTripInput: (input) =>
    set((state) => ({
      tripInput: { ...state.tripInput, ...input },
    })),

  setPreferences: (prefs) =>
    set((state) => ({
      preferences: { ...state.preferences, ...prefs },
    })),

  setTravelPlan: (plan) => set({ travelPlan: plan }),

  setCurrentStep: (step) => set({ currentStep: step }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  resetAll: () =>
    set({
      tripInput: initialTripInput,
      preferences: initialPreferences,
      travelPlan: null,
      currentStep: 0,
      isLoading: false,
    }),
}));
