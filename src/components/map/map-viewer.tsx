import { FC, useRef, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppContext } from "../../middleware/context-provider";
import { Button } from "@mui/material";
import "./map-viewer.css";
import { GisParameters, Building, LngLat } from "../../types";
import { User } from "firebase/auth";
import { BuildingBottomMenu } from "../building/bottom-menu/building-bottom-menu";
import modelImage from '../../assets/images/model1.png';

import { Storage } from "./../../firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";

export const MapViewer: FC = () => {
  const [state, dispatch] = useAppContext();
  const containerRef = useRef(null);
  const thumbnailRef = useRef(null);
  const [isCreating, setIsCreating] = useState(false);
  const { user, building } = state;

  const [ storageArr, setStorageArr ] = useState<any[]>([]);

  const allListref = ref(Storage);

  const redirect = useNavigate();

  const onToggleCreate = () => {
    setIsCreating(!isCreating);
  };

  const onLogout = () => {
    dispatch({ type: "LOGOUT" });
  }

  // const componentDidUpdate = () => {
  //   if (user) {
  //     dispatch({ type: "UPDATE_USER", payload: user });
  //   }
  // }

  const onCreate = () => {
    if (isCreating) {
      dispatch({ type: "ADD_BUILDING", payload: user });
      setIsCreating(false);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container && user) {
      const thumbnail = thumbnailRef.current;
      // dispatch({ type: "START_MAP", payload: { container, user, thumbnail } });
    }
   // console.log(user);

   listAll(allListref).then((response) => {
    const data = response.items.map((item,ind) => {
      return {id:item.name, name:`Demo ${ind+1}`, image:modelImage};
    })
    setStorageArr(data);
   })

  }, []);

  if (!user) {
    return <Navigate to="/login" />;
  }

  // if (building) {
  //   // console.log("Shail Building : "+ JSON.stringify(building));
  //   if(building.uid){
  //     const url = `/building/?id=${building.uid}`;
  //     return <Navigate to={url} />;
  //   } else {
  //     return <Navigate to={'/map'} />;
  //   }
  // }

  // const modelListArray = [
  //   { id: "1", "uid": "1", "userID": "1", image: modelImage, "name": "S", downloadUrl: "https://firebasestorage.googleapis.com/v0/b/frontend-bim.appspot.com/o/MAD_SCIENTIST_212.ifc-73355291.20000029?alt=media&token=9e52639d-13a0-4699-b384-d8d30a49676b", models: { id: "m1", name: "Model 1" } },
  //   { id: "2", "uid": "1", "userID": "1", image: modelImage, "name": "S", downloadUrl: "https://firebasestorage.googleapis.com/v0/b/frontend-bim.appspot.com/o/MAD_SCIENTIST_212.ifc-73355291.20000029?alt=media&token=9e52639d-13a0-4699-b384-d8d30a49676b", models: { id: "m2", name: "Model 2" } },
  //   { id: "3", "uid": "1", "userID": "1", image: modelImage, "name": "S", downloadUrl: "https://firebasestorage.googleapis.com/v0/b/frontend-bim.appspot.com/o/MAD_SCIENTIST_212.ifc-73355291.20000029?alt=media&token=9e52639d-13a0-4699-b384-d8d30a49676b", models: { id: "m3", name: "Model 3" } },
  // ];

  //const modelsArr = [];
  // const modelsArr = localStorage.getItem("buildingData") ? JSON.parse(localStorage.getItem("buildingData") || "").models: false || 
  // [
  //   //{ id: "COMPLETE.ifc-7844.800000011921", name: "Train Station", image: modelImage},
  //   { id: "programme.ifc-133984.70000004768", name: "Home", image: modelImage},
  //   { id: "AP-A3H-TH-TR305-TU-1001-0 (1).ifc-6206089.299999952", name: "Tunnel", image: modelImage}
  // ];

  const modelsArr = storageArr;

  const redirectClick = (event: any) => {
    const id = event.currentTarget.id;
    const lat = null;
    const lng = null;
    const userID = user.uid;
    console.log("userID = " + userID);
    const buildingData = { userID, lat, lng, uid: "", name: "", models: storageArr };
    localStorage.setItem('modelId', id);
    localStorage.setItem('buildingData', JSON.stringify(buildingData));
    const url = `/building/?id=${id}`;
    // alert(url);
    dispatch({ type: "ADD_BUILDING", payload: buildingData });
    // dispatch({ type: "UPDATE_USER", payload: user });

    return redirect(url);
  };

  return (
    <>

      <div className="button-container">
        <Button style={{ color: '#fff' }} onClick={onLogout}>Log out</Button>
      </div>
      <div className="modelsListContainer">
        <h1>Models List</h1>
        <div className="modelsContainer">
          {
            modelsArr.map((md: any, ind: number) => (
              <div key={ind} id={md.id} onClick={redirectClick} className="modelBox">
                {md.image && <img src={md.image} />}
                <h2>
                  {md.name}
                </h2>
              </div>
            )
            )
          }
        </div>
      </div>

    </>
  );
};
