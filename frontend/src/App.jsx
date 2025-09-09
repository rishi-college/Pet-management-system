import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BreedList from './components/BreedList';
import BreedCreate from './components/BreedCreate';
import BreedEdit from './components/BreedEdit';
import BreedShow from './components/BreedShow';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<BreedList />} />
            <Route path="/breeds/new" element={<BreedCreate />} />
            <Route path="/breeds/edit/:id" element={<BreedEdit />} />
            <Route path="/breeds/:id" element={<BreedShow />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
