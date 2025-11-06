import React from 'react';
import {
  DollarSign,
  MapPin,
  Calendar,
  Download,
  Share2,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';
import type { TravelPlan } from '../types';
import ItineraryView from './ItineraryView';

interface TravelPlanResultProps {
  travelPlan: TravelPlan;
  onReset: () => void;
}

const TravelPlanResult: React.FC<TravelPlanResultProps> = ({
  travelPlan,
  onReset,
}) => {
  const handleDownload = () => {
    // Convert to JSON and trigger download
    const dataStr = JSON.stringify(travelPlan, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'travel-plan.json';
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '내 여행 계획',
          text: `${travelPlan.overview.totalDays}일 여행 계획이 완성되었습니다!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      alert('공유 기능은 지원되지 않는 브라우저입니다.');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg p-8 mb-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CheckCircle className="w-16 h-16" />
            <div>
              <h2 className="text-3xl font-bold mb-2">
                여행 계획이 완성되었습니다!
              </h2>
              <p className="text-green-100 text-lg">
                완벽한 {travelPlan.overview.totalDays}일 여행을 즐기세요
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">총 여행 기간</p>
              <p className="text-3xl font-bold">
                {travelPlan.overview.totalDays}일
              </p>
            </div>
            <Calendar className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">예상 총 비용</p>
              <p className="text-3xl font-bold">
                ₩{travelPlan.overview.totalCost.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">총 이동 거리</p>
              <p className="text-3xl font-bold">
                {travelPlan.overview.totalDistance}km
              </p>
            </div>
            <MapPin className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 border-2 border-blue-600"
        >
          <Download className="w-5 h-5" />
          <span>일정 다운로드</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center space-x-2 px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 border-2 border-indigo-600"
        >
          <Share2 className="w-5 h-5" />
          <span>공유하기</span>
        </button>

        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-600 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 border-2 border-gray-300"
        >
          <RefreshCw className="w-5 h-5" />
          <span>새로운 계획</span>
        </button>
      </div>

      {/* Itinerary */}
      <ItineraryView itinerary={travelPlan.itinerary} />
    </div>
  );
};

export default TravelPlanResult;
