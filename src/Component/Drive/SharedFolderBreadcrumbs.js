import React from "react"
import { Breadcrumb } from "react-bootstrap"
import { Link } from "react-router-dom"
import { SHARE_FOLDER } from "../../hooks/useShareFolder"

export default function SharedFolderBreadcrumbs({ currentFolder }) {
    let path = currentFolder === SHARE_FOLDER ? [] : [SHARE_FOLDER]
    console.log("current path is ",path)
    if (currentFolder) path = [...path, ...currentFolder.path]
    console.log("currentFolder.path is ",path)
  
    return (
      <Breadcrumb
        className="flex-grow-1"
        listProps={{ className: "bg-white pl-0 m-0" }}
      >
        {path.map((folder, index) => (
          <Breadcrumb.Item
            key={folder.id}
            linkAs={Link}
            linkProps={{
              to: {
                pathname: folder.id ? `/folder/${folder.id}` : "/shared",
                state: { folder: { ...folder, path: path.slice(1, index) } },
              },
            }}
            className="text-truncate d-inline-block"
            style={{ maxWidth: "150px" }}
          >
            {folder.name}
          </Breadcrumb.Item>
        ))}
        {currentFolder && (
          <Breadcrumb.Item
            className="text-truncate d-inline-block"
            style={{ maxWidth: "200px" }}
            active
          >
            {currentFolder.name}
          </Breadcrumb.Item>
        )}
      </Breadcrumb>
    )
}
