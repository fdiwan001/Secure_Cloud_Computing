import React, { useState } from "react"
import { Button, Modal, Form } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFolderPlus} from "@fortawesome/free-solid-svg-icons"
import { database, firestore } from "../../firebase"
import { useAuth } from "../../contexts/AuthContext"
import { ROOT_FOLDER } from "../../hooks/useFolder"

export default function AddFolder({ currentFolder }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const { currentUser } = useAuth()

  function openModal() {
    setOpen(true)
  }

  function closeModal() {
    setOpen(false)
  }

  function handleSubmit(e) {
    e.preventDefault()

    console.log("adding folder started")

    if (currentFolder == null) return

    const path = [...currentFolder.path]
    const user = []
    var sharepath = [currentFolder.id];
    console.log("sharepath is ", sharepath)
    user.push(currentUser.uid)
    if (currentFolder !== ROOT_FOLDER) {
      path.push({ name: currentFolder.name, id: currentFolder.id })

      firestore.collection('folders').doc(currentFolder.id).get().then(doc => {

        sharepath = [...sharepath, ...doc.data().sharepath]

      database.folders.add({
        name: name,
        parentId: currentFolder.id,
        userId: doc.data().userId,
        shared: null,
        path: path,
        sharepath: sharepath,
        ownerId: currentUser.uid,
        createdAt: database.getCurrentTimestamp(),
      })
    })
      setName("")
      closeModal()
    }
    else{
      database.folders.add({
      name: name,
      parentId: currentFolder.id,
      userId: user,
      shared: null,
      sharepath: sharepath,
      path: path,
      ownerId: currentUser.uid,
      createdAt: database.getCurrentTimestamp(),
    })
    setName("")
    closeModal()


    console.log("current user is not null")
    console.log("current folder id is", currentFolder.id)

    }
    
  }


  return (
    <>
      <Button onClick={openModal} variant="outline-success" size="sm">
        <FontAwesomeIcon icon={faFolderPlus} />
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Folder Name</Form.Label>
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
            <Button variant="success" type="submit">
              Add Folder
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}