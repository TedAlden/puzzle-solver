import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import BoardLoader from "./BoardLoader";

describe("BoardLoader", () => {
  let handleImport, handleExport;

  beforeEach(() => {
    handleImport = jest.fn();
    handleExport = jest.fn().mockReturnValue({ board: [], shapes: [] });
    localStorage.clear();
  });

  it("loads boards from localStorage on mount", () => {
    localStorage.setItem(
      "boards",
      JSON.stringify([{ name: "Test Board", board: [], shapes: [] }])
    );
    render(
      <BoardLoader handleImport={handleImport} handleExport={handleExport} />
    );
    expect(screen.getByText("Test Board")).toBeInTheDocument();
  });

  it("saves a snapshot", () => {
    render(
      <BoardLoader handleImport={handleImport} handleExport={handleExport} />
    );
    fireEvent.click(screen.getByTestId("save-snapshot-button"));
    expect(localStorage.getItem("boards")).not.toBeNull();
    expect(JSON.parse(localStorage.getItem("boards")).length).toBe(1);
  });

  it("clears snapshots", () => {
    localStorage.setItem(
      "boards",
      JSON.stringify([{ name: "Test Board", board: [], shapes: [] }])
    );
    render(
      <BoardLoader handleImport={handleImport} handleExport={handleExport} />
    );
    fireEvent.click(screen.getByText("Clear Boards"));
    expect(localStorage.getItem("boards")).toBeNull();
  });

  it("loads a snapshot", () => {
    localStorage.setItem(
      "boards",
      JSON.stringify([{ name: "Test Board", board: [], shapes: [] }])
    );
    render(
      <BoardLoader handleImport={handleImport} handleExport={handleExport} />
    );
    fireEvent.click(screen.getByTestId("load-button"));
    expect(handleImport).toHaveBeenCalledWith({
      name: "Test Board",
      board: [],
      shapes: [],
    });
  });

  it("renames a snapshot", () => {
    localStorage.setItem(
      "boards",
      JSON.stringify([{ name: "Test Board", board: [], shapes: [] }])
    );
    render(
      <BoardLoader handleImport={handleImport} handleExport={handleExport} />
    );
    fireEvent.click(screen.getByTestId("rename-button"));
    const input = screen.getByDisplayValue("Test Board");
    fireEvent.change(input, { target: { value: "Renamed Board" } });
    fireEvent.keyUp(input, { key: "Enter", code: "Enter" });
    expect(JSON.parse(localStorage.getItem("boards"))[0].name).toBe(
      "Renamed Board"
    );
  });

  it("downloads a snapshot", () => {
    localStorage.setItem(
      "boards",
      JSON.stringify([{ name: "Test Board", board: [], shapes: [] }])
    );
    render(
      <BoardLoader handleImport={handleImport} handleExport={handleExport} />
    );
    const createObjectURL = jest.fn();
    global.URL.createObjectURL = createObjectURL;
    fireEvent.click(screen.getByTestId("save-button"));
    expect(createObjectURL).toHaveBeenCalled();
  });

  it("deletes a snapshot", () => {
    localStorage.setItem(
      "boards",
      JSON.stringify([{ name: "Test Board", board: [], shapes: [] }])
    );
    render(
      <BoardLoader handleImport={handleImport} handleExport={handleExport} />
    );
    fireEvent.click(screen.getByTestId("delete-button"));
    expect(JSON.parse(localStorage.getItem("boards")).length).toBe(0);
  });
});
