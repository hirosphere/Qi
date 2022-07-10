import { useState } from "react";
import logo from './logo.svg';
import './App.css';
import { Leaf, Rel } from "./Leaf";
import { CompoA, HSLControl, HSLView, HSLModel } from "./quest/q1";

const Tokyo = class
{
	constructor( { title, points } )
  {
    this.title = title;
    points.forEach( point => this.addPoint( point ) );
  }

  addPoint( name )
  {
    this.points.push( { name, count: Leaf.new( 0, this.total ) } );
  }

  get_total()
  {
    let acc = 0;
    this.points.forEach( item => acc += item.count.value );
    return acc;
  }

  points = [];
  total = new Rel
  ({
    calc: () => this.get_total()
  });
};


//  //

const TokyoView = ( { model } ) =>
{
  const [ total ] =  model.total.shot = useState( model.total.value );

  return (
    <div>
      <h2>{ model.title }で{ total }つ。</h2>
      <ul>
        {
          model.points.map( point => <CompoA model={ point } /> )
        }
      </ul>
    </div>
  )
};


//  //

function App() {

  const modelsrcs = [];
  const tokyo = new Tokyo( { title: "東京", points: [ "銀座", "日比谷", "有楽町", ] } );
  // const tokyo = new Tokyo( { title: "東京", points: [ "駒込", "雑司ヶ谷", "池袋" ] } );
  // const tokyo = new Tokyo( { title: "東京", points: [ "池袋", "小竹向原", "和光市" ] } );
  const color = new HSLModel( { hue: 180, sat: 90, light: 60 } );

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <TokyoView model={ tokyo } />
        
        <HSLView model={ color } />
        <HSLControl model={ color } />

        <p>JSXって、つまりJSXなんだよね  ( 進次郎 )</p>
        
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

export default App;
