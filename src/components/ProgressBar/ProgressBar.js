import './ProgressBar.css';

/**
 * A progress bar with textual feedback. It shows the current progress as a
 * percentage and the number of pieces placed out of the total.
 *
 * @param {Object} props Component properties.
 * @param {number} props.current The current number of pieces placed.
 * @param {number} props.total The total number of pieces to be placed.
 * @returns {JSX.Element}
 */
function ProgressBar({ current, total }) {
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
