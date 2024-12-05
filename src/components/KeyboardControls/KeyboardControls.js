import React, { useState } from "react";
import "./KeyboardControls.css";
import useKeyboardInput from "../../hooks/useKeyboardInput";

function KeyboardControls({ keyMap }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // Create a map of key:onClick functions
  const keyActions = keyMap.reduce((actions, { key, onClick }) => {
    actions[key] = onClick;
    return actions;
  }, {});

  useKeyboardInput(keyActions);

  return (
    <div className={`keyboardControls ${collapsed ? "collapsed" : ""}`}>
      <div className="header">
        <span>Keyboard Controls</span>
        <button onClick={toggleCollapse}>
          {collapsed ? "Expand" : "Collapse"}
        </button>
      </div>
      {!collapsed && (
        <ul>
          {keyMap.map(({ key, keyAlias, description }) => (
            <li key={key}>
              {keyAlias ? keyAlias : key} : {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default KeyboardControls;
