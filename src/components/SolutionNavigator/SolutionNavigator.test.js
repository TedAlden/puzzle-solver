import { render, fireEvent, screen } from "@testing-library/react";
import SolutionNavigator from "./SolutionNavigator";

describe("SolutionNavigator", () => {
  let solutionIndex, solutionsLength, handleSetSolutionIndex;

  beforeEach(() => {
    solutionIndex = 0;
    solutionsLength = 5;
    handleSetSolutionIndex = jest.fn();
  });

  it("renders correctly", () => {
    render(
      <SolutionNavigator
        solutionIndex={solutionIndex}
        solutionsLength={solutionsLength}
        handleSetSolutionIndex={handleSetSolutionIndex}
      />
    );

    expect(screen.getByTestId("prev-sol")).toBeInTheDocument();
    expect(screen.getByTestId("next-sol")).toBeInTheDocument();
    expect(screen.getByTestId("solution-index")).toBeInTheDocument();
  });

  it("calls handleSetSolutionIndex with correct value on previous button click", () => {
    solutionIndex = 1;
    render(
      <SolutionNavigator
        solutionIndex={solutionIndex}
        solutionsLength={solutionsLength}
        handleSetSolutionIndex={handleSetSolutionIndex}
      />
    );

    fireEvent.click(screen.getByTestId("prev-sol"));
    expect(handleSetSolutionIndex).toHaveBeenCalledWith(0);
  });

  it("calls handleSetSolutionIndex with correct value on next button click", () => {
    render(
      <SolutionNavigator
        solutionIndex={solutionIndex}
        solutionsLength={solutionsLength}
        handleSetSolutionIndex={handleSetSolutionIndex}
      />
    );

    fireEvent.click(screen.getByTestId("next-sol"));
    expect(handleSetSolutionIndex).toHaveBeenCalledWith(1);
  });

  it("calls handleSetSolutionIndex with correct value on input change", () => {
    render(
      <SolutionNavigator
        solutionIndex={solutionIndex}
        solutionsLength={solutionsLength}
        handleSetSolutionIndex={handleSetSolutionIndex}
      />
    );

    fireEvent.change(screen.getByTestId("solution-index"), {
      target: { value: "3" },
    });
    expect(handleSetSolutionIndex).toHaveBeenCalledWith(2);
  });

  it("disables previous button when solutionIndex is 0", () => {
    render(
      <SolutionNavigator
        solutionIndex={solutionIndex}
        solutionsLength={solutionsLength}
        handleSetSolutionIndex={handleSetSolutionIndex}
      />
    );

    expect(screen.getByTestId("prev-sol")).toBeDisabled();
  });

  it("disables next button when solutionIndex is the last solution", () => {
    solutionIndex = solutionsLength - 1;
    render(
      <SolutionNavigator
        solutionIndex={solutionIndex}
        solutionsLength={solutionsLength}
        handleSetSolutionIndex={handleSetSolutionIndex}
      />
    );

    expect(screen.getByTestId("next-sol")).toBeDisabled();
  });

  it("does not call handleSetSolutionIndex on previous button click when solutionIndex is 0", () => {
    render(
      <SolutionNavigator
        solutionIndex={solutionIndex}
        solutionsLength={solutionsLength}
        handleSetSolutionIndex={handleSetSolutionIndex}
      />
    );

    fireEvent.click(screen.getByTestId("prev-sol"));
    expect(handleSetSolutionIndex).not.toHaveBeenCalled();
  });

  it("does not call handleSetSolutionIndex on next button click when solutionIndex is the last solution", () => {
    solutionIndex = solutionsLength - 1;
    render(
      <SolutionNavigator
        solutionIndex={solutionIndex}
        solutionsLength={solutionsLength}
        handleSetSolutionIndex={handleSetSolutionIndex}
      />
    );

    fireEvent.click(screen.getByTestId("next-sol"));
    expect(handleSetSolutionIndex).not.toHaveBeenCalled();
  });

  it("calls handleSetSolutionIndex with minimum value on input change below 1", () => {
    render(
      <SolutionNavigator
        solutionIndex={solutionIndex}
        solutionsLength={solutionsLength}
        handleSetSolutionIndex={handleSetSolutionIndex}
      />
    );

    fireEvent.change(screen.getByTestId("solution-index"), {
      target: { value: "0" },
    });
    expect(handleSetSolutionIndex).toHaveBeenCalledWith(0);
  });

  it("calls handleSetSolutionIndex with maximum value on input change above solutionsLength", () => {
    render(
      <SolutionNavigator
        solutionIndex={solutionIndex}
        solutionsLength={solutionsLength}
        handleSetSolutionIndex={handleSetSolutionIndex}
      />
    );

    fireEvent.change(screen.getByTestId("solution-index"), {
      target: { value: "10" },
    });
    expect(handleSetSolutionIndex).toHaveBeenCalledWith(solutionsLength - 1);
  });

  it("calls handleSetSolutionIndex with correct value on input change to non-numeric value", () => {
    render(
      <SolutionNavigator
        solutionIndex={solutionIndex}
        solutionsLength={solutionsLength}
        handleSetSolutionIndex={handleSetSolutionIndex}
      />
    );

    fireEvent.change(screen.getByTestId("solution-index"), {
      target: { value: "abc" },
    });
    expect(handleSetSolutionIndex).toHaveBeenCalledWith(0);
  });

  it("calls handleSetSolutionIndex with correct value on input change to empty value", () => {
    render(
      <SolutionNavigator
        solutionIndex={solutionIndex}
        solutionsLength={solutionsLength}
        handleSetSolutionIndex={handleSetSolutionIndex}
      />
    );

    fireEvent.change(screen.getByTestId("solution-index"), {
      target: { value: "" },
    });
    expect(handleSetSolutionIndex).toHaveBeenCalledWith(0);
  });

  it("calls handleSetSolutionIndex with minimum value on input change to negative value", () => {
    render(
      <SolutionNavigator
        solutionIndex={solutionIndex}
        solutionsLength={solutionsLength}
        handleSetSolutionIndex={handleSetSolutionIndex}
      />
    );

    fireEvent.change(screen.getByTestId("solution-index"), {
      target: { value: "-5" },
    });
    expect(handleSetSolutionIndex).toHaveBeenCalledWith(0);
  });
});
