import { Sidebar } from "./components/layout/Sidebar.js";
import { Header } from "./components/layout/Header.js";
import { AnalyzePage } from "./pages/AnalyzePage.js";
import "./styles/globals.css";
export default function App() { return (<div className="app-layout"><Sidebar /><div className="app-main"><Header title="Analyze Field Impact" subtitle="Discover how a field is used across ServiceNow metadata" /><div className="app-content"><AnalyzePage /></div></div></div>); }
