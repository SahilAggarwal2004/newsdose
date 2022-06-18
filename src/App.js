import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import News from './components/News';
import Modal from './components/Modal';
import Search from './components/Search';
import { useNewsContext } from './context/ContextProvider';

function App() {
    const { country, load, categories } = useNewsContext()

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
            {categories.map(category => <Route key={category} path={`/${category}`} element={category === 'search' ? <Search /> : <News category={category} key={category === 'saved' ? category : country.code + category} />} />)}
        </Routes>
    </Router>
}

export default App;
