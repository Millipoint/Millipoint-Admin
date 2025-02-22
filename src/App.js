import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import 'reactjs-popup/dist/index.css';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import TransactionScreen from './screen/transaction/TransactionScreen';
import { ToastContainer } from 'react-toastify';
import PriceScreen from './screen/price/PriceScreen.js';

// require('dotenv').config();

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <div>
            <Routes>
              <Route path='/transaction' element={<TransactionScreen />} />
              <Route path='/price' element={<PriceScreen />} />
            </Routes>
            <ToastContainer />
          </div>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
