import 'styles/app.scss';
import { Routes, Route } from 'react-router-dom';
import FrontPageView from 'views/frontPageView';
import useDisableHotkeys from 'util/hotkeys/useDisableHotkeys';
import { setPlayStateCall } from 'store/reducers/clickReducer';
import usePlayStateSocket from 'util/playstate/usePlayStateSocket';
import { connect } from 'react-redux';
import useWindowHandler from 'util/window/useWindowHandler';

function App(props) {

  const { setPlayStateCall } = props;

  useDisableHotkeys();
  usePlayStateSocket(setPlayStateCall);
  useWindowHandler();

  return (
    <div className="app">
      <Routes>
        <Route path='/' element={<FrontPageView />} />
      </Routes>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = {
  setPlayStateCall
};

export default connect(mapStateToProps, mapDispatchToProps)(App);