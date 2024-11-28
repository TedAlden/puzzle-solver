import { render, screen, fireEvent } from "@testing-library/react";
import KeyboardControls from "./KeyboardControls";

describe("KeyboardControls", () => {
  // Example keymap for testing
  const keyMap = [
    { key: "a", description: "Action A", onClick: jest.fn() },
    { key: "b", keyAlias: "B", description: "Action B", onClick: jest.fn() },
    {
      key: "ArrowRight",
      keyAlias: "→",
      description: "Action C",
      onClick: jest.fn(),
    },
  ];

  it("renders the keyboard controls list", () => {
    render(<KeyboardControls keyMap={keyMap} />);
    // Expect the title to be present
    expect(screen.getByText("Keyboard Controls")).toBeInTheDocument();
    // Expect each key/keyAlias to be shown with its description
    keyMap.forEach(({ key, keyAlias, description }) => {
      expect(
        screen.getByText(`${keyAlias ? keyAlias : key} : ${description}`)
      ).toBeInTheDocument();
    });
  });

  it("shows the key name if no alias supplied", () => {
    render(<KeyboardControls keyMap={keyMap} />);
    // Expect the key name to be shown if no alias is supplied
    expect(screen.getByText("a : Action A")).toBeInTheDocument();
  });

  it("shows the key alias if one is supplied", () => {
    render(<KeyboardControls keyMap={keyMap} />);
    // Expect the key alias to be shown if one is supplied
    expect(screen.getByText("→ : Action C")).toBeInTheDocument();
  });

  it("calls the correct function on key press", () => {
    render(<KeyboardControls keyMap={keyMap} />);
    // Press the "a" key and expect mapped action to have been called
    fireEvent.keyDown(document, { key: "a", code: "KeyA" });
    expect(keyMap[0].onClick).toHaveBeenCalled();
    // Press the "b" key and expect mapped action to have been called
    fireEvent.keyDown(document, { key: "b", code: "KeyB" });
    expect(keyMap[1].onClick).toHaveBeenCalled();
    // Expect the action for "ArrowRight" key to not have been called since the
    // key has not been pressed
    expect(keyMap[2].onClick).not.toHaveBeenCalled();
  });

  it("does nothing when pressing an unmapped key", () => {
    render(<KeyboardControls keyMap={keyMap} />);
    // Press the "c" key which has no mapped action
    fireEvent.keyDown(document, { key: "c", code: "KeyC" });
    // Expect none of the actions to have been called
    keyMap.forEach(({ onClick }) => {
      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
