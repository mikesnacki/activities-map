import React, { useCallback } from 'react';
import './App.css';
import Map from "../src/components/map"



function App() {

  const MemoMap = useCallback(<Map />, [])

  return (
    <div className="App">
      {MemoMap}
    </div>
  );
}

export default App;
