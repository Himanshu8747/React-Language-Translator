import { useState } from 'react';
import languages from '../languages';

const Translator = () => {
  const [fromText,setFromText] = useState("");  
  const [toText,setToText] = useState("");  
  const [fromLanguage,setFromLanguage] = useState("en-GB");  
  const [toLanguage,setToLanguage] = useState("hi-IN");
  const [loading,setLoading] = useState(false);
  const handleExchange=()=>{
    let tempValue = fromText;
    setFromText(toText);
    setToText(tempValue);

    let tempLanguage = fromLanguage;
    setFromLanguage(toLanguage);
    setToLanguage(tempLanguage); 
  }

  const copyContent=(text)=>{
    navigator.clipboard.writeText(text);
  }

  const utterText=(text,language)=>{
    const synth =  window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    synth.speak(utterance);
  }
  
  const handleIconClick=(target,id)=>{
    if(target.classList.contains('fa-copy')){
        if(id==="from"){
            copyContent(fromText);
        }
        else{
            copyContent(toText)
        }
    }
    else{
        if(id==="from"){
            utterText(fromText,fromLanguage);
        }
        else{
            utterText(toText,toLanguage);
        }
    }
  }

  const handleTranslate=()=>{
    setLoading(true);
    let url = `https://api.mymemory.translated.net/get?q=${fromText}!&langpair=${fromLanguage}|${toLanguage}`;
    fetch(url).then((res)=>res.json()).then((data)=>{
        setToText(data.responseData.translatedText);
        setLoading(false);
    })
  }

  return (
    <>
        <div className="wrapper">
            <div className="text-input">
                <textarea name="from" value={fromText} id="from" placeholder="Enter Text.." onChange={(e)=>setFromText(e.target.value)} className="from-text"/>
                <textarea name="to" value={toText} id="to" className="to-text" readOnly/>
            </div>
            <ul className="controls">
                <li className="row from">
                    <div className="icons">
                    <i id="from" className="fa-solid fa-volume-high" onClick={(e)=>handleIconClick(e.target,'from')}></i>
                    <i id="from" onClick={(e)=>handleIconClick(e.target,'from')} className="fa-solid fa-copy"></i>
                    </div>
                    <select value={fromLanguage} onChange={(e)=>setFromLanguage(e.target.value)}>
                        {Object.entries(languages).map(([code,name])=>(
                            <option key={code} value={code}>{name}</option>
                        ))}
                    </select>
                </li>
                <li className="exchange" onClick={handleExchange}>
                    <i className="fa-sharp fa-solid fa-right-left"></i>
                </li>
                <li className="row to">
                    <select value={toLanguage} onChange={(e)=>setToLanguage(e.target.value)}>
                        {Object.entries(languages).map(([code,name])=>(
                            <option key={code} value={code}>{name}</option>
                        ))}
                    </select>
                    <div className="icons">
                        <i id="to" className="fa-solid fa-copy" onClick={(e)=>handleIconClick(e.target,'to')}></i>
                        <i id="to" className="fa-solid fa-volume-high" onClick={(e)=>handleIconClick(e.target,'to')}></i>
                    </div>
                </li>
            </ul>
        </div>
        <button onClick={handleTranslate}>{loading ? "Translating" : "Translate Text"}</button>
    </>
  )
}

export default Translator