import React from 'react';
import { PolywrapClient } from "@polywrap/client-js";
import { bundle } from "@polywrap/sys-config-bundle-js";

function App() {
  const client = new PolywrapClient();

  // Make extra sure the sys bundle works in the browser
  console.log(bundle);

  return (
    <div className="App">
      <header className="App-header">
        <div>Some text...</div>
      </header>
    </div>
  );
}

export default App;
