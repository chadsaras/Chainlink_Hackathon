import logo from './logo.svg';
import './App.css';
import Footer from './Footer.js';
import Header from './Header.js';
import Main from './Main.js';
import TopNav from './TopNav.js';
import Buy from './Buy.js';
import Dropdown from './Dropdown';


function App(){
  return (
    <div className='App'>
    
      <Header />
      <Dropdown/>
      <TopNav />
      <Main />
      <Buy/>
      <Footer />
  
    </div>
  )

}




export default App;
