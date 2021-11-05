import React,{useCallback, useEffect, useState, useRef} from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { faFileAlt, faShare } from '@fortawesome/free-solid-svg-icons'
import { Button, Modal, Form } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { firestore } from '../../firebase'
import {Helmet} from "react-helmet";

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
    
  ]


const  SAVE_INTERVAL_MS = 2000

export default function TextEditor() {
    const {id: documentId} = useParams()
    const [socket, setSocket] = useState()
    const [quill, setQuill] = useState() 
    const { currentUser } = useAuth()
    console.log(documentId)
    console.log("current user is ", currentUser.uid)
    const userid = [];
    userid.push(currentUser.uid)
    const [open, setOpen] = useState(false)
    const emailRef = useRef()
    const [name, setName] = useState("")
    
    const docInfo = {
      userid: userid,
      id: documentId

    }
    function openModal() {
        setOpen(true)
    }
    
    function closeModal() {
        setOpen(false)
    }
    
    function shareSubmit(e) {
      e.preventDefault()
      console.log("email is ", emailRef.current.value)


              console.log("email is ", emailRef.current.value)
            firestore.collection('users').doc(emailRef.current.value).get().then(doc => {
              var user = [];
              user.push(doc.data().userid)    
            var user1 = [];
            user1.push(currentUser.uid)
            user = [...user, ...user1] 
            console.log("user is ", user) 
              firestore.collection('documents').doc(documentId).update({
                userId: user,
                shared: "yes",
            });
          })

        closeModal()
      }

    const filehandle = async (e) => {
      e.preventDefault()
        try {
          const docRef = firestore.collection('documents').doc(documentId);
          console.log(name)
          const doc = await docRef.set({
            name: name,
            
          },{ merge: true });
          
          console.log(name);
        } catch (error) {
          console.log(error);
        }
      closeModal()
    }
    

    useEffect(() => {
        const s = io("34.132.20.72:8080")
        setSocket(s);

        return () => {
            s.disconnect()
        }
    },[])

    useEffect(() => {
        if( socket == null || quill == null) return
        socket.once("load-document", document => {
            console.log(document)
            quill.setContents(document)
            quill.enable()
        })
        socket.emit('get-document', docInfo)
        //socket.emit('get-userid', userid)

    },[socket, quill, docInfo])


    

    useEffect(() => {
        if (socket == null || quill == null) return
    
        const interval = setInterval(() => {
            socket.emit("save-document", quill.getContents())
        }, SAVE_INTERVAL_MS)
    
        return () => {
          clearInterval(interval)
        }
      }, [socket, quill])

    useEffect(() => {
        if(socket == null || quill == null ) return

        const handler = (delta,oldDelta, source) => {
            if(source !== 'user') return
            socket.emit("send-changes", delta)
        }
        quill.on('text-change', handler)

        return () => {
            quill.off('text-change',handler)
        }

       
    },[socket, quill])

    useEffect(() => {
        if (socket == null || quill == null) return
    
        const handler = delta => {
          quill.updateContents(delta)
        }
        socket.on("receive-changes", handler)
    
        return () => {
          socket.off("receive-changes", handler)
        }
      }, [socket, quill])


    const wrapperRef = useCallback((wrapper) => {
        if(wrapper == null) return

        wrapper.innerHTML = ""
        const editor = document.createElement("div")
        wrapper.append(editor)

        const q = new Quill( editor, {theme : "snow", modules : {toolbar : TOOLBAR_OPTIONS}})
        q.disable()
        q.setText("Loading ...")
        setQuill(q)
        
        

    },[])

    return (
    <>  
            <Helmet>
              <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"/>
              <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
              <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
            </Helmet>

<button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
  Rename File
</button>

<div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">File Name</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <Form onSubmit={filehandle}>
        <div className="modal-body">
          <Form.Group>
                <Form.Label>Document Name</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
          </Form.Group>
        </div>
      
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="submit" className="btn btn-primary">Save changes</button>
        </div>
      </Form>
    </div>
  </div>
</div>
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
            <div className="container" ref = {wrapperRef}></div>
        
    </>    

    )
}

