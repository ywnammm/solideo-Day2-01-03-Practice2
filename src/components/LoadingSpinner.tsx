import React from 'react';
import { Plane, MapPin, Sparkles } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Icons */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin className="w-16 h-16 text-blue-600 animate-pulse" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center animate-spin">
            <Plane className="w-12 h-12 text-indigo-600" style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute top-0 right-0">
            <Sparkles className="w-6 h-6 text-yellow-500 animate-bounce" />
          </div>
          <div className="absolute bottom-0 left-0">
            <Sparkles className="w-6 h-6 text-pink-500 animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          여행 계획 생성 중...
        </h2>

        {/* Progress Steps */}
        <div className="space-y-3 max-w-md mx-auto">
          {[
            { text: '최적의 경로를 찾고 있습니다', delay: '0s' },
            { text: '맛집과 관광지를 추천하고 있습니다', delay: '0.5s' },
            { text: '대중교통 연계를 확인하고 있습니다', delay: '1s' },
          ].map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-4 shadow-md animate-slide-up"
              style={{ animationDelay: step.delay }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <p className="text-gray-700">{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Spinner */}
        <div className="mt-8">
          <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
