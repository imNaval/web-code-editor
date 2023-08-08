import React, { useState } from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/css/css'
import 'codemirror/mode/javascript/javascript'
import {Controlled as ControlledEditor} from 'react-codemirror2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompressAlt, faExpandAlt } from '@fortawesome/free-solid-svg-icons'

let openCount = 3;

const Editor = (props) => {
    const {
        language,
        displayName,
        value,
        onChange
    } = props;

    const [open, setOpen] = useState(true)
    // const [openCount, setOpenCount] = useState(3);

    function handleChange(editor, data, value){
        onChange(value);
    }

  return (
    <div className={`editor-container ${!open && 'collapsed' }`}>
        <div className='editor-title'>
            {displayName}
            <button 
                type='button'
                className='expand-collapse-btn'
                onClick={()=>{
                    setOpen(prev => {
                        if(prev === false){
                            ++openCount;
                            return !prev
                        }
                        else if(openCount > 1){
                            --openCount;
                            return !prev
                        }
                        else return prev
                        // return !prev
                        })
                    }}
            >
                <FontAwesomeIcon icon={open ? faCompressAlt : faExpandAlt} />
            </button>
        </div>

        <ControlledEditor 
            onBeforeChange={handleChange}
            value={value}
            className='code-mirror-wrapper'
            options={{
                lineWrapping: true,
                lint: true,
                mode: language,
                theme: "material",
                lineNumbers: true,
            }}
        />
    </div>
  )
}

export default Editor