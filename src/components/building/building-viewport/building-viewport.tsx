import { FC, useRef, useEffect, useState } from "react";
import { useAppContext } from "../../../middleware/context-provider";

export const BuildingViewport: FC = () => {
  const [state, dispatch] = useAppContext();
  const containerRef = useRef(null);
  const { user, building } = state;

 // const buildingDateFromLocal = JSON.parse(localStorage.getItem("buildingData") || "");

 useEffect(() => {
    const container = containerRef.current;

    //const buildingData = building ? building : buildingDateFromLocal;
     if (container && user) {
      if(building) {
        dispatch({ type: "START_BUILDING", payload: { container, building } });
      }
    }
  }, [user, building]);


  return (
    <>
      <div className="full-screen" style={{ height: '80%' }} ref={containerRef} />
    </>
  );
};
