import { useEffect } from "react";

/**
 * A custom hook that listens for keyboard input and calls the corresponding
 * action when a key is pressed.
 *
 * @param {Object} keyActions A map of key:action pairs.
 * @returns {React.JSX.Element}
 *
 * @example
 * useKeyboardInput({
 *   ArrowUp: () => console.log("Up"),
 *   ArrowDown: () => console.log("Down"),
 *   ...
 * });
 *
 */
function useKeyboardInput(keyActions) {
  useEffect(() => {
    const handleKeydown = (e) => {
      const action = keyActions[e.key];
      if (action) {
        e.preventDefault(); // Prevent default action for mapped keys
        action();
      }
    };
    // Add event listener
    document.addEventListener("keydown", handleKeydown);
    // Clean up event listener
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [keyActions]); // Re-run if keyActions change
}

export default useKeyboardInput;
