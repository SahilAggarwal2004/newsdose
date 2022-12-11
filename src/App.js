import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import Modal from './components/Modal';
import Search from './components/Search';
import Loader from './components/Loader';
import { useNewsContext } from './context/ContextProvider';
import { lazy, Suspense } from 'react';
import { categories } from './constants';

const News = lazy(() => import('./components/News'));
const Offline = lazy(() => import('./components/Offline'));

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
        <Suspense fallback={<Loader />}></Suspense>
        <Routes>
            {categories.map(category => <Route key={category} path={`/${category}`} element={category === 'search' ? <Search /> : <News category={category} key={category === 'saved' ? category : country.code + category} />} />)}
            <Route path="/offline" element={<Offline />} />
        </Routes>
    </Router>
}

export default App;
