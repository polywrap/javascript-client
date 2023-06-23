import React from 'react';
import { PolywrapClient } from "@polywrap/client-js";
import { getBundleConfig } from "@polywrap/sys-config-bundle-js";

async function createClient() {
  // Adding both of these to ensure we fail to
  // compile if the packages aren't setup correctly.
  const bundle = await getBundleConfig();
  return await PolywrapClient.default();
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
