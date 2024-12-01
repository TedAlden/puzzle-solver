function SolutionNavigator({
  solutionIndex,
  solutionsLength,
  handleSetSolutionIndex,
}) {
  const handlePreviousSolution = () => {
    if (solutionIndex > 0) {
      handleSetSolutionIndex(solutionIndex - 1);
    }
  };

  const handleSetSolution = (index) => {
    const newIndex = Math.min(Math.max(1, index), solutionsLength);
    handleSetSolutionIndex(newIndex - 1);
  };

  const handleNextSolution = () => {
    if (solutionIndex < solutionsLength - 1) {
      handleSetSolutionIndex(solutionIndex + 1);
    }
  };

  return (
    <div className="solutionNavigation">
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
