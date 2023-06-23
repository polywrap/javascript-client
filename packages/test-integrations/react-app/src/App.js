import React from 'react';
import { PolywrapClient } from "@polywrap/client-js";

async function createClient() {
  return await PolywrapClient.default("browser");
}

function App() {
  const [_, setClient] = React.useState(undefined);
  React.useEffect(() => {
    createClient().then((client) => setClient(client));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div>some text</div>
      </header>
    </div>
  );
}

export default App;
