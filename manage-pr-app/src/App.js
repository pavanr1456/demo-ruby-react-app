import './App.css';
import PurchaseRequisitions from './components/PurchaseRequisitions';
import PurchaseRequisitionDetails from './components/PurchaseRequisitionDetails';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PurchaseRequisitions />} />
        <Route path="/pr/:id" element={<PurchaseRequisitionDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
