import React from "react";



class ClassComponent extends React.Component {
render(){ 
return(
    <>
 <h1> This is class component </h1>
    <button> Click </button>
    <br/>
    <label for="Fname"> firstname :  </label>
    <br/>
    <input name="Fname" placeholder="Enter the query" />

    

    </>
)

}


}

export default ClassComponent;