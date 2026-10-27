import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function startReferenceLedAnimation() {
  let angle = 0;
  const tick = () => {
    document.documentElement.style.setProperty("--carteira-vipang", `${angle}deg`);
    angle = (angle + 0.75) % 360;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(error => {
      console.warn("Não foi possível registrar o modo offline:", error);
    });
  });
}

startReferenceLedAnimation();

createRoot(document.getElementById("root")!).render(<App />);
