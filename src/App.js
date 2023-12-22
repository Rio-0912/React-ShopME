
import { BrowserRouter, Route,Routes } from 'react-router-dom';
import Home from './components/home'
import Shop from './components/shop'

function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path='/shop' element= {<Shop/>}></Route>
        <Route path='/' element= {<Home/>}></Route>
      </Routes>
    
      </BrowserRouter>
    </div>
  );
}

export default App;
