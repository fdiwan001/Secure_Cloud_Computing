import React from 'react'
import { Container } from 'react-bootstrap'
import { useShareFolder } from "../../hooks/useShareFolder"
import AddFolder from './AddFolder'
import AddFile from './AddFile'
import ShareFolder from './Share'
import Folder from './Folder'
import File from './File'
import NavbarComponent from './navbar'
import FolderBreadcrumbs from './FolderBreadcrumbs'
import { useLocation, useParams } from 'react-router'
import { firestore } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'

export default function ShareDashboard() {
    const { folderId } = useParams()
    const { state = {} } = useLocation()
    const { folder, childFolders, childFiles } = useShareFolder(folderId, state.folder)
    const { currentUser } = useAuth()

    if (currentUser !== null) {
      firestore.collection('users').doc(currentUser.email).set({
        email: currentUser.email,
        userid: currentUser.uid,
      })
    }
  
    return (
      <>
        <NavbarComponent />
        <Container fluid>
          <div className="d-flex align-items-center">
            <FolderBreadcrumbs currentFolder={folder} />
            <AddFile currentFolder={folder} />
            <AddFolder currentFolder={folder} />
            <ShareFolder currentFolder={folder} />
          </div>
          {childFolders.length > 0 && (
            <div className="d-flex flex-wrap">
              {childFolders.map(childFolder => (
                <div
                  key={childFolder.id}
                  style={{ maxWidth: "250px" }}
                  className="p-2"
                >
                  <Folder folder={childFolder} />
                </div>
              ))}
            </div>
          )}
          {childFolders.length > 0 && childFiles.length > 0 && <hr />}
          {childFiles.length > 0 && (
            <div className="d-flex flex-wrap">
              {childFiles.map(childFile => (
                <div
                  key={childFile.id}
                  style={{ maxWidth: "250px" }}
                  className="p-2"
                >
                  <File file={childFile} />
                </div>
              ))}
            </div>
          )}
        </Container>
      </>
    )
  }
