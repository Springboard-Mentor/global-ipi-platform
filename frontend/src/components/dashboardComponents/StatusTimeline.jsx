import React from "react";

const steps = ["Filed", "Pending", "Pending Review", "Completed"];

const StatusTimeline = ({ status, filedOn, updatedOn }) => {
  const currentIndex = steps.indexOf(status);

  return (
    <div className="mt-4 p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-xl">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <React.Fragment key={index}>
              {/* STEP BLOCK */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    px-4 py-2 rounded-lg font-semibold text-sm
                    border backdrop-blur-lg
                    ${
                      isCompleted
                        ? "bg-green-500/20 border-green-400 text-green-300"
                        : isActive
                        ? "bg-blue-500/30 border-blue-400 text-blue-200 shadow-lg shadow-blue-500/40"
                        : "bg-white/10 border-white/20 text-gray-300"
                    }
                  `}
                >
                  {step}
                </div>

                <p className="text-xs mt-1 text-gray-300">
                  {index === 0
                    ? filedOn
                    : index === currentIndex
                    ? updatedOn
                    : ""}
                </p>
              </div>

              {/* CONNECTING LINE BETWEEN STEPS */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-[2px] mx-3 
                    ${
                      isCompleted
                        ? "bg-green-400"
                        : isActive
                        ? "bg-blue-400"
                        : "bg-gray-600"
                    }
                  `}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StatusTimeline;
