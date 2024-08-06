import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Scene} from '../../types';

interface SceneState {
  scenes: Scene[];
  isLoading: boolean;
}

const initialState: SceneState = {
  scenes: [],
  isLoading: false,
};

const sceneSlice = createSlice({
  name: 'scenes',
  initialState,
  reducers: {
    setScenes: (state, action: PayloadAction<Scene[]>) => {
      state.scenes = action.payload;
      state.isLoading = false;
    },
    addScene: (state, action: PayloadAction<Scene>) => {
      state.scenes.push(action.payload);
    },
    updateScene: (state, action: PayloadAction<Scene>) => {
      const index = state.scenes.findIndex(
        scene => scene.id === action.payload.id,
      );
      if (index !== -1) {
        state.scenes[index] = action.payload;
      }
    },
    deleteScene: (state, action: PayloadAction<string>) => {
      state.scenes = state.scenes.filter(scene => scene.id !== action.payload);
    },
    setSceneLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {setScenes, addScene, updateScene, deleteScene, setSceneLoading} =
  sceneSlice.actions;
export default sceneSlice.reducer;
