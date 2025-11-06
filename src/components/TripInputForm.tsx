import React, { useState } from 'react';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { useTravelStore } from '../store/useTravelStore';

interface TripInputFormProps {
  onNext: () => void;
}

const TripInputForm: React.FC<TripInputFormProps> = ({ onNext }) => {
  const { tripInput, setTripInput } = useTravelStore();
  const [departureAddress, setDepartureAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Geocode addresses (in production, use Google Geocoding API)
    const departure = {
      address: departureAddress,
      lat: 37.5665, // Default to Seoul
      lng: 126.9780,
    };

    const destination = {
      address: destinationAddress,
      lat: 35.1796, // Default to Busan
      lng: 129.0756,
    };

    setTripInput({ departure, destination });
    onNext();
  };

  const isFormValid =
    departureAddress &&
    destinationAddress &&
    tripInput.departureTime &&
    tripInput.duration > 0;

  return (
    <div className="card max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">
          1
        </div>
        <h2 className="text-3xl font-bold text-gray-800">여행 정보 입력</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Departure Location */}
        <div className="animate-slide-up">
          <label className="label">
            <MapPin className="inline-block w-5 h-5 mr-2 text-blue-600" />
            출발 건물/위치
          </label>
          <input
            type="text"
            value={departureAddress}
            onChange={(e) => setDepartureAddress(e.target.value)}
            placeholder="예: 서울역, 서울시 중구 세종대로 18"
            className="input-field"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            정확한 주소 또는 건물명을 입력해주세요
          </p>
        </div>

        {/* Destination Location */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <label className="label">
            <MapPin className="inline-block w-5 h-5 mr-2 text-indigo-600" />
            도착 건물/위치
          </label>
          <input
            type="text"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
            placeholder="예: 해운대 해수욕장, 부산 해운대구"
            className="input-field"
            required
          />
        </div>

        {/* Departure Time */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <label className="label">
            <Clock className="inline-block w-5 h-5 mr-2 text-blue-600" />
            출발 시간
          </label>
          <input
            type="datetime-local"
            value={tripInput.departureTime}
            onChange={(e) => setTripInput({ departureTime: e.target.value })}
            className="input-field"
            required
          />
        </div>

        {/* Duration */}
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <label className="label">
            <Calendar className="inline-block w-5 h-5 mr-2 text-indigo-600" />
            여행 기간 (일)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="1"
              max="14"
              value={tripInput.duration}
              onChange={(e) =>
                setTripInput({ duration: parseInt(e.target.value) })
              }
              className="flex-1"
            />
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-bold text-lg min-w-[80px] text-center">
              {tripInput.duration}일
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>당일치기</span>
            <span>2주</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`btn-primary w-full ${
            !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          다음 단계로
        </button>
      </form>
    </div>
  );
};

export default TripInputForm;
