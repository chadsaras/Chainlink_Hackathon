const Buy = () => {
    return (
       <div styl={{
        height: 'calc(100vh - 220px)',
       background: "#FFC0CB",
       display: "flex",
       alignItems: "left",
       justifyContent: "center",
       fontSize: "50px",
       fontWeight: "bold",
       color: "olive",


       }} >
            <div class="container">
    <div class="image-button-container">
      <img src="image1.jpg" alt="Image 1" width="200" height="150"/>
      <button class="button">Buy</button>
    </div>
    <div class="image-button-container">
      <img src="image2.jpg" alt="Image 2" width="200" height="150"/>
      <button class="button" href="">Buy</button>
    </div>
    <div class="image-button-container" >
      <img src="image3.jpg" alt="Image 3" width="200" height="150"/>
      <button class="button">Buy</button>
    </div>
  </div>

       </div>

    )


}

export default Buy;
