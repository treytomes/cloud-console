import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./app/page";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <NextUIProvider>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <main className="w-screen h-screen bg-gray-200 dark:bg-black">
          <Home />
        </main>
      </ThemeProvider>
    </NextUIProvider>
  </React.StrictMode>
);
