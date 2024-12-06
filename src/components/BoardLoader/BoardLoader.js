import { useEffect, useState } from "react";
import "./BoardLoader.css";

/**
 * BoardLoader component allows persistence of board storage between page
 * reloads and computer restarts. Allows users to save, load, rename, download,
 * and delete boards from their browser's local storage.
 *
 * @param {Object} props Component properties.
 * @param {Function} props.handleImport Function to handle importing a board.
 * @param {Function} props.handleExport Function to handle exporting a board.
 * @returns {React.JSX.Element}
 */
function BoardLoader({ handleImport, handleExport }) {
  const [boards, setBoards] = useState([]);

  // Load boards from LocalStorage on component mount
  useEffect(() => {
    setBoards(JSON.parse(localStorage.getItem("boards")) || []);
  }, []);

  /**
   * Saves the current board state to local storage as a snapshot.
   */
  const handleSaveSnapshot = () => {
    // Load boards into array from local storage
    const boards = Array.from(JSON.parse(localStorage.getItem("boards")) || []);
    // Create a new timestamp
    const timeStamp = new Date();
    const date = timeStamp.toLocaleDateString();
    const time = timeStamp.toLocaleTimeString();
    // Export the current board
    const { board, shapes } = handleExport();
    // Add current board to boards array
    boards.push({
      name: `Board ${date} ${time}`,
      board: board,
      shapes: shapes,
    });
    // Update local storage and React state with new boards array
    localStorage.setItem("boards", JSON.stringify(boards));
    setBoards(boards);
  };

  /**
   * Clears all snapshots from local storage and React state.
   */
  const handleClearSnapshots = () => {
    localStorage.removeItem("boards");
    setBoards([]);
  };

  /**
   * Loads a board snapshot from local storage into the current board.
   *
   * @param {number} index Index of the snapshot to load.
   */
  const handleLoadSnapshot = (index) => {
    handleImport(boards[index]);
  };

  /**
   * Renames a board snapshot in local storage and React state.
   *
   * @param {number} index Index of the snapshot to load.
   */
  const handleRenameSnapshot = (index) => {
    const snapshot = document.getElementsByClassName("snapshot")[index];
    const span = snapshot.querySelector(".snapshotTitle");
    // Handle keyup event for input element
    const onKeyUp = (event) => {
      event.preventDefault();
      if (event.key === "Enter") {
        const newSnapshotName = input.value;
        const boards = Array.from(
          JSON.parse(localStorage.getItem("boards")) || []
        );
        // Update board name in local storage and React state
        boards[index].name = newSnapshotName;
        localStorage.setItem("boards", JSON.stringify(boards));
        setBoards(boards);
        // Switch back from input to span element
        span.textContent = input.value;
        snapshot.replaceChild(span, input);
      }
    };
    // Create input element to rename snapshot
    const input = document.createElement("input");
    input.value = span.textContent;
    input.addEventListener("keyup", onKeyUp);
    // Replace span with input element
    snapshot.replaceChild(input, span);
    input.focus();
  };

  /**
   * Downloads a board snapshot as a JSON file.
   *
   * @param {number} index Index of the snapshot to load.
   */
  const handleDownloadSnapshot = (index) => {
    const board = boards[index];
    // Create a JSON blob from the board object
    const jsonBlob = new Blob([JSON.stringify(board, null, 2)], {
      type: "application/json",
    });
    // Create an invisible link element to download the JSON blob
    const link = document.createElement("a");
    link.href = URL.createObjectURL(jsonBlob);
    link.download = `${board.name}.json`;
    // Download
    link.click();
  };

  /**
   * Deletes a board snapshot from local storage and React state.
   *
   * @param {number} index Index of the snapshot to load.
   */
  const handleDeleteSnapshot = (index) => {
    // Remove board using index
    const boards = Array.from(JSON.parse(localStorage.getItem("boards")) || []);
    boards.splice(index, 1);
    // Update local storage and React state
    localStorage.setItem("boards", JSON.stringify(boards));
    setBoards(boards);
  };

  /**
   * Renders the list of board snapshots.
   * @returns {React.JSX.Element[]}
   */
  const renderSnapshots = () => {
    return boards.map((board, index) => (
      <div className="snapshot" key={index}>
        <div className="snapshotTitle">
          <span>{board.name}</span>
        </div>
        <div className="snapshotControls">
          <span
            className="controlsButton"
            data-testid="load-button"
            title="Load board"
            onClick={() => handleLoadSnapshot(index)}
          >
            ⬆️
          </span>
          <span
            className="controlsButton"
            data-testid="rename-button"
            title="Rename board"
            onClick={() => handleRenameSnapshot(index)}
          >
            ✏️
          </span>
          <span
            className="controlsButton"
            data-testid="save-button"
            title="Save board to desktop"
            onClick={() => handleDownloadSnapshot(index)}
          >
            💾
          </span>
          <span
            className="controlsButton"
            data-testid="delete-button"
            title="Delete board from local storage"
            onClick={() => handleDeleteSnapshot(index)}
          >
            🗑️
          </span>
        </div>
      </div>
    ));
  };

  return (
    <div className="boardLoader">
      <span className="panelHeader">Saved Boards</span>
      <div className="buttonWrapper">
        <button data-testid="save-snapshot-button" onClick={handleSaveSnapshot}>
          Save
        </button>
        <button
          data-testid="clear-snapshots-button"
          onClick={handleClearSnapshots}
        >
          Clear
        </button>
      </div>
      <div className="snapshotsList">{renderSnapshots()}</div>
    </div>
  );
}

export default BoardLoader;
