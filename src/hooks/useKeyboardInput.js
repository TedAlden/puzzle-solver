import { useEffect } from "react";

function useKeyboardInput(key, onKeyPressed) {
  useEffect(() => {
    // Create event handler
    function handleKeydown(e) {
      if (e.key === key) {
        e.preventDefault();
        onKeyPressed();
      }
    }
    // Add event listener
    document.addEventListener("keydown", handleKeydown);
    // Clean up event listener
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  });
}

export default useKeyboardInput;
