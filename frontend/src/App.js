import 'styles/app.scss';
import { Routes, Route } from 'react-router-dom';
import FrontPageView from 'views/frontPageView';
import useDisableHotkeys from 'util/hotkeys/useDisableHotkeys';

function App() {

  useDisableHotkeys();

  return (
    <div className="app">
      <Routes>
        <Route path='/' element={<FrontPageView />} />
      </Routes>
    </div>
  );
}

export default App;
