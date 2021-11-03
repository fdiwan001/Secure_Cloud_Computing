import React, { useState, useRef } from "react"
import { Button, Modal, Form } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShare } from "@fortawesome/free-solid-svg-icons"
import { database, firestore } from "../../firebase"
import { useAuth } from "../../contexts/AuthContext"

export default function ShareFolder({ currentFolder }) {
  const [open, setOpen] = useState(false)
  const { currentUser } = useAuth()
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
        if (currentFolder == null) return console.log("current user is null")

         /*if (currentFolder !== ROOT_FOLDER) {
        path.push({ name: currentFolder.name, id: currentFolder.id })
        }*/

              
          database.folders
          .where("sharepath", "array-contains", currentFolder.id)
          .get()
          .then( document => {
            document.forEach((doc1) => {

              firestore.collection('users').doc(emailRef.current.value).get().then(doc => {
                var user = [];
                user.push(doc.data().userid)    
              var user1 = [];
              user1.push(currentUser.uid)
              user = [...user, ...user1]  
                firestore.collection('folders').doc(doc1.id).update({
                 userId: user,
                 shared: "yes",
              });
              firestore.collection('folders').doc(currentFolder.id).update({
                userId: user,
                shared: "yes",
             });
            })
            

          })
    });
    } catch {
    console.log("Failed to share")
      }
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