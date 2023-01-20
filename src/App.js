import { Routes, Route } from 'react-router-dom'
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
    const { country } = useNewsContext()

    return <>
        <Navbar />
        <Modal />
        <Suspense fallback={<Loader type={1} />}>
            <Routes>
                {categories.map(category => <Route key={category} path={'/' + category} element={category === 'search' ? <Search /> : <News key={(category === 'saved' ? '' : country.code) + category} />} />)}
                <Route path="/offline" element={<Offline />} />
            </Routes>
        </Suspense>
    </>
}

export default App;
