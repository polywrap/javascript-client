import React from 'react';
import { PolywrapClient } from "@polywrap/client-js";

function App() {
  const client = new PolywrapClient();

  return (
    <div className="App">
      <header className="App-header">
        <div>Some text...</div>
      </header>
    </div>
  );
}

export default App;
