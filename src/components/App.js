import React, { useState, useEffect } from "react";
import Editor from "./Editor";
import useLocalStorage from "./hooks/useLocalStorage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faSave } from '@fortawesome/free-solid-svg-icons'


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
    let resizable = document.getElementById('top');
    setInitialPos(e.clientY);
    setInitialSize(resizable.offsetHeight);
  }
  const resize = (e) => {
    e.preventDefault();
    let resizable = document.getElementById('top');
    const newHeight = parseInt(initialSize) + parseInt(e.clientY - initialPos);
    resizable.style.height = newHeight > 100 && newHeight < window.innerHeight-100  ? newHeight + "px" : resizable.style.height
  }

  ////clear
  function clearSrcDoc(){
    setHtml("")
    setCss("")
    setJs("")
  }

  ////download code
  const [code , setCode] = useState("")
  function downloadCode(){
    if(html==="" && css === "" && js === "") return;
    setCode(
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code with Navwe</title>
    <style>
      ${css}
    </style>
  </head>
  <body>
    ${html}
    <script>
      ${js}
    </script>
  </body>
</html>`
    )

    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "code.html";
    link.href = url;
    link.click();
  }

  return (
    <div className="parent">
      <div className="header">
        <button id="clr" className="icon" onClick={clearSrcDoc}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <button id="save" className="icon" onClick={downloadCode}>
          <FontAwesomeIcon icon={faSave} />
        </button>
      </div>
      <div className="pane top-pane" id="top" resizable='true'>
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

      <div className="pane" id="bottom" resizable='true'>
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
