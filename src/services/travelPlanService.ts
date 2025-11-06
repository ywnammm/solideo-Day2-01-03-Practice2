import type { TripInput, Preferences, TravelPlan, Transportation, Activity, DayItinerary } from '../types';
import { addDays, format } from 'date-fns';

// Demo data generator - in production, this would call real APIs
export const generateTravelPlan = async (
  tripInput: TripInput,
  preferences: Preferences
): Promise<TravelPlan> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const { departure, destination, departureTime, duration } = tripInput;

  if (!departure || !destination) {
    throw new Error('Invalid trip input');
  }

  // Generate sample transportation options
  const mainTransportation: Transportation[] = [
    {
      type: 'train',
      from: departure.address,
      to: destination.address,
      departureTime: departureTime,
      arrivalTime: format(
        new Date(new Date(departureTime).getTime() + 2.5 * 60 * 60 * 1000),
        "yyyy-MM-dd'T'HH:mm"
      ),
      duration: '2시간 30분',
      price: 59800,
      company: 'KTX',
      route: [
        { lat: departure.lat, lng: departure.lng },
        { lat: (departure.lat + destination.lat) / 2, lng: (departure.lng + destination.lng) / 2 },
        { lat: destination.lat, lng: destination.lng },
      ],
    },
  ];

  // Sample activities based on preferences
  const sampleAttractions: Activity[] = [
    {
      id: 'attr-1',
      name: '해운대 해수욕장',
      type: 'attraction',
      description: '한국에서 가장 유명한 해수욕장. 아름다운 백사장과 푸른 바다',
      location: { address: '부산 해운대구', lat: 35.1586, lng: 129.1603 },
      duration: '2시간',
      price: 0,
      rating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
      tags: ['nature', 'photo'],
    },
    {
      id: 'attr-2',
      name: '감천문화마을',
      type: 'attraction',
      description: '형형색색의 벽화로 유명한 예술 마을',
      location: { address: '부산 사하구', lat: 35.0975, lng: 129.0104 },
      duration: '3시간',
      price: 0,
      rating: 4.5,
      imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400',
      tags: ['culture', 'photo'],
    },
    {
      id: 'attr-3',
      name: '광안리 해변',
      type: 'attraction',
      description: '광안대교 야경이 아름다운 해변',
      location: { address: '부산 수영구', lat: 35.1530, lng: 129.1189 },
      duration: '2시간',
      price: 0,
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1566404791232-af9fe0ae8f8b?w=400',
      tags: ['nature', 'nightlife'],
    },
    {
      id: 'attr-4',
      name: '자갈치 시장',
      type: 'attraction',
      description: '한국 최대 수산물 시장',
      location: { address: '부산 중구', lat: 35.0966, lng: 129.0306 },
      duration: '2시간',
      price: 0,
      rating: 4.4,
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
      tags: ['culture', 'food'],
    },
  ];

  const sampleRestaurants: Activity[] = [
    {
      id: 'rest-1',
      name: '밀면 전문점',
      type: 'restaurant',
      description: '부산의 대표 음식 밀면 맛집',
      location: { address: '부산 동구', lat: 35.1475, lng: 129.0583 },
      duration: '1시간',
      price: 9000,
      rating: 4.5,
      tags: ['korean', 'food'],
    },
    {
      id: 'rest-2',
      name: '해운대 횟집',
      type: 'restaurant',
      description: '신선한 해산물 전문점',
      location: { address: '부산 해운대구', lat: 35.1595, lng: 129.1625 },
      duration: '1.5시간',
      price: 45000,
      rating: 4.6,
      tags: ['korean', 'food'],
    },
    {
      id: 'rest-3',
      name: '카페 오션뷰',
      type: 'restaurant',
      description: '바다가 보이는 프리미엄 카페',
      location: { address: '부산 해운대구', lat: 35.1560, lng: 129.1600 },
      duration: '1시간',
      price: 7000,
      rating: 4.8,
      tags: ['cafe'],
    },
    {
      id: 'rest-4',
      name: '씨앗호떡',
      type: 'restaurant',
      description: '부산 명물 씨앗호떡',
      location: { address: '부산 중구', lat: 35.0970, lng: 129.0312 },
      duration: '30분',
      price: 2000,
      rating: 4.7,
      tags: ['street', 'food'],
    },
  ];

  // Filter activities based on preferences
  const filteredActivities = [
    ...sampleAttractions.filter((a) =>
      a.tags.some((tag) => preferences.interests.includes(tag))
    ),
    ...sampleRestaurants.filter((r) =>
      r.tags.some((tag) => preferences.foodPreferences.includes(tag))
    ),
  ];

  // Generate itinerary for each day
  const itinerary: DayItinerary[] = [];
  const startDate = new Date(departureTime);

  for (let day = 1; day <= duration; day++) {
    const dayDate = addDays(startDate, day - 1);
    const activitiesPerDay = preferences.pace === 'packed' ? 5 : preferences.pace === 'moderate' ? 4 : 3;

    // Select activities for this day
    const dayActivities = filteredActivities
      .slice((day - 1) * activitiesPerDay, day * activitiesPerDay)
      .map((activity, index) => ({
        ...activity,
        id: `${activity.id}-day${day}-${index}`,
      }));

    // Generate local transportation between activities
    const dayTransportation: Transportation[] = dayActivities.map((activity, index) => {
      if (index === 0 && day === 1) {
        return mainTransportation[0];
      }

      const prevLocation = index === 0
        ? destination
        : dayActivities[index - 1].location;

      return {
        type: Math.random() > 0.5 ? 'subway' : 'bus',
        from: prevLocation.address,
        to: activity.location.address,
        departureTime: format(
          new Date(dayDate.getTime() + (9 + index * 2) * 60 * 60 * 1000),
          "HH:mm"
        ),
        arrivalTime: format(
          new Date(dayDate.getTime() + (9.5 + index * 2) * 60 * 60 * 1000),
          "HH:mm"
        ),
        duration: '30분',
        price: 1400,
        company: Math.random() > 0.5 ? '부산지하철' : '부산버스',
      };
    });

    itinerary.push({
      day,
      date: format(dayDate, 'yyyy-MM-dd'),
      transportation: day === 1 ? [mainTransportation[0], ...dayTransportation.slice(1)] : dayTransportation,
      activities: dayActivities,
      totalDistance: 45.5,
      totalCost: dayTransportation.reduce((sum, t) => sum + t.price, 0) +
        dayActivities.reduce((sum, a) => sum + a.price, 0),
    });
  }

  // Calculate overview
  const totalCost = itinerary.reduce((sum, day) => sum + day.totalCost, 0);
  const totalDistance = itinerary.reduce((sum, day) => sum + day.totalDistance, 0);

  return {
    overview: {
      totalDays: duration,
      totalCost,
      totalDistance,
    },
    itinerary,
  };
};
