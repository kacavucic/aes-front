import './App.css';
import NavBar from './components/NavBar';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from './components/HomePage';
import Footer from './components/Footer';

function App() {

    return (
        <div id="page-container">
            <div id="content-wrap">
                <BrowserRouter className="App">
                    <NavBar/>
                    <Routes>
                        <Route exact path="/" element={<HomePage/>}/>
                    </Routes>
                    <Footer></Footer>
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;
