import { Link, Route, Switch } from "react-router-dom";
import { useContext } from "react";
import TheContext from "../TheContext";
import Auth from "./Auth";

function Header(props) {
  const logOut = () => {
    localStorage.removeItem("token");
    setUser({});
  };

  let { user, setUser, getUser } = useContext(TheContext);

  return (
    <header className="homepage-header">
      <div className="homepage-title">
        <img className="logo" src="/logo.jpg" />
      </div>
      <div className="navbar">
        <nav className="nav-div">
          <Link to="/">Home</Link>
          {/* <Link to="/all-posts">Tips & Tricks</Link>
                {user?.name ? */}
          <>
            {/* <Link to="/new-post">Attractions</Link>
                        <Link to="/deals">Deals</Link> */}
            <Link to="/new-thread">New Thread</Link>
            <Link to="/all-threads">All Threads</Link>
            <Link to="/profile">Profile</Link>
          </>{" "}
        </nav>
        <div id="auth">
          {user?.name ? (
            <div className="header-login">
              <h4>{user?.name}</h4>
              <button onClick={logOut}>Log Out</button>
            </div>
          ) : (
            <Auth getUser={getUser} />
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
