import './App.css';
import 'antd/dist/antd.css';
import Homepage from "./components/homepage/homepage"
import Login from "./components/login/login"
import Summary from "./components/summary/summary"
import Profile from "./components/profile/profile"
import ErrorPage from './components/errorpage/errorpage';
import TestComponent from './components/test/test';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
    

function App() {

  return (
    <div className="App">
      <Router >
        <Switch>
          <Route exact path="/" component={Login}/>
          <Route path="/home" component={Homepage}/>
          <Route path="/summary" component={Summary}/>
          <Route path="/profile" component={Profile}/>
          <Route path="/test" component={TestComponent}/>
          <Route component={ErrorPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
