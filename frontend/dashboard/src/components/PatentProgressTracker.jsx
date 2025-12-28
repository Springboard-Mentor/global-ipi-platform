import React, { useEffect, useState } from 'react';
import { CheckCircle, Circle, FileText, Eye, Search, Shield, Award } from 'lucide-react';

const PatentProgressTracker = ({ filing }) => {
  const [showNotification, setShowNotification] = useState(false);
  
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

  // Show notification when patent is granted
  useEffect(() => {
    if (allCompleted && !showNotification) {
      setShowNotification(true);
      // Browser notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎉 Patent Granted!', {
          body: 'Congratulations! Your patent has been successfully granted.',
          icon: '/patent-icon.png'
        });
      }
      // Auto-hide after 2 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [allCompleted]);

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
      {/* Toast Notification */}
      {showNotification && allCompleted && (
        <div className="fixed top-4 right-4 z-50 animate-[slideIn_0.5s_ease-out]">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-4 shadow-2xl flex items-center gap-3 max-w-md">
            <Award size={32} className="text-yellow-300 animate-bounce" />
            <div>
              <p className="font-bold text-lg">Patent Granted!</p>
              <p className="text-sm text-green-50">Your patent has been officially approved</p>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      {/* Success Banner with Confetti - Shows only when all stages are complete */}
      {allCompleted && (
        <div className="relative mb-6 overflow-hidden">
          {/* Confetti Animation */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute top-0 left-[10%] w-3 h-3 bg-yellow-400 rounded-full animate-[fall_3s_linear_infinite]" style={{animationDelay: '0s'}} />
            <div className="absolute top-0 left-[25%] w-2 h-2 bg-red-500 rounded-full animate-[fall_2.5s_linear_infinite]" style={{animationDelay: '0.5s'}} />
            <div className="absolute top-0 left-[40%] w-3 h-3 bg-blue-500 rounded-full animate-[fall_3.5s_linear_infinite]" style={{animationDelay: '0.2s'}} />
            <div className="absolute top-0 left-[55%] w-2 h-2 bg-green-500 rounded-full animate-[fall_2.8s_linear_infinite]" style={{animationDelay: '0.8s'}} />
            <div className="absolute top-0 left-[70%] w-3 h-3 bg-purple-500 rounded-full animate-[fall_3.2s_linear_infinite]" style={{animationDelay: '0.3s'}} />
            <div className="absolute top-0 left-[85%] w-2 h-2 bg-pink-500 rounded-full animate-[fall_2.7s_linear_infinite]" style={{animationDelay: '0.6s'}} />
            <div className="absolute top-0 left-[15%] w-2 h-2 bg-orange-500 rounded-full animate-[fall_3.3s_linear_infinite]" style={{animationDelay: '1s'}} />
            <div className="absolute top-0 left-[60%] w-3 h-3 bg-cyan-500 rounded-full animate-[fall_2.9s_linear_infinite]" style={{animationDelay: '0.4s'}} />
          </div>
          
          <div className="relative bg-gradient-to-r from-green-500 via-emerald-600 to-green-500 text-white rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-6">
              <div className="animate-bounce">
                <Award size={64} className="text-yellow-300 drop-shadow-lg" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-2 animate-pulse">🎉 Patent Successfully Granted! 🎉</h3>
                <p className="text-green-50 text-xl">
                  Congratulations! Your patent has been officially approved and published.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar with Running Character */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Progress: {completedCount}/{stages.length} Stages Completed
          </span>
          <span className="text-sm font-bold text-blue-600">
            {Math.round((completedCount / stages.length) * 100)}%
          </span>
        </div>
        <div className="relative w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full h-6 overflow-visible shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              allCompleted ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-green-600' : 'bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600'
            } shadow-lg`}
            style={{ width: `${(completedCount / stages.length) * 100}%` }}
          />
          
          {/* Running Motu Character */}
          <div 
            className="absolute -translate-y-1/2"
            style={{ 
              left: `${Math.max(2, Math.min(98, (completedCount / stages.length) * 100 - 2))}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              transition: 'left 0.5s ease-out'
            }}
          >
            {allCompleted ? (
              <div 
                className="text-4xl filter drop-shadow-lg"
                style={{
                  animation: 'celebrate 1s ease-in-out forwards'
                }}
              >
                🏆
              </div>
            ) : (
              <div className="relative">
                <div 
                  className="text-3xl filter drop-shadow-lg"
                  style={{
                    animation: 'runAnimation 0.4s ease-in-out infinite',
                    transform: 'scaleX(-1)'
                  }}
                >
                  🏃
                </div>
                {/* Speed lines */}
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex gap-1 opacity-60">
                  <div className="w-2 h-0.5 bg-blue-500 animate-pulse" />
                  <div className="w-3 h-0.5 bg-purple-500 animate-pulse" style={{animationDelay: '0.1s'}} />
                  <div className="w-2 h-0.5 bg-blue-500 animate-pulse" style={{animationDelay: '0.2s'}} />
                </div>
              </div>
            )}
          </div>
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

          {/* Running Man on Stages Timeline */}
          {!allCompleted && (
            <div 
              className="absolute top-12 -translate-y-1/2"
              style={{ 
                left: `${(completedCount / stages.length) * 100}%`,
                zIndex: 3,
                transition: 'left 0.8s ease-out'
              }}
            >
              <div className="relative -translate-x-1/2">
                <div 
                  className="text-4xl filter drop-shadow-lg"
                  style={{
                    animation: 'runAnimation 0.4s ease-in-out infinite',
                    transform: 'scaleX(-1)'
                  }}
                >
                  🏃
                </div>
                {/* Speed lines */}
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex gap-1 opacity-70">
                  <div className="w-3 h-0.5 bg-blue-500 animate-pulse" />
                  <div className="w-4 h-0.5 bg-purple-500 animate-pulse" style={{animationDelay: '0.1s'}} />
                  <div className="w-3 h-0.5 bg-blue-500 animate-pulse" style={{animationDelay: '0.2s'}} />
                </div>
              </div>
            </div>
          )}

          {/* Trophy when completed */}
          {allCompleted && (
            <div 
              className="absolute top-12 -translate-y-1/2"
              style={{ 
                left: '100%',
                zIndex: 3
              }}
            >
              <div className="relative -translate-x-1/2">
                <div 
                  className="text-5xl filter drop-shadow-lg"
                  style={{
                    animation: 'celebrate 1s ease-in-out forwards'
                  }}
                >
                  🏆
                </div>
              </div>
            </div>
          )}

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
      
      {/* Joyful Congratulations Message - Shows only when granted */}
      {allCompleted && (
        <div className="mt-8 relative overflow-hidden rounded-2xl">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-[gradient_3s_ease_infinite]" />
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 animate-[gradient_3s_ease_infinite] opacity-50" style={{animationDelay: '1.5s'}} />
          
          <div className="relative bg-gradient-to-br from-yellow-50/95 via-orange-50/95 to-pink-50/95 backdrop-blur-sm p-8 text-center">
            {/* Sparkles */}
            <div className="absolute top-4 left-4 text-2xl animate-[spin_3s_linear_infinite]">✨</div>
            <div className="absolute top-4 right-4 text-2xl animate-[spin_3s_linear_infinite]" style={{animationDelay: '1s'}}>✨</div>
            <div className="absolute bottom-4 left-8 text-3xl animate-bounce">🎊</div>
            <div className="absolute bottom-4 right-8 text-3xl animate-bounce" style={{animationDelay: '0.5s'}}>🎊</div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent animate-pulse">
              🎉 CONGRATULATIONS! 🎉
            </h2>
            
            <div className="space-y-3">
              <p className="text-2xl md:text-3xl font-bold text-gray-800">
                Your Patent Has Been <span className="text-green-600">GRANTED</span>! 🏆
              </p>
              
              <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
                <span className="font-semibold text-purple-600">Amazing achievement!</span> Your innovation is now officially protected and recognized.
              </p>
              
              <div className="flex items-center justify-center gap-4 mt-6 text-4xl">
                <span className="animate-bounce">🎯</span>
                <span className="animate-bounce" style={{animationDelay: '0.1s'}}>🌟</span>
                <span className="animate-bounce" style={{animationDelay: '0.2s'}}>🚀</span>
                <span className="animate-bounce" style={{animationDelay: '0.3s'}}>💡</span>
                <span className="animate-bounce" style={{animationDelay: '0.4s'}}>🏅</span>
              </div>
              
              <div className="mt-6 p-4 bg-white/80 backdrop-blur rounded-xl shadow-lg inline-block">
                <p className="text-sm md:text-base text-gray-600">
                  Your hard work and dedication have paid off. This patent represents your innovative spirit and contribution to the world of technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Action Buttons - Download, Share, Showcase */}
      <div className="mt-8 pt-6 border-t-2 border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {/* Download PDF Button */}
          <button
            onClick={() => {
              // Handle PDF download logic here
              console.log('Downloading patent as PDF...');
              alert('PDF download functionality will be implemented');
            }}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-lg">Download PDF</span>
          </button>

          {/* Share on WhatsApp Button */}
          <button
            onClick={() => {
              const message = `🎉 Great news! My patent "${filing.inventionTitle || 'Patent Application'}" has been filed and is in progress. Check out the status!`;
              const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
            }}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="text-lg">Share on WhatsApp</span>
          </button>

          {/* Showcase on LinkedIn Button */}
          <button
            onClick={() => {
              const linkedInText = `I'm excited to share that my patent "${filing.inventionTitle || 'Patent Application'}" has been filed! ${allCompleted ? '🏆 It has been officially granted!' : '📋 Currently in progress.'} #Patent #Innovation #IntellectualProperty`;
              const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(linkedInText)}`;
              window.open(linkedInUrl, '_blank');
            }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span className="text-lg">Showcase on LinkedIn</span>
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fall {
          0% { 
            transform: translateY(-20px) rotate(0deg); 
            opacity: 1; 
          }
          100% { 
            transform: translateY(400px) rotate(360deg); 
            opacity: 0; 
          }
        }
        @keyframes slideIn {
          from { 
            transform: translateX(400px); 
            opacity: 0; 
          }
          to { 
            transform: translateX(0); 
            opacity: 1; 
          }
        }
        @keyframes runAnimation {
          0% { 
            transform: translateY(0px) scaleY(1) scaleX(-1); 
          }
          12.5% { 
            transform: translateY(-2px) scaleY(0.98) scaleX(-1); 
          }
          25% { 
            transform: translateY(-4px) scaleY(0.96) scaleX(-1); 
          }
          37.5% { 
            transform: translateY(-2px) scaleY(0.98) scaleX(-1); 
          }
          50% { 
            transform: translateY(0px) scaleY(1) scaleX(-1); 
          }
          62.5% { 
            transform: translateY(-2px) scaleY(0.98) scaleX(-1); 
          }
          75% { 
            transform: translateY(-4px) scaleY(0.96) scaleX(-1); 
          }
          87.5% { 
            transform: translateY(-2px) scaleY(0.98) scaleX(-1); 
          }
          100% { 
            transform: translateY(0px) scaleY(1) scaleX(-1); 
          }
        }
        @keyframes celebrate {
          0% { 
            transform: scale(1) rotate(0deg); 
          }
          50% { 
            transform: scale(1.5) rotate(180deg); 
          }
          100% { 
            transform: scale(1.2) rotate(360deg); 
          }
        }
        @keyframes gradient {
          0%, 100% { 
            transform: translateX(0%); 
          }
          50% { 
            transform: translateX(100%); 
          }
        }
      `}</style>
    </div>
  );
};

export default PatentProgressTracker;
