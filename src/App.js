import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import News from './components/News';
import Modal from './components/Modal';
import { useNewsContext } from './context/State';

function App() {
    const { country, load } = useNewsContext()

    return <Router>
        <Navbar />
        <div className="fixed-top" style={{
            height: "0.125rem",
            width: load[1],
            visibility: load[0],
            backgroundColor: "red",
            transition: "width 0.25s"
        }} />
        <Modal />
        <Routes>
            <Route path='/' element={<News category='' key={country} />} />
            <Route path='/business' element={<News category='Business' key={`${country}business`} />} />
            <Route path='/entertainment' element={<News category='Entertainment' key={`${country}entertainment`} />} />
            <Route path='/health' element={<News category='Health' key={`${country}health`} />} />
            <Route path='/science' element={<News category='Science' key={`${country}science`} />} />
            <Route path='/sports' element={<News category='Sports' key={`${country}sports`} />} />
            <Route path='/technology' element={<News category='Technology' key={`${country}technology`} />} />
            <Route path='/saved' element={<News category='Saved' key='saved' />} />
        </Routes>
    </Router>
}

export default App;
