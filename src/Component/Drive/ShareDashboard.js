import React from 'react'
import { Container } from 'react-bootstrap'
import { useShareFolder } from '../../hooks/useShareFolder'
import Folder from './Folder'
import File from './File'
import NavbarComponent from './navbar'
import { useLocation, useParams } from 'react-router'

export default function Dashboard() {
    const { folderId } = useParams()
    const { state = {} } = useLocation()
    const { childFolders, childFiles } = useShareFolder(folderId, state.folder)
  
    return (
      <>
        <NavbarComponent />
        <Container fluid>
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