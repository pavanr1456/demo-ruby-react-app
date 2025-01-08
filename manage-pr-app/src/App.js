import './App.css';
import PurchaseRequisitions from './components/PurchaseRequisitions';
import PurchaseRequisitionDetails from './components/PurchaseRequisitionDetails';
import NewPurchaseRequisition from './components/NewPurchaseRequisition';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { setTheme } from '@ui5/webcomponents-base/dist/config/Theme';
import '@ui5/webcomponents-react/dist/Assets';

function App() {
  setTheme("sap_horizon");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PurchaseRequisitions />} />
        <Route path="/pr/:id" element={<PurchaseRequisitionDetails />} />
        <Route path="/pr/new" element={<NewPurchaseRequisition />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;
