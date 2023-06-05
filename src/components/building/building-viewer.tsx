import { FC, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { BuildingTopbar } from "./side-menus/building-topbar";
import { CssBaseline } from "@mui/material";
import { BuildingDrawer } from "./side-menus/building-drawer";
import { getDrawerHeader } from "./side-menus/mui-utils";
import { useAppContext } from "../../middleware/context-provider";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { BuildingFrontMenu } from "./front-menu/building-front-menu";
import { FrontMenuMode } from "./front-menu/types";
import { BuildingViewport } from "./building-viewport/building-viewport";
import { BuildingBottomMenu } from "./bottom-menu/building-bottom-menu";
import { Building } from "../../types";

export const BuildingViewer: FC = () => {
  const [width] = useState(240);
  const [sideOpen, setSideOpen] = useState(false);
  const [frontOpen, setFrontOpen] = useState(false);
  const [frontMenu, setFrontMenu] = useState<FrontMenuMode>("BuildingInfo");
  let location = useLocation();
  const [{ building, user }] = useAppContext();
  const [state, dispatch] = useAppContext();
  const redirect = useNavigate();
  if (!building) {
    // return <Navigate to="/map" />;
  }

  let pattern = /id=[a-zA-Z0-9\S]+/gm;
  const includesId = location.search.slice(1).split('&').map((query) => pattern.test(query)).includes(true);

  useEffect(() => {
    //if (!user) { redirect("/login") }
    if (!includesId) { redirect("/map")  }
    const building = JSON.parse(localStorage.getItem("buildingData") || "");
    dispatch({ type: "ADD_BUILDING", payload: building });

  }, [user]);


  const toggleFrontMenu = (active = !frontOpen, mode?: FrontMenuMode) => {
    if (mode) {
      setFrontMenu(mode);
    }
    setFrontOpen(active);
  };

  const toggleDrawer = (active: boolean) => {
    setSideOpen(active);
  };

  const DrawerHeader = getDrawerHeader();

  return (
    <Box sx={{ display: "flex", height: '100vh' }}>
      <CssBaseline />
      {/* header */}
      <BuildingTopbar
        width={width}
        open={sideOpen}
        onOpen={() => toggleDrawer(true)}
      />

      <BuildingDrawer
        width={width}
        open={sideOpen}
        onClose={() => toggleDrawer(false)}
        onToggleMenu={toggleFrontMenu}
      />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />

        <BuildingViewport />

        <BuildingFrontMenu
          onToggleMenu={toggleFrontMenu}
          open={frontOpen}
          mode={frontMenu}
        />

        <BuildingBottomMenu />
      </Box>
    </Box>
  );
};
