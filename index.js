const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nqmctgu.mongodb.net/?appName=Cluster0`;
console.log("user and pass", process.env.DB_USER, process.env.DB_PASS);
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await client.connect();
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error here it is:", error);
    throw error;
  }
}


const db = client.db("contestDB");
const users = db.collection("users");
const contests = db.collection("contests");
const payments = db.collection("payments");
const submissions = db.collection("submissions");
const blogs = db.collection("blogs");
const contacts = db.collection("contacts");



app.get("/", (req, res) => {
  res.send("Server Running!");
});

app.post("/logout", (req, res) => {
  res.clearCookie("token").send({ success: true });
});


app.post("/users", async (req, res) => {
  try {
    await connectDB();
    const user = req.body;
    const exists = await users.findOne({ email: user.email });
    if (exists) return res.send({ message: "User exists" });

    user.role = "user";
    const result = await users.insertOne(user);

    res.send({
      success: true,
      insertedId: result.insertedId,
      user,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    await connectDB();
    console.log("getting users, db connected");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const usersList = await users.find().skip(skip).limit(limit).toArray();
    const total = await users.countDocuments();

    res.send({ users: usersList, total });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.patch("/update-user/:email", async (req, res) => {
  try {
    await connectDB();
    const email = req.params.email;
    const updateData = req.body;

    const result = await users.updateOne({ email }, { $set: updateData });

    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/users/role/:email", async (req, res) => {
  try {
    await connectDB();
    const email = req.params.email;
    const user = await users.findOne({ email });
    res.send({ role: user?.role });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.patch("/users/role/:email", async (req, res) => {
  try {
    await connectDB();
    const email = req.params.email;
    const role = req.body.role;
    const result = await users.updateOne({ email }, { $set: { role } });
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


app.post("/contests", async (req, res) => {
  try {
    await connectDB();
    const result = await contests.insertOne(req.body);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/contests", async (req, res) => {
  try {
    await connectDB();
    const { page = 1, limit = 10, type, search } = req.query;
    console.log("👉 Query Params:", { page, limit, type, search });

    const query = { status: "confirmed" };
    if (type && type !== "all") query.type = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ];
    }
    console.log("👉 MongoDB Query:", query);

    const total = await contests.countDocuments(query);
    console.log("👉 Total Contests Found:", total);

    const result = await contests
      .find(query)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .toArray();

    console.log("👉 Result Contests:", result);

    res.send({ contests: result, total });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/admin/contests", async (req, res) => {
  try {
    await connectDB();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await contests.countDocuments();
    const result = await contests.find().skip(skip).limit(limit).toArray();

    res.send({ contests: result, total });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/contest/:id", async (req, res) => {
  try {
    await connectDB();
    const result = await contests.findOne({
      _id: new ObjectId(req.params.id),
    });
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/creator-contests/:email", async (req, res) => {
  try {
    await connectDB();
    const result = await contests
      .find({ creatorEmail: req.params.email })
      .toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.patch("/contest/:id", async (req, res) => {
  try {
    await connectDB();
    const result = await contests.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body },
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.delete("/contest/:id", async (req, res) => {
  try {
    await connectDB();
    const result = await contests.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.patch("/contests/confirm/:id", async (req, res) => {
  try {
    await connectDB();
    const result = await contests.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "confirmed" } },
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.patch("/contests/reject/:id", async (req, res) => {
  try {
    await connectDB();
    const result = await contests.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "rejected" } },
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


app.get("/contests/popular", async (req, res) => {
  try {
    await connectDB();
    const result = await contests
      .find({ status: "confirmed" })
      .sort({ participantsCount: -1 })
      .limit(5)
      .toArray();

    res.send({ contests: result });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


app.post("/payment", async (req, res) => {
  try {
    await connectDB();
    const { contestId, email, price } = req.body;

    await contests.updateOne(
      { _id: new ObjectId(contestId) },
      { $inc: { participantsCount: 1 } },
    );

    const result = await payments.insertOne({
      contestId,
      email,
      price,
      date: new Date(),
    });

    res.send({ success: true, result });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/participated/:email", async (req, res) => {
  try {
    await connectDB();
    const pay = await payments.find({ email: req.params.email }).toArray();
    const ids = pay.map((p) => new ObjectId(p.contestId));
    const result = await contests.find({ _id: { $in: ids } }).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


app.post("/submission", async (req, res) => {
  try {
    await connectDB();
    const result = await submissions.insertOne(req.body);
    res.send({ success: true, result });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/submissions/:id", async (req, res) => {
  try {
    await connectDB();
    const result = await submissions
      .find({ contestId: req.params.id })
      .toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/declare-winner", async (req, res) => {
  try {
    await connectDB();
    const { contestId, winnerName, winnerPhoto, winnerEmail } = req.body;

    const result = await contests.updateOne(
      { _id: new ObjectId(contestId) },
      {
        $set: {
          winner: {
            name: winnerName,
            photo: winnerPhoto,
            email: winnerEmail,
          },
        },
      },
    );

    res.send({ success: true, result });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/wins/:email", async (req, res) => {
  try {
    await connectDB();
    const result = await contests
      .find({ "winner.email": req.params.email })
      .toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/leaderboard", async (req, res) => {
  try {
    await connectDB();
    const pipeline = [
      { $match: { winner: { $exists: true } } },
      {
        $group: {
          _id: "$winner.email",
          name: { $first: "$winner.name" },
          photo: { $first: "$winner.photo" },
          wins: { $sum: 1 },
        },
      },
      { $sort: { wins: -1 } },
    ];

    const result = await contests.aggregate(pipeline).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/user-stats/:email", async (req, res) => {
  try {
    await connectDB();
    const participated = await payments.countDocuments({
      email: req.params.email,
    });
    const won = await contests.countDocuments({
      "winner.email": req.params.email,
    });
    res.send({ participated, won });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/test-db", async (req, res) => {
  try {
    await connectDB();
    await client.db("admin").command({ ping: 1 });
    res.send({ success: true, message: "MongoDB connected successfully!" });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message,
      details: "Check your MongoDB credentials and network access",
    });
  }
});




app.post("/blogs", async (req, res) => {
  try {
    await connectDB();
    const result = await blogs.insertOne(req.body);
    res.send({ success: true, result });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


app.get("/blogs", async (req, res) => {
  try {
    await connectDB();
    const result = await blogs.find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});




app.post("/contact", async (req, res) => {
  try {
    await connectDB();
    const result = await contacts.insertOne(req.body);
    res.send({ success: true, result });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


app.get("/contact", async (req, res) => {
  try {
    await connectDB();
    const result = await contacts.find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});



if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}


module.exports = app;
