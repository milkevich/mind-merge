import React from 'react'
import NavigationBar from './NavigationBar'
import Feed from './Feed'
import MindShareInput from './MindShareInput'

const Minds = () => {
  return (
    <div style={{maxWidth: "935px", display: "flex", margin: "auto", minHeight: "100vh"}}>
      <div style={{display: "flex", flexDirection: "column", width: "100%", borderRight: "1px solid var(--border-color)"}}>
      <NavigationBar/>
      <MindShareInput/>
        <Feed/>
      </div>
    </div>
  )
}

export default Minds