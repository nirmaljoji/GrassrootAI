import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import "./App.css";
import { Route, Routes } from "react-router";
import NewDetailsView from "./pages/NewDetailsView";
import Chatpage from "./pages/Chatpage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chatpage />} />
        <Route path="/details/:eventId" element={<NewDetailsView />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};


export default App;