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

    function filehandle() {

    
        console.log("this is the name", name)
        console.log("document id is", documentId)

        firestore.collection('documents').doc(documentId).set({
            name: name,
         });
            
        setName("")
        closeModal()
        
        
    }

      

    useEffect(() => {
        const s = io("http://localhost:3001")
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

