import React from 'react';
import { Sandpack } from "@codesandbox/sandpack-react";
import { dracula as draculaTheme } from "@codesandbox/sandpack-themes";

import { sharedFiles, dependencies } from "@/utils/constants";

const CodeViewer = ({ code }) => {
  return (
    <Sandpack
      template="react-ts"
     
      files={{
        "/App.tsx": code,
        "/index.tsx": `
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
        ...sharedFiles,
      }}
      options={{
        showNavigator: false,
        showTabs: true,
        externalResources: [
          "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
        ],
        showReadOnly:false,
        showEditor : false,
        editorHeight: "80vh",
        theme: draculaTheme,
        editorWidthPercentage: 0
        

      }}
      customSetup={{
        dependencies: dependencies,
      }}
    />
  );
};

export default CodeViewer;