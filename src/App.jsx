import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/Routes';

function App() {
  
  return (
    <Router>
      <AppRoutes /> {/* Render AppRoutes directly inside Router */}
    </Router>
  );
}

export default App;
