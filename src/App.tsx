import { Route, Routes } from 'react-router-dom'
import './App.css'
import './assets/scss/theme.scss'
import { Authenticator } from '@aws-amplify/ui-react';
import { authProtectedRoutes, publicRoutes } from './routes'
import NonAuthLayout from './components/NonAuthLayout';
import HorizontalLayout from './components/HorizontalLayout';
import { RequireAuth } from './pages/login/requireAuth';

function App() {

  return (
    <Authenticator.Provider>
    <Routes>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={<NonAuthLayout>{route.component}</NonAuthLayout>}
            key={idx}
          />
        ))}

        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <RequireAuth>
                <HorizontalLayout>{route.component}</HorizontalLayout>
             </RequireAuth>
            }
            key={idx}
          />
        ))}
      </Routes>
      </Authenticator.Provider>
  )
}

export default App
