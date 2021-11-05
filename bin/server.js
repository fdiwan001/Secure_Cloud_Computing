const firebase = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://cloud-development-e159d.firebaseio.com"
});

const firestore = firebase.firestore();

const database = {
    folders: firestore.collection('folders'),
    files: firestore.collection('files'),
    documents: firestore.collection('documents'),
    formatDoc: doc => {
        return { id: doc.id, ...doc.data() }
    },
    getCurrentTimestamp: firebase.firestore.FieldValue.serverTimestamp,
}

const storage = firebase.storage()
const defaultValue = ""

const io = require('socket.io')(8000, {
    cors: {
        origin: 'https://secure-cloud-computing-c2hzr5vfpq-uc.a.run.app/',
        methods: ["GET", "POST"]
    }
})

console.log("Server is running")

io.on("connection", socket => {
    socket.on('get-document', async docInfo=> {

        //socket.on('get-userid', async userid => {

            
            const document = await findOrCreateDocument(docInfo)
            const documentId = docInfo.id
            socket.join(documentId)
            console.log("in socket")
            socket.emit("load-document", document)

            /**
            socket.on("document-name", name => { 
                console.log("name of doc is ", name) 
                console.log("doc name is ", name)
            })

            socket.on("folderId", folderId => {
                console.log("parentId of doc is ", folderId)
                console.log("doc parentID is ", folderId)
            });
             */
            socket.on('send-changes', delta => {
                socket.broadcast.to(documentId).emit('receive-changes', delta)
            })

            socket.on("save-document", async data => {
                const docRef = firestore.collection('documents').doc(documentId);

                const doc = await docRef.set({
                                    data: data,
                }, { merge: true });
                            
            })
        //})
    })
    console.log("connected");
})


async function findOrCreateDocument(docInfo) {
    if (docInfo == null) return
    const docRef = firestore.collection('documents').doc(docInfo.id);
    const doc = await docRef.get();
    if (!doc.exists) {
        console.log('No such document!');
        console.log('creating document');
        const document = await firestore.collection('documents').doc(docInfo.id).set(
            {
                data: defaultValue,
                userId: docInfo.userid,
                docId: docInfo.id,
                name: "untitled-document"
            }
        );
        return document

    } else {
        console.log('document exist');
        const doc1 = doc.data().data
        console.log('in findor create: ')
        console.log('Document data:', doc.data());
        return doc1
    }

    //const docRef = ref.doc('SF');
    //const doc = await cityRef.get();
    

    //const res = await db.collection('data').doc('one').set(data);
    //const document = await Document.findById(id)
   
    //if (document) return document
    //return await Document.create({ _id: id, data: defaultValue })
}