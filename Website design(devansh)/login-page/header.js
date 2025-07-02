const Header = () => {
    return (
      <div
        style={{
          backgroundColor: "beige",
          color: "Teal",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "30px 50px",
          height: "40px"
        }}
      >
        <div style={{ fontSize: "30px", font: "Montserrat", fontWeight: "bold", cursor: "pointer" }}>
          Gaming Scenario
        </div>
        <div style={{ fontSize: "18px", fontWeight: "bold", cursor: "pointer" }}>
          Logout
        </div>
      </div>
    );
  };
  
  export default Header;