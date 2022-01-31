/* eslint-disable react/jsx-filename-extension */
import React from 'react'
import ReactLoading from 'react-loading'
import './loader.css'

function Loader() {
  // const [showloader,setShowLoader]=useState(undefined);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '300px' }}>
      <ReactLoading type="spinningBubbles" color="green" height="5%" width="5%" />
    </div>
  )
}

export default Loader
