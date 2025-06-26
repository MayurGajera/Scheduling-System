import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import PublicBookingPage from "./components/PublicBookingPage";
import NotFound from "./components/NotFound";
import AvailabilityPage from "./components/AvailabilityPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/booking" element={<AvailabilityPage />} />
          <Route path="/booking/:linkId" element={<PublicBookingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
