import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Train,
  Bus,
  Plane,
  Navigation,
  Utensils,
  Camera,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { DayItinerary, Transportation, Activity } from '../types';
import MapView from './MapView';

interface ItineraryViewProps {
  itinerary: DayItinerary[];
}

const TransportIcon = ({ type }: { type: Transportation['type'] }) => {
  const icons = {
    train: Train,
    bus: Bus,
    flight: Plane,
    subway: Train,
    walk: Navigation,
  };
  const Icon = icons[type] || Navigation;
  return <Icon className="w-5 h-5" />;
};

const ActivityCard: React.FC<{ activity: Activity; index: number }> = ({ activity, index }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
              {index + 1}
            </div>
            <h4 className="font-bold text-gray-800 text-lg">{activity.name}</h4>
          </div>
          <p className="text-gray-600 text-sm mb-3">{activity.description}</p>

          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1 text-blue-600" />
              {activity.location.address}
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-1 text-green-600" />
              {activity.duration}
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-1 text-yellow-600" />
              {activity.price === 0 ? '무료' : `₩${activity.price.toLocaleString()}`}
            </div>
            <div className="flex items-center text-yellow-500 font-semibold">
              <Star className="w-4 h-4 mr-1 fill-current" />
              {activity.rating}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {activity.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {activity.imageUrl && (
          <img
            src={activity.imageUrl}
            alt={activity.name}
            className="w-24 h-24 object-cover rounded-lg ml-4"
          />
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          {activity.type === 'restaurant' ? (
            <>
              <Utensils className="w-4 h-4 mr-1 text-orange-500" />
              <span>맛집</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 mr-1 text-purple-500" />
              <span>관광지</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const TransportationCard: React.FC<{ transport: Transportation }> = ({ transport }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border-2 border-indigo-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-600 text-white rounded-full p-3">
            <TransportIcon type={transport.type} />
          </div>
          <div>
            <div className="font-bold text-gray-800 mb-1">
              {transport.company} - {transport.type === 'train' ? 'KTX' : transport.type === 'subway' ? '지하철' : '버스'}
            </div>
            <div className="text-sm text-gray-600">
              {transport.from} → {transport.to}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">
            {transport.departureTime} - {transport.arrivalTime}
          </div>
          <div className="font-semibold text-indigo-600">
            {transport.duration} • ₩{transport.price.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

const DayCard: React.FC<{ dayItinerary: DayItinerary }> = ({ dayItinerary }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="card mb-6 overflow-hidden">
      {/* Day Header */}
      <div
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white text-blue-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
              {dayItinerary.day}
            </div>
            <div>
              <h3 className="text-2xl font-bold">Day {dayItinerary.day}</h3>
              <p className="text-blue-100">{dayItinerary.date}</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm text-blue-100">총 비용</div>
              <div className="text-xl font-bold">₩{dayItinerary.totalCost.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">이동 거리</div>
              <div className="text-xl font-bold">{dayItinerary.totalDistance}km</div>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-6 h-6" />
            ) : (
              <ChevronDown className="w-6 h-6" />
            )}
          </div>
        </div>
      </div>

      {/* Day Content */}
      {isExpanded && (
        <div className="p-6 animate-fade-in">
          {/* Map View */}
          <div className="mb-6">
            <MapView
              activities={dayItinerary.activities}
              transportation={dayItinerary.transportation}
            />
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {dayItinerary.transportation.map((transport, tIdx) => {
              const activity = dayItinerary.activities[tIdx];
              return (
                <div key={`timeline-${tIdx}`}>
                  <TransportationCard transport={transport} />
                  {activity && (
                    <div className="ml-8 mt-4">
                      <ActivityCard activity={activity} index={tIdx} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Remaining activities without transportation */}
            {dayItinerary.activities.slice(dayItinerary.transportation.length).map((activity, idx) => (
              <div key={`activity-${idx}`} className="ml-8">
                <ActivityCard
                  activity={activity}
                  index={dayItinerary.transportation.length + idx}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          <Calendar className="inline-block w-10 h-10 mr-3 text-blue-600" />
          여행 일정
        </h2>
        <p className="text-gray-600">
          {itinerary.length}일간의 완벽한 여행 계획이 준비되었습니다
        </p>
      </div>

      {itinerary.map((day) => (
        <DayCard key={day.day} dayItinerary={day} />
      ))}
    </div>
  );
};

export default ItineraryView;
