import logo from './logo.svg';
import './App.css';
import { Tokyo, TokyoView, HSLControl, HSLView, HSLModel } from "./quest/q1";

//  //

export function App() {

  const modelsrcs = [];
  // const tokyo = new Tokyo( { title: "東京", points: [ "銀座", "日比谷", "有楽町", ] } );
  // const tokyo = new Tokyo( { title: "東京", points: [ "駒込", "雑司ヶ谷", "池袋" ] } );
  const tokyo = new Tokyo( { title: "東京", points: [ "池袋", "小竹向原", "和光市" ] } );
  const color = new HSLModel( { hue: 180, sat: 59, light: 53 } );

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <TokyoView model={ tokyo } />
        
        <HSLView model={ color } />
        <HSLControl model={ color } />

        <p>22. 07. 16. B</p>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

