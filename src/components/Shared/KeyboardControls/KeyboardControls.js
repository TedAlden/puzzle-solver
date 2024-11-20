import "./KeyboardControls.css";
import useKeyboardInput from "../../../hooks/useKeyboardInput";

function KeyboardControls({ keyMap }) {
  // Create a map of key:onClick functions
  const keyActions = keyMap.reduce((actions, { key, onClick }) => {
    actions[key] = onClick;
    return actions;
  }, {});

  useKeyboardInput(keyActions);

  return (
    <div className="keyboardControls">
      <p>Keyboard Controls</p>
      <ul>
        {keyMap.map(({ key, keyAlias, description }) => (
          <li key={key}>
            {keyAlias ? keyAlias : key} : {description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default KeyboardControls;
