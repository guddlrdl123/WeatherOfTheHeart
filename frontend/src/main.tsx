import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";

// Vite가 index.html의 #root를 찾아 React 앱을 연결하는 진입점입니다.
createRoot(document.getElementById("root")!).render(<App />);
