import React from 'react'

function NoteCard(props) {

    const handleClick = () => {
        props.onClick(props.name);
      }

      const handleDescription = () => {
        props.getDescription(props.description)
      }

  return (
    <>
    <div className='note-container' onClick={() => {
        handleClick()
        handleDescription()
    }}>
        <div>
        <h2>{props.name}</h2>
        <div className='description-flex'>
        <p className='description'>{props.description}</p>
        </div>
        <p className='last-saved'>Last Saved {props.saved}</p>
            <form action={`/deleteNote/${props.email}/${props.name}`} method='POST'>
            <button type='submit' className='delete-btn'>Delete</button>
            </form>
            </div>
    </div>
    </>
  )
}

export default NoteCard