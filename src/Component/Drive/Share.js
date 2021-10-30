import React, { useState, useRef } from "react"
import { Button, Modal, Form } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFolderPlus, faShare } from "@fortawesome/free-solid-svg-icons"
import { database, firestore } from "../../firebase"
import { useAuth } from "../../contexts/AuthContext"
import { ROOT_FOLDER } from "../../hooks/useFolder"

export default function ShareFolder({ currentFolder }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const { currentUser } = useAuth()
  const [shareUser, setShareUser] = useState()
  const emailRef = useRef()

  function openModal() {
    setOpen(true)
  }

  function closeModal() {
    setOpen(false)
  }

  function shareSubmit(e) {
    e.preventDefault()

    try {
        console.log("trying now")
        if (currentFolder == null) return console.log("current user is null")

         /*if (currentFolder !== ROOT_FOLDER) {
        path.push({ name: currentFolder.name, id: currentFolder.id })
        }*/

        console.log("collection started")
        firestore.collection('users').doc(emailRef.current.value).get().then(doc => {
            var shareId = [];
            shareId.push(doc.data().userid);
            console.log("Value of userid:", shareId)
        console.log("current fulder id", currentFolder.id)
        console.log("retriving current fulter id")

        const temp_folder = currentFolder.id;

            firestore.collection('folders').doc(temp_folder).update({
                editorId: shareId,
            });
            shareId = [];
     });
    } catch {
    console.log("Failed to share")
      }
    
    setName("")
    setShareUser("")
    closeModal()
  }


  return (
    <>
      <Button onClick={openModal} variant="outline-success" size="sm">
        <FontAwesomeIcon icon={faShare} />
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={shareSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>User Email</Form.Label>
              <Form.Control
                type="email"
                ref={emailRef} required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Enter
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}