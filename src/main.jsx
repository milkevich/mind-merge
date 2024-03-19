import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import LogIn from './Auth/LogIn.jsx';
import SignUp from './Auth/SignUp.jsx';
import Protected from './Protected.jsx';
import UserContextProvider from './Contexts/UserContext.jsx';
import Minds from './Components/Minds.jsx';
import MindPage from './Components/MindPage.jsx';
import Profile from './Components/Profile.jsx';
import ErrorBoundary from './Components/ErrorBoundary.jsx';
import NotFound from './Components/NotFound.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/mind-merge/' element={<App />}>
      <Route element={''}>
        <Route path='/mind-merge/log-in' element={<LogIn />} />
        <Route path='/mind-merge/sign-up' element={<SignUp />} />
        <Route path="/mind-merge/*" element={<NotFound />} errorElement={<NotFound />} />
        <Route element={<Protected />}>
          <Route path='/mind-merge/minds' element={<Minds />} />
          <Route path={`/mind-merge/minds/mind/:mindId`} element={<MindPage />} />
          <Route path={`/mind-merge/:username`} element={<Profile />} />
        </Route>
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserContextProvider>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </UserContextProvider>
);