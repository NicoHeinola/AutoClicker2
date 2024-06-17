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
import InfoPopup from 'components/popup/InfoPopup';
import { useState } from 'react';

function App(props) {

  const { setPlayStateCall } = props;

  const [updatePopupVisible, setUpdatePopupVisible] = useState(false);
  const [noUpdatePopupVisible, setNoUpdatePopupVisible] = useState(false);

  useDisableHotkeys();
  usePlayStateSocket(setPlayStateCall);
  useWindowHandler();

  const checkForUpdates = async () => {
    const response = await updateAPI.checkForUpdates();
    const update_url = response.data;

    if (!update_url) {
      setNoUpdatePopupVisible(true);
    } else {
      setUpdatePopupVisible(true);
    }
  }

  const installUpdates = async () => {
    await updateAPI.installLatestUpdate();
    appAPI.quitApp();
    exit(1);
  }

  const closePopups = () => {
    setUpdatePopupVisible(false);
    setNoUpdatePopupVisible(false);
  }

  const menuItems = [
    {
      "name": "File",
      "items": [
        {
          "name": "Exit",
          "type": "item",
          "onClick": exit
        },
      ],
    },
    {
      "name": "Help",
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
      <Menu items={menuItems} />
      <InfoPopup visible={updatePopupVisible} onVisibilityChange={setUpdatePopupVisible} buttons={[{ "text": "Install", onClick: installUpdates }, { "text": "Cancel", onClick: closePopups }]} texts={["A new version has been released!", "Would you like to update?"]} />
      <InfoPopup icon="exclamation" visible={noUpdatePopupVisible} onVisibilityChange={setNoUpdatePopupVisible} buttons={[{ "text": "Ok", onClick: closePopups }]} texts={["There are currently no updates available."]} />
      <Routes>
        <Route path='/' element={<FrontPageView />} />
      </Routes>
    </div >
  );
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = {
  setPlayStateCall
};

export default connect(mapStateToProps, mapDispatchToProps)(App);