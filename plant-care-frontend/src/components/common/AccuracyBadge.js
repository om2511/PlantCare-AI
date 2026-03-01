import React from 'react';

const getAccuracyConfig = (score) => {
  if (score >= 80) return {
    label: 'High Accuracy',
    bar: 'bg-green-500',
    bg: 'bg-green-50 dark:bg-green-900/30',
    border: 'border-green-200 dark:border-green-700',
    text: 'text-green-700 dark:text-green-300',
    badge: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300',
  };
  if (score >= 60) return {
    label: 'Good Accuracy',
    bar: 'bg-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    border: 'border-blue-200 dark:border-blue-700',
    text: 'text-blue-700 dark:text-blue-300',
    badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
  };
  if (score >= 40) return {
    label: 'Moderate Accuracy',
    bar: 'bg-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    border: 'border-amber-200 dark:border-amber-700',
    text: 'text-amber-700 dark:text-amber-300',
    badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
  };
  return {
    label: 'Low Accuracy',
    bar: 'bg-red-500',
    bg: 'bg-red-50 dark:bg-red-900/30',
    border: 'border-red-200 dark:border-red-700',
    text: 'text-red-700 dark:text-red-300',
    badge: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300',
  };
};

/**
 * AccuracyBadge - shows how plant-specific / context-rich an AI result is.
 * Props:
 *   score  {number}  0–100 accuracy score
 *   tip    {string}  optional hint shown below the bar when score < 60
 */
const AccuracyBadge = ({ score, tip }) => {
  if (score === null || score === undefined) return null;
  const config = getAccuracyConfig(score);

  return (
    <div className={`p-3 rounded-xl border ${config.bg} ${config.border}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-semibold flex items-center gap-1.5 ${config.text}`}>
          <span>🎯</span> Analysis Accuracy
        </span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.badge}`}>
          {config.label}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-1.5 ${config.bar} rounded-full transition-all duration-700`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className={`text-sm font-bold ${config.text} min-w-[2.5rem] text-right`}>
          {score}%
        </span>
      </div>
      {tip && score < 60 && (
        <p className={`text-xs ${config.text} mt-1.5 opacity-75`}>{tip}</p>
      )}
    </div>
  );
};

export default AccuracyBadge;
