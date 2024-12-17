import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Providers from "~/utils/providers.tsx";

import SocketHandler from "./utils/socketHandler.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Providers>
    <SocketHandler />
    <div className="flex justify-center items-center bg-background">
      <div className="container mx-auto w-full bg-background">
        <App />
      </div>
    </div>
  </Providers>
);
