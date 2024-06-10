import './App.css';
import WebcamCapture from './Component/WebcamCapture';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <h1>ROCK, PAPER, SCISSOR</h1>
      <WebcamCapture />
    </div>
  );
}

export default App;
