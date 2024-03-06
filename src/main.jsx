import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import LogIn from './Pages/LogIn.jsx';
import SignUp from './Pages/SignUp.jsx';
import Protected from './Protected.jsx';
import UserContextProvider from './Contexts/UserContext.jsx';
import Minds from './Components/Minds.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/mind-merge/' element={<App />}>
      <Route element={''}>
        <Route path='/mind-merge/log-in' element={<LogIn />} />
        <Route path='/mind-merge/sign-up' element={<SignUp />} />
        <Route element={<Protected />}>
          <Route path='/mind-merge/minds' element={<Minds />} />
        </Route>
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserContextProvider>
        <RouterProvider router={router} />
  </UserContextProvider>
);