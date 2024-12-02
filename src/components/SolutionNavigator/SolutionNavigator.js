/**
 * SolutionNavigator component. Renders the solution navigation buttons and a
 * numerical input to allow the user to quickly navigate between large numbers
 * of solutions.
 *
 * @param {Object} props Component properties.
 * @param {number} props.solutionIndex The current solution index.
 * @param {number} props.solutionsLength The total number of solutions.
 * @param {Function} props.handleSetSolutionIndex Function to set the solution
 *  index.
 * @returns {React.JSX.Element}
 */
function SolutionNavigator({
  solutionIndex,
  solutionsLength,
  handleSetSolutionIndex,
}) {
  /**
   * Handles the previous solution button click.
   */
  const handlePreviousSolution = () => {
    if (solutionIndex > 0) {
      handleSetSolutionIndex(solutionIndex - 1);
    }
  };

  /**
   * Handles setting the solution index.
   * @param {number} index The new solution index.
   */
  const handleSetSolution = (index) => {
    const newIndex = Math.min(Math.max(1, index), solutionsLength);
    handleSetSolutionIndex(newIndex - 1);
  };

  /**
   * Handles the next solution button click.
   */
  const handleNextSolution = () => {
    if (solutionIndex < solutionsLength - 1) {
      handleSetSolutionIndex(solutionIndex + 1);
    }
  };

  return (
    <div className="solutionNavigation" data-testid="solution-navigation">
      <button
        data-testid="prev-sol"
        onClick={handlePreviousSolution}
        disabled={solutionIndex === 0}
      >
        Previous Solution
      </button>
      <span>
        Solution{" "}
        <input
          style={{ width: 60 }}
          type="number"
          id="solution-index"
          data-testid="solution-index"
          value={solutionIndex + 1}
          onChange={(e) => {
            handleSetSolution(parseInt(e.target.value) || 1);
          }}
          min={1}
        />{" "}
        of {solutionsLength}
      </span>
      <button
        data-testid="next-sol"
        onClick={handleNextSolution}
        disabled={solutionIndex === solutionsLength - 1}
      >
        Next Solution
      </button>
    </div>
  );
}

export default SolutionNavigator;
