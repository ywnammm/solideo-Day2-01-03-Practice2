import React from 'react';
import {
  Heart,
  Utensils,
  DollarSign,
  Zap,
  Mountain,
  Camera,
  ShoppingBag,
  Music,
  Palette,
} from 'lucide-react';
import { useTravelStore } from '../store/useTravelStore';

interface PreferencesFormProps {
  onNext: () => void;
  onBack: () => void;
}

const INTEREST_OPTIONS = [
  { value: 'nature', label: '자연/풍경', icon: Mountain },
  { value: 'culture', label: '문화/역사', icon: Palette },
  { value: 'food', label: '맛집 탐방', icon: Utensils },
  { value: 'photo', label: '사진 명소', icon: Camera },
  { value: 'shopping', label: '쇼핑', icon: ShoppingBag },
  { value: 'nightlife', label: '나이트라이프', icon: Music },
];

const FOOD_OPTIONS = [
  { value: 'korean', label: '한식' },
  { value: 'western', label: '양식' },
  { value: 'japanese', label: '일식' },
  { value: 'chinese', label: '중식' },
  { value: 'cafe', label: '카페/디저트' },
  { value: 'street', label: '길거리 음식' },
];

const PreferencesForm: React.FC<PreferencesFormProps> = ({ onNext, onBack }) => {
  const { preferences, setPreferences } = useTravelStore();

  const toggleInterest = (interest: string) => {
    const interests = preferences.interests.includes(interest)
      ? preferences.interests.filter((i) => i !== interest)
      : [...preferences.interests, interest];
    setPreferences({ interests });
  };

  const toggleFood = (food: string) => {
    const foodPreferences = preferences.foodPreferences.includes(food)
      ? preferences.foodPreferences.filter((f) => f !== food)
      : [...preferences.foodPreferences, food];
    setPreferences({ foodPreferences });
  };

  const isFormValid =
    preferences.interests.length > 0 && preferences.foodPreferences.length > 0;

  return (
    <div className="card max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">
          2
        </div>
        <h2 className="text-3xl font-bold text-gray-800">취향 선택</h2>
      </div>

      <div className="space-y-8">
        {/* Interests */}
        <div>
          <label className="label">
            <Heart className="inline-block w-5 h-5 mr-2 text-red-500" />
            관심사 (최소 1개 선택)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {INTEREST_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleInterest(value)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center justify-center space-y-2 ${
                  preferences.interests.includes(value)
                    ? 'border-blue-600 bg-blue-50 shadow-md transform scale-105'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                <Icon
                  className={`w-8 h-8 ${
                    preferences.interests.includes(value)
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  }`}
                />
                <span
                  className={`font-semibold ${
                    preferences.interests.includes(value)
                      ? 'text-blue-600'
                      : 'text-gray-700'
                  }`}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Food Preferences */}
        <div>
          <label className="label">
            <Utensils className="inline-block w-5 h-5 mr-2 text-orange-500" />
            음식 취향 (최소 1개 선택)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {FOOD_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleFood(value)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 font-semibold ${
                  preferences.foodPreferences.includes(value)
                    ? 'border-orange-500 bg-orange-50 shadow-md transform scale-105 text-orange-600'
                    : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="label">
            <DollarSign className="inline-block w-5 h-5 mr-2 text-green-600" />
            예산
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['low', 'medium', 'high'] as const).map((budget) => (
              <button
                key={budget}
                type="button"
                onClick={() => setPreferences({ budget })}
                className={`p-4 rounded-lg border-2 transition-all duration-300 font-semibold ${
                  preferences.budget === budget
                    ? 'border-green-600 bg-green-50 shadow-md transform scale-105 text-green-600'
                    : 'border-gray-300 hover:border-green-400 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {budget === 'low' && '저렴하게'}
                {budget === 'medium' && '적당하게'}
                {budget === 'high' && '럭셔리하게'}
              </button>
            ))}
          </div>
        </div>

        {/* Pace */}
        <div>
          <label className="label">
            <Zap className="inline-block w-5 h-5 mr-2 text-yellow-500" />
            여행 스타일
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['relaxed', 'moderate', 'packed'] as const).map((pace) => (
              <button
                key={pace}
                type="button"
                onClick={() => setPreferences({ pace })}
                className={`p-4 rounded-lg border-2 transition-all duration-300 font-semibold ${
                  preferences.pace === pace
                    ? 'border-yellow-600 bg-yellow-50 shadow-md transform scale-105 text-yellow-700'
                    : 'border-gray-300 hover:border-yellow-400 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {pace === 'relaxed' && '느긋하게'}
                {pace === 'moderate' && '적당하게'}
                {pace === 'packed' && '알차게'}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-300"
          >
            이전
          </button>
          <button
            onClick={onNext}
            disabled={!isFormValid}
            className={`flex-1 btn-primary ${
              !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            여행 계획 생성
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesForm;
