import React from 'react';
import './App.scss';
import NavBar from "./components/Navbar";
import { useAuth0 } from "./react-auth0-wrapper";

function App() {
  const { loading } = useAuth0();
  const [currentContent, setCurrent] = React.useState('');
  const [buttonContent, setButtonContent] = React.useState('Start Speaking');
  const [notesContent, setNotesContent] = React.useState(null);
  const [toggleEffect, setToggleEffect] = React.useState(true);
  
  React.useEffect(() => {
   const getAllNotes = () => {
    var notes = [];
    var key;
    for (var i = 0; i < localStorage.length; i++) {
      key = localStorage.key(i);

      if(key.substring(0,5) === 'note-') {
        notes.push({
          date: key,
          content: localStorage.getItem(localStorage.key(i))
        });
      } 
    }
    return notes;
  }
   setNotesContent(getAllNotes);
    }, [toggleEffect]);

  try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
  }
  catch(e) {
    console.error(e);
  };
  
  recognition.onstart = () => { 
  setButtonContent('Voice recognition activated. Try speaking into the microphone.');
  };

  recognition.onspeechend = () => {
    setButtonContent('You were quiet for a while so voice recognition turned itself off. Click again to start');
  };

  recognition.onerror = (event) => {
    if(event.error === 'no-speech') {
      setButtonContent('No speech was detected. Try again.');  
    };
  }
  
  var noteContent = '';
  
  recognition.onresult = (event) => {

  var current = event.resultIndex;

  var transcript = event.results[current][0].transcript;
  noteContent += transcript;
  setCurrent(noteContent);
  };
  
  const handleStartClick=()=>{
    recognition.start();
  };
  
  const saveNote = (dateTime, content) => {
    localStorage.setItem('note-' + dateTime, content);
  };
  
  const handleSaveNotes = () => {
    recognition.stop();
    if(currentContent){
      saveNote(new Date().toLocaleString(), currentContent);
      setToggleEffect(!toggleEffect);
    }
    else{
      alert('Empty Content')
    }
  };
  
  const handleDeleteClick = (e,data) => {
    if(data){
      console.log(data);
      localStorage.removeItem(data);
      setToggleEffect(!toggleEffect);
    }
  }

  if (loading) {
    return (
      <div>Loading...</div>
    );
  }
  
  return (
    <div className="App">
      <header>
        <NavBar />
      </header>
      <button className="App__button" onClick={handleStartClick}>{buttonContent}</button>
      <div className="App__auto-typing">
        {currentContent}
      </div>
<button className="App__button" onClick={handleSaveNotes}>Save Notes</button>
      <div className="App__notes">
        {notesContent && notesContent.map((note,i) => {
          return(
            <div className="App__notes_content" key={i}>{i+1}) {note.content}
              <button className="App__notes_content_button" key={i} type='button' onClick={e => handleDeleteClick(e,(note.date))}>delete</button>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default App;
