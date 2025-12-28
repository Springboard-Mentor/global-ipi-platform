import React from 'react';
import { CheckCircle, Circle, FileText, Eye, Search, Shield, Award } from 'lucide-react';

const PatentProgressTracker = ({ filing }) => {
  // Define the 5 stages with their status
  const stages = [
    {
      id: 1,
      title: 'Patent Filed',
      description: 'Application submitted successfully',
      icon: FileText,
      completed: filing.stage1Filed || false,
      color: 'blue'
    },
    {
      id: 2,
      title: 'Admin Review',
      description: 'Initial review by administrator',
      icon: Eye,
      completed: filing.stage2AdminReview || false,
      color: 'purple'
    },
    {
      id: 3,
      title: 'Technical Review',
      description: 'Technical evaluation completed',
      icon: Search,
      completed: filing.stage3TechnicalReview || false,
      color: 'indigo'
    },
    {
      id: 4,
      title: 'Final Verification',
      description: 'Final verification and checks',
      icon: Shield,
      completed: filing.stage4Verification || false,
      color: 'green'
    },
    {
      id: 5,
      title: 'Patent Granted',
      description: 'Patent approved and published',
      icon: Award,
      completed: filing.stage5Granted || false,
      color: 'amber'
    }
  ];

  // Calculate current stage
  const currentStage = stages.findIndex(stage => !stage.completed);
  const allCompleted = stages.every(stage => stage.completed);
  const completedCount = stages.filter(stage => stage.completed).length;

  // Color mapping for different stages
  const getColorClasses = (color, isActive = false, isCompleted = false) => {
    if (isCompleted) {
      return {
        bg: 'bg-green-100',
        border: 'border-green-500',
        text: 'text-green-700',
        icon: 'text-green-600'
      };
    }
    if (isActive) {
      const colors = {
        blue: { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-700', icon: 'text-blue-600' },
        purple: { bg: 'bg-purple-100', border: 'border-purple-500', text: 'text-purple-700', icon: 'text-purple-600' },
        indigo: { bg: 'bg-indigo-100', border: 'border-indigo-500', text: 'text-indigo-700', icon: 'text-indigo-600' },
        green: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700', icon: 'text-green-600' },
        amber: { bg: 'bg-amber-100', border: 'border-amber-500', text: 'text-amber-700', icon: 'text-amber-600' }
      };
      return colors[color] || colors.blue;
    }
    return {
      bg: 'bg-gray-100',
      border: 'border-gray-300',
      text: 'text-gray-500',
      icon: 'text-gray-400'
    };
  };

  return (
    <div className="w-full">
      {/* Success Banner - Shows only when all stages are complete */}
      {allCompleted && (
        <div className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg animate-pulse">
          <div className="flex items-center gap-4">
            <Award size={48} className="text-yellow-300" />
            <div>
              <h3 className="text-2xl font-bold mb-1">🎉 Patent Successfully Granted!</h3>
              <p className="text-green-50 text-lg">
                Congratulations! Your patent has been approved and published.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Progress: {completedCount}/{stages.length} Stages Completed
          </span>
          <span className="text-sm font-bold text-blue-600">
            {Math.round((completedCount / stages.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              allCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'
            }`}
            style={{ width: `${(completedCount / stages.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Stages Display - Desktop */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-12 left-0 right-0 h-1 bg-gray-200" style={{ zIndex: 0 }} />
          <div 
            className={`absolute top-12 left-0 h-1 transition-all duration-500 ${
              allCompleted ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ 
              width: `${(completedCount / stages.length) * 100}%`,
              zIndex: 1 
            }}
          />

          <div className="relative flex justify-between" style={{ zIndex: 2 }}>
            {stages.map((stage, index) => {
              const isActive = index === currentStage;
              const isCompleted = stage.completed;
              const colors = getColorClasses(stage.color, isActive, isCompleted);
              const Icon = stage.icon;

              return (
                <div key={stage.id} className="flex flex-col items-center" style={{ width: '20%' }}>
                  {/* Stage Circle */}
                  <div className={`
                    w-24 h-24 rounded-full border-4 ${colors.border} ${colors.bg}
                    flex items-center justify-center mb-3 relative
                    transition-all duration-300
                    ${isActive ? 'animate-bounce' : ''}
                    ${isCompleted ? 'scale-110' : ''}
                  `}>
                    {isCompleted ? (
                      <CheckCircle size={40} className={colors.icon} strokeWidth={2.5} />
                    ) : (
                      <Icon size={40} className={colors.icon} />
                    )}
                    
                    {/* Stage Number Badge */}
                    <div className={`
                      absolute -top-2 -right-2 w-8 h-8 rounded-full 
                      ${isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-400'}
                      text-white flex items-center justify-center text-sm font-bold
                      shadow-lg
                    `}>
                      {stage.id}
                    </div>
                  </div>

                  {/* Stage Info */}
                  <div className="text-center px-2">
                    <h4 className={`font-bold text-sm mb-1 ${colors.text}`}>
                      {stage.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {stage.description}
                    </p>
                    {isCompleted && (
                      <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        ✓ Complete
                      </span>
                    )}
                    {isActive && !isCompleted && (
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full animate-pulse">
                        ⏳ In Progress
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stages Display - Mobile */}
      <div className="md:hidden space-y-4">
        {stages.map((stage, index) => {
          const isActive = index === currentStage;
          const isCompleted = stage.completed;
          const colors = getColorClasses(stage.color, isActive, isCompleted);
          const Icon = stage.icon;

          return (
            <div key={stage.id} className="flex items-start gap-4">
              {/* Stage Circle */}
              <div className={`
                w-16 h-16 rounded-full border-4 ${colors.border} ${colors.bg}
                flex items-center justify-center flex-shrink-0 relative
                ${isActive ? 'animate-pulse' : ''}
              `}>
                {isCompleted ? (
                  <CheckCircle size={28} className={colors.icon} strokeWidth={2.5} />
                ) : (
                  <Icon size={28} className={colors.icon} />
                )}
                <div className={`
                  absolute -top-2 -right-2 w-6 h-6 rounded-full 
                  ${isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-400'}
                  text-white flex items-center justify-center text-xs font-bold
                `}>
                  {stage.id}
                </div>
              </div>

              {/* Stage Info */}
              <div className="flex-1 pt-1">
                <h4 className={`font-bold text-base mb-1 ${colors.text}`}>
                  {stage.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {stage.description}
                </p>
                {isCompleted && (
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    ✓ Complete
                  </span>
                )}
                {isActive && !isCompleted && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full animate-pulse">
                    ⏳ In Progress
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Message */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700 text-center">
          {allCompleted ? (
            <span className="font-bold text-green-700">
              ✅ Your patent application has been successfully processed and granted!
            </span>
          ) : currentStage >= 0 ? (
            <span>
              <span className="font-bold text-blue-700">Current Status:</span> Your patent is currently in{' '}
              <span className="font-bold">{stages[currentStage]?.title}</span> stage.
              {currentStage < 4 && ' Next: ' + stages[currentStage + 1]?.title}
            </span>
          ) : (
            <span className="font-bold text-gray-700">Processing your patent application...</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default PatentProgressTracker;
