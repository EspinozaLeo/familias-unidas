// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
//
// function App() {
//   const [count, setCount] = useState(0)
//
//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }
//
// export default App

// src/App.jsx
import React from 'react';
import { PersonProvider } from './context/PersonContext';
import PersonList from './components/PersonList';
import MyButton from './components/MyButton';
import SearchPerson from './components/SearchPerson'

function App() {
    return (
        <PersonProvider>
            <div>
                <h1>Person Management</h1>
                <PersonList />
                 <SearchPerson />
                 {/* Other components that need access to persons */}
             </div>
        </PersonProvider>
    );
//   return (
//     <div className="App">
// {/*       <PersonList /> */}
// {/*       <MyButton /> */}
//       <SearchPerson />
//     </div>
//   );
}

export default App;
