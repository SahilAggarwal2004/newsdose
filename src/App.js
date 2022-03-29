import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import News from './components/News';
import { useContext } from 'react';
import Context from './context/Context';

function App() {
    const { country, load } = useContext(Context)
    return (
        <Router>
            <Navbar />
            <div className="fixed-top" style={{
                height: "0.125rem",
                width: load[2],
                visibility: load[1],
                backgroundColor: "red",
                transition: "width 0.25s"
            }} />
            <Routes>
                <Route path='/' element={<News category='' key={country} />} />
                <Route path='/business' element={<News category='Business' key={`${country}business`} />} />
                <Route path='/entertainment' element={<News category='Entertainment' key={`${country}entertainment`} />} />
                <Route path='/health' element={<News category='Health' key={`${country}health`} />} />
                <Route path='/science' element={<News category='Science' key={`${country}science`} />} />
                <Route path='/sports' element={<News category='Sports' key={`${country}sports`} />} />
                <Route path='/technology' element={<News category='Technology' key={`${country}technology`} />} />
                <Route path='/saved' element={<News category='Saved' key='saved' saved={true} />} />
            </Routes>
        </Router>
    );
}

export default App;
