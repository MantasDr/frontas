import AuthProvider from "./auth/authProvider";
import { LakesProvider } from "./context/LakesContext";
import RoutesManager from "./routes/RoutesManager";
import { DarkModeProvider } from "./context/DarkModeContext";

function App() {
  return (
    <AuthProvider>
      <DarkModeProvider> {/* Wrap components with DarkModeProvider */}
        <LakesProvider>
          <RoutesManager />
        </LakesProvider>
      </DarkModeProvider>
    </AuthProvider>
  );
}

export default App;
