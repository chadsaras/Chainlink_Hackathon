import logo from './logo.svg';
import './App.css';
import LoginPage from './login';
import Header from './header';



function App() {
  return (
    <div style={{
      bgcolor: "teal",
      font: "small-caption"
    }}
    >
  
    <Header/>
    <LoginPage/>
   
    
    </div>
  );
}

export default App;
