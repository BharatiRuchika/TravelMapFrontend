import ReactMapGL,{Marker,Popup} from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import { Room, Star, StarBorder } from "@material-ui/icons";
import './app.css';
import axios from "axios";
import Register from './components/Register';
import Login from './components/Login';
// import mapboxgl from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useState, useEffect } from 'react';
import { format } from "timeago.js";
// import {Room} from "@material-ui/icons";

const App=()=> {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  const [viewport, setViewport] = useState({
    latitude: 19.901054,
    longitude: 75.352478,
    width:"100vw",
    height:"100vh",
    zoom: 8
  });
  const [showRegister, setShowRegister] = useState(false);
const [showLogin, setShowLogin] = useState(false);
  const [pins, setPins] = useState([]);
  const [star, setStar] = useState(0);
  const [currentPlaceId,setCurrentPlaceId] = useState(null);
  const [currentUser,setCurrentUser] = useState(null);
  const [newplace,setNewPlace] = useState(null);
  const [title,setTitle] = useState(null);
  const [desc,setDesc] = useState(null);
  const [reting,setRating] = useState(0);
  const togglePopup = ()=>{
    console.log(false);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    // const newPin = {
    //   username: currentUsername,
    //   title,
    //   desc,
    //   rating: star,
    //   lat: newplace.lat,
    //   long: newplace.long,
    // };

    // try {
    //   const res = await axios.post("http://localhost:3000/pins/savepin", newPin);
    //   setPins([...pins, res.data]);
    //   setNewPlace(null);
    // } catch (err) {
    //   console.log(err);
    // }
  };
  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("https://travelmapback.herokuapp.com/pins/getpins");
        console.log("allpins",allPins.data);
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);
 
 const handleMarkerClick = (id,lat,long)=>{
   setCurrentPlaceId(id,long,lat);
   setViewport({...viewport,latitude:lat,longitude:long})
 }
 const handleAddClick = (e)=>{
   console.log("e",e);
   const [long,lat] = e.lngLat;
   setNewPlace({
     lat,long
   })
 }
 const handleLogout = () => {
  setCurrentUsername(null);
  myStorage.removeItem("user");
};

  return (
    <div className="App">
     
 <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      // width="100%"
      // height="100%"
      onViewportChange={(viewport) => setViewport(viewport)}
     
      onDblClick = {handleAddClick}
      transitionDuration="200"
      >
         {pins.map((p)=>(
           <>
      <Marker latitude={p.lat} longitude={p.long} offsetLeft={-50} offsetTop={-10}>
      <div>You are here</div>
      <Room style={{fontSize:viewport.zoom*7}} onClick={()=>handleMarkerClick(p._id,p.lat,p.long)}/>
    </Marker>
     {p._id===currentPlaceId?
     <>
    <Popup
                key={p._id}
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
                anchor="left"
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup></>:<></>}

    </>))}
    {newplace?<>
    <Popup latitude={newplace.lat}
            longitude={newplace.long}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
                anchor="left"
              >
                
                <div>
                <form onSubmit={handleSubmit} >
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Say us something about this place."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setStar(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>
            
                
                
                </Popup></>:<></>}
    {/* <Popup
                key={p._id}
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
                anchor="left"
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup> */}
              
              {currentUsername?(<button onClick={handleLogout}className="button logout">Logout</button>):(<div className="buttons">
                <button onClick={()=>{setShowLogin(true)}} className="button login">Login</button>
              <button onClick={()=>setShowRegister(true)} className="button register">Register</button>
              </div>)}
              {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setCurrentUsername={setCurrentUsername}
            myStorage={myStorage}
          />
        )}
        
   </ReactMapGL>
 </div>
  );
}

export default App;
