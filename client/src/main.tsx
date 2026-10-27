import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(error => {
      console.warn("Não foi possível registrar o modo offline:", error);
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
