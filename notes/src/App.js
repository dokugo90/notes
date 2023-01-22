import './App.css';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import NoteCard from './components/note';
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAc7MbZLYElOI-vQntqfYz8UfEeOcp28fQ",
  authDomain: "todolist-7dad5.firebaseapp.com",
  projectId: "todolist-7dad5",
  storageBucket: "todolist-7dad5.appspot.com",
  messagingSenderId: "1097652774962",
  appId: "1:1097652774962:web:d28bdd0f8228fc2854342b"
};

function App() {
  const [currentNote, setCurrentNote] = useState("Select Note");
  const handleClick = useCallback((name) => {
    setCurrentNote(name)
}, [])

const handleDescription = useCallback((desc) => {
  setDescription(desc)
}, [])
const creater = useRef();
const [hide, setHide] = useState(true)
const [noteDescription, setDescription] = useState("");
const [noteTitle, setTitle] = useState('');
const [finalDesc, setFinalDesc] = useState("")
const rotater = useRef();
const [disable, setDisable] = useState(false);
const drawer = useRef();
const [menuShow, setShowMenu] = useState(false);
const [overlay, showOverlay] = useState(false);
const [icon, setIcon] = useState("menu");
const formRef = useRef();
const [color, setColor] = useState("#800080")
const [textColor, setTextColor] = useState("#00000");
const [bold, setBold] = useState("lighter")
const [italic, setItalic] = useState("normal");
const [username, setUsername] = useState("Sign In");
const [profilePic, setProfilePic] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
const [email, setEmail] = useState("");
const [isSignedIn, setIsSignedIn] = useState(false);
const [canCreate, setCanCreate] = useState(false);
const noteRef = useRef();

  const [notes, setNotes] = useState([])

function Modal() {
  if (hide) {
    creater.current.classList.add("show-note")
    rotater.current.classList.add("rotate")
    setHide(false)
  } else {
    creater.current.classList.remove("show-note")
    rotater.current.classList.remove("rotate")
    setHide(true)
  }
}

function Authentication() {
  return {
    signIn: async function() {
      let provider = new GoogleAuthProvider();
      await signInWithPopup(getAuth(), provider)
    },
    authState: async function() {
      onAuthStateChanged(getAuth(), () => {
        if (getAuth().currentUser.email != null) {
              setUsername(getAuth().currentUser.displayName)
              setProfilePic(getAuth().currentUser.photoURL)
              setEmail(getAuth().currentUser.email)
              setIsSignedIn(true)
        } else {
              setUsername("Sign In")
              setProfilePic("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
              setEmail("")
              setIsSignedIn(false)
        }
      })
    },
    signUserOut: async function() {
      signOut(getAuth());
      window.location.reload();
    }
  }
}

useEffect(() => {
  let ignore = false;

  if (!ignore) {
    Authentication().authState();
  };
  return () => {
    ignore = true
  }
}, [])

async function getData() {
    try {
      let req = await fetch(`/allNotes/${email}`);
    let res = await req.json();
    for (let i = 0; i < res.length; i++) {
      const newNotes = [...notes, ...res.map(({title, description, saved})=>({title,description, saved}))]
      setNotes(newNotes);
    }
    } catch(err) {
      console.log(err)
    }
}

function handleSubmit(e) {
  formRef.current.submit();
}

window.addEventListener("resize", () => {
  if (document.documentElement.clientWidth < 832) {
    setShowMenu(false)
  }
})

useEffect(() => {
  let ignore = false;

  if (!ignore) {
    if (document.documentElement.clientWidth < 832) {
      setShowMenu(false)
    }
  }

  return () => {
    ignore = true;
  };
}, [])

useEffect(() => {
  let ignore = false;

  if (email.includes("@") && !ignore) {
    getData()
    localStorage.setItem("email", email)
  }
  return () => {
    ignore = true;
  }
}, [email])

//drawer.current.classList.add("hide")

useEffect(() => {

  if (currentNote == "Select Note") {
    setDisable(true);
} else {
  setDisable(false)
}
}, [currentNote])

/*function createTask() {
  notes.push({title: noteTitle, description: finalDesc})
  setNotes([...notes]);
}*/

function handleCommands() {
  return {
    copy: function() {
      document.execCommand("copy")
    },
    undo: function() {
      document.execCommand("undo")
    },
    redo: function() {
      document.execCommand("redo")
    },
    print: function() {
      document.execCommand("print")
    }
  }
}

const handleFullscreen = () => {
  if (noteRef.current.requestFullscreen) {
    noteRef.current.requestFullscreen();
  } else if (noteRef.current.mozRequestFullScreen) {
    noteRef.current.mozRequestFullScreen();
  } else if (noteRef.current.webkitRequestFullscreen) {
    noteRef.current.webkitRequestFullscreen();
  } else if (noteRef.current.msRequestFullscreen) {
    noteRef.current.msRequestFullscreen();
  }
}

  return (
    <>
    <i className='menu material-icons' onClick={() => {
      if (!menuShow) {
        drawer.current.classList.add("show-menu")
        setShowMenu(true)
        showOverlay(true)
        setIcon("close")
      } else {
        drawer.current.classList.remove("show-menu")
        setShowMenu(false)
        showOverlay(false)
        setIcon("menu")
      }
    }}>{icon}</i>
    <div ref={drawer} className='drawer'>
      <div className='add-note-container'>
      <h1 style={{paddingLeft: 20}}>Notes</h1><br />
      <button onClick={() => {
        Modal()
      }} className='add-note' ref={rotater}>+</button>
      </div>
      <div className='notes-flex-container'>
        {
          notes.map((item, index) => (
            <NoteCard name={item.title} description={item.description} email={email} saved={item.saved} onClick={handleClick} getDescription={handleDescription} />
          ))
          }
          </div>
    </div>
    <div className='sign-in-btn-flex'>
    
        </div>
        <div className='user-account-flex'>
    <div className='user-account'>
    <img className='profile-url' src={profilePic}></img>
    <h2 className='username'>{username}</h2>
    {
      isSignedIn ?
      <button className='sign-in-btn' onClick={() => Authentication().signUserOut()}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{fill: "rgba(72, 133, 237, 1)"}}>
      <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z">
        </path></svg><span className='one'>S<span className='two'>i</span><span className='three'>g</span><span className='one'>n</span> <span className='five'>o</span><span className='two'>ut</span></span></button>
        : 
        <button className='sign-in-btn' onClick={() => Authentication().signIn()}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{fill: "rgba(72, 133, 237, 1)"}}>
        <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z">
          </path></svg><span className='one'>S<span className='two'>i</span><span className='three'>g</span><span className='one'>n</span> <span className='five'>i</span><span className='two'>n</span></span></button>
        }
    </div>
    </div>
    <h1 className='notes-text' style={{textAlign: "center"}}>{currentNote} 
    <form action={`/saveNote/${email}/${currentNote}/${noteDescription}`} method='POST' ref={formRef}>
      {
        disable ?
        <></>
        :
        <i className=' save material-icons' onClick={() => handleSubmit()}>cloud_upload</i>
      }
      </form>
    </h1>
    <div className='textarea-flex'>
    <textarea ref={noteRef} style={{backgroundColor: localStorage.getItem("bgColor") ? localStorage.getItem("bgColor") : color, 
    color: localStorage.getItem("textColor") ? localStorage.getItem("textColor") : textColor, 
    fontWeight: localStorage.getItem("bold") ? localStorage.getItem("bold") : bold, 
    fontStyle: localStorage.getItem("italic") ? localStorage.getItem("italic") : italic}} disabled={disable} value={noteDescription} onChange={e => setDescription(e.target.value)}></textarea>
    </div>
    <div className='control-panel-flex'>
    <div className='control-panel'>
        <i className='material-icons' onClick={() => handleCommands().undo()}>undo</i>
        <i className='material-icons' onClick={() => handleCommands().redo()}>redo</i>
        <i className='material-icons' onClick={() => handleCommands().print()}>print</i>
        <i className='material-icons' onClick={() => {
          if (bold == "lighter") {
            setBold("900")
            localStorage.setItem("bold", bold)
          } else {
            setBold("lighter")
            localStorage.setItem("bold", bold)
          }
        }}>format_bold</i>
        <i className='material-icons' onClick={() => {
          if (italic == "normal") {
            setItalic("italic")
            localStorage.setItem("italic", italic)
          } else {
            setItalic("normal")
            localStorage.setItem("italic", italic)
          }
        }}>format_italic</i>
        <input value={localStorage.getItem("bgColor") ? localStorage.getItem("bgColor") : color} onChange={e => {
          setColor(e.target.value);
          localStorage.setItem("bgColor", color)
          }} className='color-picker' type="color"></input> 
        <input value={localStorage.getItem("textColor") ? localStorage.getItem("textColor") : textColor} onChange={e => {
          setTextColor(e.target.value);
          localStorage.setItem("textColor", textColor)
          }} className='color-picker' type="color"></input>
    </div>
    </div>
    <div className='fullscreen-flex'>
      <div onClick={() => handleFullscreen()} className='fullscreen-container'>
        <i className='material-icons'>fullscreen</i>
        <p>Fullscreen</p>
      </div>
    </div>
    <div ref={creater} className='create-note'>
      <h2 style={{textAlign: "center", }}>Create Note</h2>
        <form className='create-form' action={`/note/${email}`} method='POST'>
        <input name='title' onChange={e => setTitle(e.target.value)} type="text" placeholder='title'></input><br />
        <input name='desc' onChange={e => setFinalDesc(e.target.value)} type="text" placeholder='start your note'></input><br />
        {
          isSignedIn ?
          <button type='submit'>Create Note</button>
          : <p onClick={() => Authentication().signIn()}>Sign in</p>
        }
        </form>
    </div>
    {
      overlay ?
      <div className='overlay' onClick={() => {
        drawer.current.classList.remove("show-menu")
        setShowMenu(true)
        showOverlay(false)
      }}></div>
      : <></>
    }
    </>
  );
}

const app = initializeApp(firebaseConfig);

export default App;
