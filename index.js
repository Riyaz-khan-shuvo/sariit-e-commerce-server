const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d5s5i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("ema-jhon");
        const productCollection = database.collection("products");

        app.get("/", (req, res) => {
            res.send("Hello World !!!")
        })

        // get all products data 

        app.get('/products', async (req, res) => {
            const products = productCollection.find({})
            const count = await products.count()
            const pages = req.query.page;
            const sizes = parseInt(req.query.size);
            let productsArray;
            if (pages) {
                productsArray = await products.skip(sizes * pages).limit(sizes).toArray()
            }
            else {
                productsArray = await products.toArray();
            }


            res.send({
                count,
                productsArray,
            })
        })

        //get single Product data 

        app.get('/products/:key', async (req, res) => {
            const key = req.params.key;
            const findKey = await productCollection.findOne({ key });
            res.send(findKey);
        })



    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Listing The port http://localhost:${port}`)
})


