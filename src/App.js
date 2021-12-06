import { Router } from "./Router/Router";
import { LazyLoader } from "./Router/LazyLoader";
import "./global.scss";

function App() {
  return (
    <LazyLoader>
      <Router></Router>
    </LazyLoader>
  );
}

export default App;
