import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./print.css";

console.log('🚀 main.tsx loaded');
console.log('📍 DOM ready state:', document.readyState);
console.log('🎯 Root element:', document.getElementById("root"));

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  console.log('⚛️ Creating React root...');
  const root = createRoot(rootElement);
  
  console.log('🎨 Rendering App...');
  root.render(<App />);
  
  console.log('✅ React app rendered successfully');
} catch (error) {
  console.error('❌ Error mounting React app:', error);
  
  // Fallback: show error message
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
        <h1 style="color: #dc2626;">⚠️ React Loading Error</h1>
        <p>Error: ${error.message}</p>
        <button onclick="window.location.reload()" style="background: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
          🔄 Reload Page
        </button>
      </div>
    `;
  }
}
