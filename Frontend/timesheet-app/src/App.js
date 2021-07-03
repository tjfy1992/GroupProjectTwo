import './App.css';
import 'antd/dist/antd.css';
import Homepage from "./components/homepage/homepage"
import Login from "./components/login/login"
import Summary from "./components/summary/summary"
import ErrorPage from './components/errorpage/errorpage';
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
          <Route component={ErrorPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
