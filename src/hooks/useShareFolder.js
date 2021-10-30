import { useReducer, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { database } from '../firebase'

const ACTIONS = {
    SELECT_FOLDER: "select-folder",
    UPDATE_FOLDER: "update-folder",
    SET_CHILD_FOLDERS: "set-child-folders",
    SET_CHILD_FILES: "set-child-files",
}

export const SHARE_FOLDER = { name: "Shared Drive", id: null, path:[] }

function reducer(state, { type, payload }) {
    switch (type) {
        case ACTIONS.SELECT_FOLDER:
            return {
                folderId: payload.folderId,
                folder: payload.folder,
                childFiles: [],
                childFolders: [],
            }
        case ACTIONS.UPDATE_FOLDER:
            return {
                ...state,
                folder: payload.folder,
            }
        case ACTIONS.SET_CHILD_FOLDERS:
            return {
                ...state,
                childFolders: payload.childFolders,
            }
       case ACTIONS.SET_CHILD_FILES:
            return {
                ...state,
                childFiles: payload.childFiles,
            }
        default:
            return state
    }
}

export function useShareFolder(folderId = null, folder = null) {
    const [state, dispatch] = useReducer(reducer, {
        folderId,
        folder,
        childFolders: [],
        childFiles: [],
    })
    const { currentUser } = useAuth()

    useEffect(() => {
        dispatch({ type: ACTIONS.SELECT_FOLDER, payload: { folderId, folder } })
      }, [folderId, folder])
    
      useEffect(() => {
        if (folderId == null) {
          return dispatch({
            type: ACTIONS.UPDATE_FOLDER,
            payload: { folder: SHARE_FOLDER },
          })
        }
    
        database.folders
          .doc(folderId)
          .get()
          .then(doc => {
            dispatch({
              type: ACTIONS.UPDATE_FOLDER,
              payload: { folder: database.formatDoc(doc) },
            })
          })
          .catch(() => {
            dispatch({
              type: ACTIONS.UPDATE_FOLDER,
              payload: { folder: SHARE_FOLDER },
            })
          })
      }, [folderId])
    
      useEffect(() => {
        console.log("retriving database child folders and folderId is",folderId)
        console.log("current user id is ", currentUser.uid)
        return database.folders
          .where("parentId", "==", folderId)
          .where("editorId", "array-contains", currentUser.uid)
          .orderBy("createdAt")
          .onSnapshot(snapshot => {
            dispatch({
              type: ACTIONS.SET_CHILD_FOLDERS,
              payload: { childFolders: snapshot.docs.map(database.formatDoc) },
            })
          })
          console.log("retriving database folders")
      }, [folderId, currentUser])
    
      useEffect(() => {
        console.log("retriving database child files")
        return (
          database.files
            .where("folderId", "==", folderId)
            .where("editorId", "array-contains", currentUser.uid)
            .orderBy("createdAt")
            .onSnapshot(snapshot => {
              dispatch({
                type: ACTIONS.SET_CHILD_FILES,
                payload: { childFiles: snapshot.docs.map(database.formatDoc) },
              })
            })
        )
        console.log("retriving database child files")
      }, [folderId, currentUser])
    
    return state
}
