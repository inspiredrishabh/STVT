import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import Router from './Router'


const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
