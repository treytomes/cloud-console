import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./app/page";
import { Providers } from "./app/providers";
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Providers>
      <main className="w-screen h-screen bg-gray-200 dark:bg-black">
        <Home />
      </main>
    </Providers>
  </React.StrictMode>
);
