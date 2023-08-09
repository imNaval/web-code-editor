import React, { useState, useEffect } from "react";
import Editor from "./Editor";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {

  const [html, setHtml] = useLocalStorage("html", ""); ////useState('');
  const [css, setCss] = useLocalStorage("css", "");
  const [js, setJs] = useLocalStorage("js", "");
  const [srcDoc, setSrcDoc] = useState('');

  ////debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setSrcDoc(`
      <html>
        <body>${html}</body>
        <style>${css}</style>
        <script>${js}</script>
      </html>
    `)
    }, 500);

    return () => clearTimeout(timer);
  }, [html, css, js])

  ////resize
  const [initialPos,   setInitialPos] = React.useState(null);
  const [initialSize, setInitialSize] = React.useState(null);
  
  const initial = (e) => {
    // console.log("start");
    let resizable = document.getElementById('top');
    setInitialPos(e.clientY);
    setInitialSize(resizable.offsetHeight);
  }
  const resize = (e) => {
    // console.log("resizing");
    let resizable = document.getElementById('top');
    const newHeight = parseInt(initialSize) + parseInt(e.clientY - initialPos);
    resizable.style.height = newHeight > 100 && newHeight < window.innerHeight-100  ? newHeight + "px" : resizable.style.height
  }


  return (
    <div className="parent">
      <div className="pane top-pane" id="top">
        <Editor 
          language = "xml"
          displayName = "HTML"
          value = {html}
          onChange = {setHtml}
        />
        <Editor 
          language = "css"
          displayName = "CSS"
          value = {css}
          onChange = {setCss}
        />
          <Editor 
          language = "javascript"
          displayName = "JS"
          value = {js}
          onChange = {setJs}
        />
      </div>
      
      <div 
        className="resizer"
        draggable   = 'true'
        onDragStart = {initial} 
        onDrag      = {resize}
      ></div>

      <div className="pane" id="bottom">
        <iframe 
          srcDoc={srcDoc}
          title="output"
          sandbox="allow-scripts"
          frameBorder="0"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
}

export default App;
