
import { getApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, } from "firebase/auth";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import { Events } from "../../middleware/event-handler";
import { Building, Model } from "../../types";
import { getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";
import { buildingHandler } from "../building/building-handler";
import modelImage from '../../assets/images/model1.png';


export const databaseHandler = {
  login: () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  },

  logout: () => {
    const auth = getAuth();
    signOut(auth);
  },

  deleteBuilding: async (building: Building, events: Events) => {
    const id = building.uid;
    const dbInstance = getFirestore(getApp());
    await deleteDoc(doc(dbInstance, "buildings", id));
    const appInstance = getApp();
    const storageInstance = getStorage(appInstance);
    const ids: string[] = [];
    for (const model of building.models) {
      ids.push(model.id);
      const fileRef = ref(storageInstance, model.id);
      await deleteObject(fileRef);
    }
    await buildingHandler.deleteModels(ids);
    events.trigger({ type: "CLOSE_BUILDING" });
  },

  updateBuilding: async (building: Building) => {
    const dbInstance = getFirestore(getApp());
    await updateDoc(doc(dbInstance, "buildings", building.uid), { ...building, });
  },
  updateModel: async (id:string, building: Building, events: Events) => {
    localStorage.setItem('modelId', id);
    await buildingHandler.refreshModels(building, events);
  },
  uploadModel: async (model: Model, file: File, building: Building, events: Events) => {
    const appInstance = getApp();
    const storageInstance = getStorage(appInstance);
    const fileRef = ref(storageInstance, model.id);
    localStorage.setItem('modelId', fileRef.fullPath);
    const buildingLocalStorage = JSON.parse(localStorage.getItem("buildingData") || "");
    buildingLocalStorage.models.push({ id: fileRef.fullPath, name: fileRef.name, image: modelImage });
    localStorage.setItem('buildingData', JSON.stringify(buildingLocalStorage));
    await uploadBytes(fileRef, file);
    await buildingHandler.refreshModels(building, events);

    // Use to change building data in database
    //events.trigger({ type: "UPDATE_BUILDING", payload: building });
  },
  deleteModel: async (model: Model, building: Building, events: Events, navigate: any) => {
    const appInstance = getApp();
    const storageInstance = getStorage(appInstance);
    const modelsFromLS = JSON.parse(localStorage.getItem("buildingData") || "").models;
    let needToDelete = true;
    modelsFromLS.length < 3 ? needToDelete = false : needToDelete = true;

    if (needToDelete) {
      const fileRef = ref(storageInstance, model.id);
      // Getting model list from LS
      const buildingDataParsed = JSON.parse(localStorage.getItem("buildingData") || "");
      // Filtering out the list in which models needs to delete
      const filterBuildingList = buildingDataParsed.models.filter((md: Model) => md.id !== model.id);
      // Getting model Id and storing the new model id
      let modelId = (localStorage.getItem("modelId") || "");
      modelId = filterBuildingList[0].id;
      localStorage.setItem('modelId', modelId);

      // Setting up buildingData in LS
      const buildingNewBuilding = { ...buildingDataParsed, models: filterBuildingList };
      localStorage.setItem('buildingData', JSON.stringify(buildingNewBuilding));
      alert('File Deleted Successfully');
      // deleting file from firebase
      await deleteObject(fileRef);
      //await buildingHandler.deleteModels([model.id]);
      await buildingHandler.refreshModels(buildingNewBuilding, events);
      //navigate('/map');
    } else {
      alert('File cannot be deleted');
    }
    // events.trigger({ type: "UPDATE_BUILDING", payload: building });
  }

};
