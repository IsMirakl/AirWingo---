import {
   Navigate,
   Route,
   BrowserRouter as Router,
   Routes,
} from 'react-router-dom';

import HomePage from '../pages/HomePage';

const AppRouter: React.FC = () => {
   return (
      <Router>
         <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
         </Routes>
      </Router>
   );
};
export default AppRouter;
