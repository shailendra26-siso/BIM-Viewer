import { Button, IconButton } from "@mui/material";
import { FC } from "react";
import { useAppContext } from "../../../../middleware/context-provider";
import DeleteIcon from "@mui/icons-material/Clear";
import "./front-menu-content.css";
import { useNavigate } from "react-router-dom";

export const ModelListMenu: FC = () => {
  const [state, dispatch] = useAppContext();
  const navigate = useNavigate();

  const { building, user } = state;
  if (!building || !user) {
    throw new Error("Error: building or user not found");
  }

  const onUploadModel = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.style.visibility = "hidden";
    document.body.appendChild(input);
    input.onchange = () => {
      if (input.files && input.files.length) {
        const file = input.files[0];
        if (!file.name.includes(".ifc")) return;
        const newBuilding = { ...building };
        const len = newBuilding.models.length;
        const id = `${file.name}-${performance.now()}`;
        const model = { name: `Demo ${len+1}`, id };
        newBuilding.models.push(model);
        dispatch({
          type: "UPLOAD_MODEL",
          payload: { building: newBuilding, file, model, },
        });
      }
      input.remove();
    };
    input.click();
  };

  const onDeleteModel = (id: string) => {
    const newBuilding = { ...building };
    if(!(newBuilding.models.length < 3)){
      const model = newBuilding.models.find((model) => model.id === id);
      if (!model) throw new Error("Model not found!");
      newBuilding.models = newBuilding.models.filter((model) => model.id !== id);
      dispatch({
        type: "DELETE_MODEL",
        payload: { building: newBuilding, model, navigate },
      });
    }
    else{
      alert("These model will not be deleted!");
    }
  };

  const onChangeModel = (id: string) => {
    dispatch({
      type: "UPDATE_MODEL",
      payload: { id, building },
    });
  }

  return (
    <div className="full-width">
      {building.models.length ? (
        building.models.map((model, ind) => (
          <div className="list-item" key={ind}>
            <IconButton onClick={() => onDeleteModel(model.id)}>
              <DeleteIcon />
            </IconButton>
            <span className="margin-left cursor-pointer" onClick={() => onChangeModel(model.id)}>{model.name}</span>
          </div>
        ))
      ) : (
        <p>This building has no models!</p>
      )}
      <div className="list-item">
        <Button onClick={onUploadModel} className="submit-button">
          Upload model
        </Button>
      </div>
    </div>
  );
};
