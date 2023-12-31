const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.beeiwwt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    // create db and collection
    const db = client.db("gadgetHubDB");

    // productCollection
    const productCollection = db.collection("products");

    // gameProductsCollection
    const gameProductsCollection = db.collection("gameProducts");

    // cartCollection
    const cartCollection = db.collection("cartProducts");

    // customers collection
    const customersCollection = db.collection("customers");

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });

    // get all game products
    app.get("/gameProducts", async (req, res) => {
      const cursor = gameProductsCollection.find({});
      const gameProducts = await cursor.toArray();
      res.send(gameProducts);
    });

    app.get("/cartProducts", async (req, res) => {
      const cursor = cartCollection.find({});
      const cartProducts = await cursor.toArray();
      res.send(cartProducts);
    });

    app.post("/addCart", async (req, res) => {
      const cart = req.body;
      const result = await cartCollection.insertOne(cart);
      res.send(result);
    });

    // delete from cart
    app.delete("/cartItemDelete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    // get all customers
    app.get("/customers", async (req, res) => {
      const cursor = customersCollection.find({});
      const customers = await cursor.toArray();
      res.send(customers);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
