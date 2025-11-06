import { Plane, Sparkles } from 'lucide-react';
import { useTravelStore } from './store/useTravelStore';
import { generateTravelPlan } from './services/travelPlanService';
import TripInputForm from './components/TripInputForm';
import PreferencesForm from './components/PreferencesForm';
import TravelPlanResult from './components/TravelPlanResult';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const {
    currentStep,
    setCurrentStep,
    tripInput,
    preferences,
    travelPlan,
    setTravelPlan,
    isLoading,
    setIsLoading,
    resetAll,
  } = useTravelStore();

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    try {
      const plan = await generateTravelPlan(tripInput, preferences);
      setTravelPlan(plan);
      setCurrentStep(2);
    } catch (error) {
      console.error('Failed to generate travel plan:', error);
      alert('여행 계획 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    resetAll();
  };

  return (
    <div className="min-h-screen py-12 px-4">
      {isLoading && <LoadingSpinner />}

      {/* Header */}
      <header className="text-center mb-12 animate-fade-in">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-4 shadow-lg">
            <Plane className="w-12 h-12" />
          </div>
          <Sparkles className="w-8 h-8 text-yellow-500 ml-2 animate-bounce" />
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          AI 여행 플래너
        </h1>
        <p className="text-xl text-gray-600">
          당신만의 완벽한 여행을 설계해드립니다
        </p>
        <div className="flex justify-center space-x-2 mt-4">
          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            실시간 경로
          </span>
          <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
            맞춤 추천
          </span>
          <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
            대중교통 연계
          </span>
        </div>
      </header>

      {/* Progress Steps */}
      {currentStep < 2 && (
        <div className="flex justify-center items-center mb-12 max-w-2xl mx-auto">
          <div className="flex items-center space-x-4 w-full">
            {/* Step 1 */}
            <div className="flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentStep >= 0
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  1
                </div>
                <p className="text-sm font-semibold text-gray-700 mt-2">
                  여행 정보
                </p>
              </div>
            </div>

            {/* Line */}
            <div
              className={`flex-1 h-1 transition-all duration-300 ${
                currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            ></div>

            {/* Step 2 */}
            <div className="flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentStep >= 1
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  2
                </div>
                <p className="text-sm font-semibold text-gray-700 mt-2">
                  취향 선택
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main>
        {currentStep === 0 && (
          <TripInputForm onNext={() => setCurrentStep(1)} />
        )}

        {currentStep === 1 && (
          <PreferencesForm
            onNext={handleGeneratePlan}
            onBack={() => setCurrentStep(0)}
          />
        )}

        {currentStep === 2 && travelPlan && (
          <TravelPlanResult travelPlan={travelPlan} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center mt-16 text-gray-600 text-sm">
        <p>© 2025 AI Travel Planner. 완벽한 여행의 시작.</p>
        <p className="mt-2">
          실시간 대중교통 정보 • Google Maps 연동 • AI 맞춤 추천
        </p>
      </footer>
    </div>
  );
}

export default App;
