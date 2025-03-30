import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/Routes';

function App() {
  return (
    <Router>
      <AppRoutes>
      <App/>
      </AppRoutes>
    </Router>
  );
}

export default App;
