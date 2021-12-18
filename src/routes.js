import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MovieList from "./components/MovieList";
const Routes = () => {
  return (
    <div className="Routes">
      <Router>
        <Switch>
          <Route path="/" component={MovieList} />
        </Switch>
      </Router>
    </div>
  );
};

export default Routes;
