import { useEffect, useState } from "react";
import "./BoardLoader.css";

function BoardLoader({ handleImport, handleExport }) {
  const [boards, setBoards] = useState([]);

  // Load boards from LocalStorage on component mount
  useEffect(() => {
    setBoards(JSON.parse(localStorage.getItem("boards")) || []);
  }, []);

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

  const handleClearSnapshots = () => {
    localStorage.removeItem("boards");
    setBoards([]);
  };

  const handleLoadSnapshot = (index) => {
    handleImport(boards[index]);
  };

  const handleRenameSnapshot = (index) => {
    const snapshot = document.getElementsByClassName("snapshot")[index];
    const span = snapshot.querySelector(".snapshotColumn.title");
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

  const handleDeleteSnapshot = (index) => {
    // Remove board using index
    const boards = Array.from(JSON.parse(localStorage.getItem("boards")) || []);
    boards.splice(index, 1);
    // Update local storage and React state
    localStorage.setItem("boards", JSON.stringify(boards));
    setBoards(boards);
  };

  const renderSnapshots = () => {
    return boards.map((board, index) => (
      <div className="snapshotRow snapshot" key={index}>
        <div className="snapshotColumn title">
          <span className="snapshotTitle">{board.name}</span>
        </div>
        <div className="snapshotColumn controls">
          <button
            data-testid="load-button"
            title="Load board"
            onClick={() => handleLoadSnapshot(index)}
          >
            ⬆️
          </button>
          <button
            data-testid="rename-button"
            title="Rename board"
            onClick={() => handleRenameSnapshot(index)}
          >
            ✏️
          </button>
          <button
            data-testid="save-button"
            title="Save board to desktop"
            onClick={() => handleDownloadSnapshot(index)}
          >
            💾
          </button>
          <button
            data-testid="delete-button"
            title="Delete board from local storage"
            onClick={() => handleDeleteSnapshot(index)}
          >
            🗑️
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="boardLoader">
      <span className="panelHeader">Saved Boards</span>
      <button data-testid="save-snapshot-button" onClick={handleSaveSnapshot}>
        Save Board
      </button>
      <button
        data-testid="clear-snapshots-button"
        onClick={handleClearSnapshots}
      >
        Clear Boards
      </button>
      <div className="snapshotsTableWrapper">
        <div className="snapshotsTable">{renderSnapshots()}</div>
      </div>
    </div>
  );
}

export default BoardLoader;
