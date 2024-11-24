import { render, screen } from "@testing-library/react";
import ProgressBar from "./ProgressBar";

describe("ProgressBar Component testing", () => {
  test("Renders the correct progress percentage and count", () => {
    render(<ProgressBar current={5} total={10} />);
    expect(screen.getByText("5 of 10 pieces placed")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  test("Renders 0% when current is 0", () => {
    render(<ProgressBar current={0} total={10} />);
    expect(screen.getByText("0 of 10 pieces placed")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  test("Renders 100% when current equals total", () => {
    render(<ProgressBar current={10} total={10} />);
    expect(screen.getByText("10 of 10 pieces placed")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  test("Progress bar width reflects the percentage", () => {
    render(<ProgressBar current={7} total={10} />);
    const progressFill = screen.getByTestId("progress-fill");
    expect(progressFill).toHaveStyle("width: 70%");
    expect(progressFill).toHaveAttribute("aria-valuenow", "70");
  });
});
