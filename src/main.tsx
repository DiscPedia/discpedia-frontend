import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

async function startApp() {
  const enableConcertMocks =
    import.meta.env.VITE_ENABLE_CONCERT_MOCKS === "true" ||
    (import.meta.env.DEV && import.meta.env.VITE_ENABLE_CONCERT_MOCKS !== "false");

  if (enableConcertMocks) {
    const { worker } = await import("./mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
startApp();
