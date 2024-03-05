import Header from './Components/Header'
import NavigationBar from './Components/NavigationBar'
import './Shared/Styles/Variables.scss'

function App() {

  return (
    <div style={{maxWidth: "1000px", display: "flex", margin: "auto"}}>
      <NavigationBar/>
      <Header/>
    </div>
  )
}

export default App
