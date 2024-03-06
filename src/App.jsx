import { Outlet, useNavigate, useLocation, useMatch } from 'react-router-dom';
import './Shared/Styles/Variables.scss'
import { useEffect } from 'react';

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
      <Outlet />
    </div>
  )
}

export default App
