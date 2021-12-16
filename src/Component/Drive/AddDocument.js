/* eslint-disable react/function-component-definition */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileMedical } from '@fortawesome/free-solid-svg-icons';
import { database, firestore } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { ROOT_FOLDER } from '../../hooks/useFolder';

export default function AddDocument({ currentFolder }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const { currentUser } = useAuth();

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log('adding document started');

    if (currentFolder == null) return;

    const user = [];

    user.push(currentUser.uid);
    if (currentFolder !== ROOT_FOLDER) {
      firestore.collection('folders').doc(currentFolder.id).get().then((doc) => {
        database.documents.add({
          name,
          parentId: currentFolder.id,
          userId: doc.data().userId,
          shared: doc.data().shared,
          ownerId: currentUser.uid,
          createdAt: database.getCurrentTimestamp(),
        });
      });
      setName('');
      closeModal();
    } else {
      database.documents.add({
        name,
        parentId: currentFolder.id,
        userId: user,
        shared: null,
        ownerId: currentUser.uid,
        createdAt: database.getCurrentTimestamp(),
      });
      setName('');
      closeModal();

      console.log('current user is not null');
      console.log('current folder id is', currentFolder.id);
    }
  }

  return (
    <>
      <Button onClick={openModal} variant="outline-success" size="sm">
        <FontAwesomeIcon icon={faFileMedical} />
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Document Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Add Document
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
