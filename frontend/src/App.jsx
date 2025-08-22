import { DialogueProvider } from "./DialogueContext";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import NodeModal from "./components/Modal";
import "./App.css";

function App() {
  return (
    <DialogueProvider>
      <div className="container">
        <Sidebar />
        <div className="main-editor">
          <Canvas />
        </div>
        <NodeModal />
      </div>
    </DialogueProvider>
  );
}

export default App;
