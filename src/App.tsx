import React from 'react';
import MemoriesContainer from './components/MemoriesContainer';
import { memoryQuotes } from './data/memoryQuotes';
import './styles/CustomStyles.css';

function App() {
  return (
    <div className="font-sans">
      <MemoriesContainer memories={memoryQuotes} />
    </div>
  );
}

export default App;