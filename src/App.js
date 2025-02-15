import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HotelList from './components/HoteListComponent/HotelList.js';
import HotelForm from './components/HotelFormComponent/HotelForm.js';
import Navbar from './components/NavbarComponent/Navbar.js';
import { HotelProvider } from './context/HotelContext';

function App() {
  return (
    <HotelProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="container">
            <Switch>
              <Route exact path="/" component={HotelList} />
              <Route path="/agregar-hotel" component={HotelForm} />
            </Switch>
          </main>
        </div>
      </Router>
    </HotelProvider>
  );
}

export default App;
