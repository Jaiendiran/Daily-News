import { createRoot } from 'react-dom/client'
import Router from './Routes.jsx'
import { Provider } from 'react-redux'
import { store } from './components/store/index.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css'

createRoot(document.getElementById('root')).render(
  <Provider store={store} >
    <Router />
  </Provider>
);