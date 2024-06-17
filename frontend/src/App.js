import 'styles/app.scss';
import { Routes, Route } from 'react-router-dom';
import FrontPageView from 'views/frontPageView';
import useDisableHotkeys from 'util/hotkeys/useDisableHotkeys';
import { setPlayStateCall } from 'store/reducers/clickReducer';
import usePlayStateSocket from 'util/playstate/usePlayStateSocket';
import { connect } from 'react-redux';
import useWindowHandler from 'util/window/useWindowHandler';
import Menu from 'components/menu/Menu';
import updateAPI from "apis/updateAPI";
import appAPI from "apis/appAPI";
import { exit } from '@tauri-apps/api/process';

function App(props) {

  const { setPlayStateCall } = props;

  useDisableHotkeys();
  usePlayStateSocket(setPlayStateCall);
  useWindowHandler();

  const checkForUpdates = async () => {
    const response = await updateAPI.checkForUpdates();
    const update_url = response.data;

    if (!update_url) {
      return;
    }

    await updateAPI.installLatestUpdate();
    appAPI.quitApp();
    exit(1);
  }

  const menuItems = [
    {
      "name": "Update",
      "items": [
        {
          "name": "Check for updates",
          "type": "item",
          "onClick": checkForUpdates
        },
      ],
    }
  ]

  return (
    <div className="app">
      <Menu items={menuItems}>
      </Menu>
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