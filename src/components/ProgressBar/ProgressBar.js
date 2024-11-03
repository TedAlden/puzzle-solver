import './ProgressBar.css';

const ProgressBar = ({ current, total }) => {
  const progress = (current / total) * 100;

  return (
    <div className="progress-tracker">
      <div className="progress-stats">
        <div className="progress-text">
          <span className="progress-label">Progress:</span>
          <span className="progress-count">
            {current} of {total} pieces placed
          </span>
        </div>
        <span className="progress-percentage">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
          data-testid="progress-fill"
        />
      </div>
    </div>
  );
};

export default ProgressBar;
