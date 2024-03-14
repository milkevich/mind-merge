import { Outlet, useNavigate, useLocation, useMatch } from 'react-router-dom';
import './Shared/Styles/Variables.scss'
import { useEffect } from 'react';
import UserContextProvider from './Contexts/UserContext';
import ThemeContextProvider from './Contexts/ThemeContext';

function App() {

  const navigate = useNavigate();
  const location = useLocation();
  const match = useMatch('/mind-merge')

  useEffect(() => {
    if (match) {
      navigate('/mind-merge/minds');
    }
  }, [navigate, match])

  return (
    <div>
      <UserContextProvider>
        <ThemeContextProvider>
          <Outlet />
        </ThemeContextProvider>
      </UserContextProvider>
    </div>
  )
}

export default App
