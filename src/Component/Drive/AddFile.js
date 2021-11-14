import React, { useState, useEffect } from "react"
import { faFileMedical} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useAuth } from "../../contexts/AuthContext"
import { Link } from "react-router-dom"
import { Button, Modal, Form } from "react-bootstrap"
import { io } from 'socket.io-client'

export default function AddFile({ currentFolder }) {

  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [socket, setSocket] = useState()
  const { currentUser } = useAuth()

  function openModal() {
    setOpen(true)
  }

  function closeModal() {
    setOpen(false)
  }
  
  useEffect(() => {
    const s = io("http://localhost:3001")
    setSocket(s);

    return () => {
      s.disconnect()
    }
  },[])

  function filehandle() {
    const folderId = currentFolder.id;

    socket.emit("document-name", name)
    socket.emit("folderId", folderId)
        
  setName("")
  closeModal()
    
    
    }


  return (
  <>
    <Button onClick={openModal} variant="outline-success" size="sm">
        <FontAwesomeIcon icon={faFileMedical} />
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={filehandle}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Document Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Link target="_blank" to="/create">
            <Button variant="success" type="button">
              Create Document
            </Button>
            </Link>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
export { AddFile }
