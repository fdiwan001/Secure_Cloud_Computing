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

const io = require('socket.io')(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
})

io.on("connection", socket => {
    socket.on('get-document', async documentId => {
        const document = await findOrCreateDocument(documentId)
        socket.join(documentId)
        console.log("in socket")
        const docRef = firestore.collection('documents').doc(documentId);
        const doc = await docRef.get();
        console.log('Document data:', doc.data()); 
        socket.emit("load-document", doc.data)

        socket.on('send-changes', delta => {
            socket.broadcast.to(documentId).emit('receive-changes', delta)
        })

        socket.on("save-document", async data => {

            const docRef = firestore.collection('documents').doc(documentId);

            const doc = await docRef.set({
                data: data
              }, { merge: true });
              
            //await document.findByIdAndUpdate(documentId, { data })
        })
    })
    console.log("connected");
})


async function findOrCreateDocument(id) {
    if (id == null) return
    const docRef = firestore.collection('documents').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
        console.log('No such document!');
        console.log('creating document');
        const document = await firestore.collection('documents').doc(id).set({data: defaultValue});
        return document

    } else {
        console.log('in findor create: ')
        console.log('Document data:', doc.data());
        return doc
    }

    //const docRef = ref.doc('SF');
    //const doc = await cityRef.get();
    

    //const res = await db.collection('data').doc('one').set(data);
    //const document = await Document.findById(id)
   
    //if (document) return document
    //return await Document.create({ _id: id, data: defaultValue })
}