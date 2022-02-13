import './App.css';
import { Sample01State } from './samples/Sample01State';
import { Sample02SingelRandomizer } from './samples/Sample02SingleRandomizer';
import { Sample03MultiState } from './samples/Sample03MultiState';
import { Sample04MuliRandomizer } from './samples/Sample04MultiRandomizer';
import { Sample05MuliRandomizer } from './samples/Sample05MultiRandomizer';

function App() {
  return (
    <div className="App">
    {/* <Sample01State /> */}
     {/* <Sample02SingelRandomizer /> */}
      {/* <Sample03MultiState />*/ }
      {/* <Sample04MuliRandomizer /> */}
      <Sample05MuliRandomizer />
    </div>
  );
}

export default App;
