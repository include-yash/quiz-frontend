import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/Routes';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("Missing Google Client ID");
  }

  
  return (
    <GoogleOAuthProvider clientId={clientId}>
    <Router>
      <AppRoutes /> {/* Render AppRoutes directly inside Router */}
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
