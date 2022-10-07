import './App.css';

import { PetsContextProvider } from './context/PetsContext';
import { MainNavigation } from './cmps/MainNavigation/MainNavigation';
import { AuthContextProvider } from './context/authContext';
import { PagesContextProvider } from './context/PagesContext';
import NotificationProvider from './cmps/Notification/NotificationProvider';

function App() {
  return (
    <div className="mainContainer">
      <AuthContextProvider>
        <PetsContextProvider>
          <PagesContextProvider>
            <NotificationProvider>
              <MainNavigation />
            </NotificationProvider>
          </PagesContextProvider>
        </PetsContextProvider>
      </AuthContextProvider>
    </div>
  );
}

export default App;
