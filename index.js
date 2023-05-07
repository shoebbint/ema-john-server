const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
//middleware
app.use(cors());
app.use(express.json());

//db connect


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.djooxo2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const productCollection = client.db('emaJohn').collection('product');
//fetch all product/read operation
app.get("/product",async(req,res)=>{
   
     const page=parseInt(req.query.page);
     const size=parseInt(req.query.size);
     const query ={};
     const cursor = productCollection.find(query);
     let products;
     if(page||size){
        products=await cursor.skip(page*size).limit(size).toArray();
     }
     else{
         products=await cursor.toArray();
     }

     res.send(products)
     console.log(products)
})

app.get("/productCount", async(req, res) => {
    const count = await productCollection.estimatedDocumentCount();
    res.send({count});
})
app.post("/productByKeys", async(req, res) => {
    const keys = req.body;
    const ids=keys.map(id=>new ObjectId(id));
    const query={_id:{$in:ids}}
    const cursor=productCollection.find(query);
    const products=await cursor.toArray();
    console.log(keys)
    res.send(products);
})

    }
    finally {
       // await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("john is running and waiting for ema")
})

app.listen(port, () => {
    console.log("Listening on port", port)
})