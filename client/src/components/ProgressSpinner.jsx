function ProgressSpinner({ size = 40, stroke = 5, progress = 0, className = '' }) {
  const radius = (size - stroke) / 2;

  return (
    <svg width={size} height={size} className='-rotate-90 transform'>
      {/* Progress Circle */}
      <circle
        fill='transparent'
        strokeWidth={stroke}
        strokeLinecap='round'
        r={radius}
        cx={size / 2}
        cy={size / 2}
        pathLength='100'
        strokeDasharray={`${progress} 100`}
        className={`stroke-current transition-all duration-300 ease-in-out ${className}`}
      />
    </svg>
  );
}

export default ProgressSpinner;
