import { faFile } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { Button } from "react-bootstrap"
import { Link } from "react-router-dom"

export default function File({ file }) {
  return (
      <Button
      to={{
        pathname: `/documents/${file.docId}`,
      }}
      target = "_blank"
      variant="secondary"
      className="text-truncate w-100"
      as={Link}
    >
      <FontAwesomeIcon icon={faFile} className="mr-2" />
      {file.name}
    </Button>
           
           
  )
}
