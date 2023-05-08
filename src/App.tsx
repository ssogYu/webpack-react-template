import React, { useState } from 'react';
import './app.less';
import Image from '@/assets/ceshi.jpg';
export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="app">
      <h1>hello my friend</h1>
    </div>
  );
}
