import React from 'react'
import NavigationBar from './NavigationBar'
import Feed from './Feed'
import Header from './Header'

const Minds = () => {
  return (
    <div style={{maxWidth: "1000px", display: "flex", margin: "auto"}}>
      <NavigationBar/>
      <div style={{display: "flex", flexDirection: "column", width: "100%", marginLeft: "65px", borderRight: "1px solid var(--border-color)"}}>
        <Header/>
        <Feed/>
      </div>
    </div>
  )
}

export default Minds