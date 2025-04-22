// src/components/LoadingSpinner.js
export default function LoadingSpinner({ progress }) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="loading-spinner"></div>
        {progress !== undefined && (
          <div className="mt-4 w-full max-w-xs">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center mt-2">{Math.round(progress)}% complete</p>
          </div>
        )}
      </div>
    );
  }