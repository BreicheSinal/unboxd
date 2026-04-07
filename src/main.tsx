import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { initializeAppSecurity } from "./app/firebase/config";
import { initObservability } from "./app/services/observabilityService";
import "./styles/index.css";

initializeAppSecurity();
initObservability();

createRoot(document.getElementById("root")!).render(<App />);
