import 'styles/app.scss';
import { Routes, Route } from 'react-router-dom';
import FrontPageView from 'views/frontPageView';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path='/' element={<FrontPageView />} />
      </Routes>
    </div>
  );
}

export default App;
