// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { MongoClient, ObjectId,ServerApiVersion } from "mongodb";
// // import jwt from "jsonwebtoken";
// import cookieParser from "cookie-parser";

// dotenv.config();
// const app = express();
// const port = process.env.PORT || 5000;

// // ✅ Middlewares
// app.use(express.json());
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: ["http://localhost:5173","http://localhost:5174","https://roaring-bubblegum-26fe9c.netlify.app/"],
//     credentials: true,
//   })
// );

// // ✅ MongoDB Connection
// // const client = new MongoClient(process.env.MONGO_URI);
// const client = new MongoClient(process.env.MONGO_URI, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     // await client.connect();
//     console.log("✅ MongoDB connected");

//     const db = client.db("contestDB");
//     const users = db.collection("users");
//     const contests = db.collection("contests");
//     const payments = db.collection("payments");
//     const submissions = db.collection("submissions");

//     // ✅ JWT Middleware
//     // const verifyJWT = (req, res, next) => {
//     //   const token = req.cookies?.token;
//     //   if (!token) return res.status(401).send({ message: "Unauthorized" });

//     //   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     //     if (err) return res.status(401).send({ message: "Unauthorized" });
//     //     req.user = decoded;
//     //     next();
//     //   });
//     // };

//     // ✅ Auth Routes
//     // app.post("/jwt", (req, res) => {
//     //   const user = req.body;
//     //   const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });

//     //   res
//     //     .cookie("token", token, {
//     //       httpOnly: true,
//     //       secure: false,
//     //     })
//     //     .send({ success: true });
//     // });

//     app.post("/logout", (req, res) => {
//       res.clearCookie("token").send({ success: true });
//     });

//     // ✅ User Routes
//   app.post("/users", async (req, res) => {
//   const user = req.body;
//   const exists = await users.findOne({ email: user.email });
//   if (exists) return res.send({ message: "User exists" });

//   user.role = "user";
//   const result = await users.insertOne(user);

  
//   res.send({
//     success: true,
//     insertedId: result.insertedId,
//     user,
//   });
// });



//    app.get("/users", async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const skip = (page - 1) * limit;

//   const usersList = await users.find().skip(skip).limit(limit).toArray();
//   const total = await users.countDocuments();

//   res.send({ users: usersList, total });
// });


//     app.patch("/update-user/:email", async (req, res) => {
//   const email = req.params.email;
//   const updateData = req.body; // { bio: "...", profilePic: "..." }

//   const result = await users.updateOne(
//     { email },
//     { $set: updateData }
//   );

//   res.send(result);
// });


//     app.get("/users/role/:email", async (req, res) => {
//       const email = req.params.email;
//       const user = await users.findOne({ email });
//       res.send({ role: user?.role });
//     });

//     app.patch("/users/role/:email", async (req, res) => {
//       const email = req.params.email;
//       const role = req.body.role;
//       const result = await users.updateOne({ email }, { $set: { role } });
//       res.send(result);
//     });

   
// app.get("/contests", async (req, res) => {
//   const { page = 1, limit = 10, type, search } = req.query;

//   const query = { status: "confirmed" };

//   if (type && type !== "all") query.type = type;

//   if (search) {
//     query.$or = [
      
//       { type: { $regex: search, $options: "i" } }         // contest type ✅
//     ];
//   }

//   const total = await contests.countDocuments(query);
//   const result = await contests
//     .find(query)
//     .skip((parseInt(page) - 1) * parseInt(limit))
//     .limit(parseInt(limit))
//     .toArray();

//   res.send({ contests: result, total });
// });



//     // ✅ Contest Routes
//     app.post("/contests", async (req, res) => {
//       const result = await contests.insertOne(req.body);
//       res.send(result);
//     });

   
// app.get("/contests", async (req, res) => {
//   const { page = 1, limit = 10, type, search } = req.query;
//   console.log("👉 Query Params:", { page, limit, type, search });

//   const query = { status: "confirmed" };
//   if (type && type !== "all") query.type = type;
//   if (search) {
//     query.$or = [
//       { title: { $regex: search, $options: "i" } },
//       { description: { $regex: search, $options: "i" } }
//     ];
//   }
//   console.log("👉 MongoDB Query:", query);

//   const total = await contests.countDocuments(query);
//   console.log("👉 Total Contests Found:", total);

//   const result = await contests
//     .find(query)
//     .skip((parseInt(page) - 1) * parseInt(limit))
//     .limit(parseInt(limit))
//     .toArray();

//   console.log("👉 Result Contests:", result);

//   res.send({ contests: result, total });
// });
// app.get("/admin/contests", async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10; // প্রতি পেজে 10 contest default
//   const skip = (page - 1) * limit;

//   const total = await contests.countDocuments(); // সব contest count করবে
//   const result = await contests
//     .find() // কোনো filter নেই, সব contest দেখাবে
//     .skip(skip)
//     .limit(limit)
//     .toArray();

//   res.send({ contests: result, total });
// });




//     app.get("/contest/:id", async (req, res) => {
//       const result = await contests.findOne({ _id: new ObjectId(req.params.id) });
//       res.send(result);
//     });

//     app.get("/creator-contests/:email", async (req, res) => {
//       const result = await contests.find({ creatorEmail: req.params.email }).toArray();
//       res.send(result);
//     });

//     app.patch("/contest/:id", async (req, res) => {
//       const result = await contests.updateOne(
//         { _id: new ObjectId(req.params.id) },
//         { $set: req.body }
//       );
//       res.send(result);
//     });

//     app.delete("/contest/:id",async (req, res) => {
//       const result = await contests.deleteOne({ _id: new ObjectId(req.params.id) });
//       res.send(result);
//     });

//     app.patch("/contests/confirm/:id", async (req, res) => {
//       const result = await contests.updateOne(
//         { _id: new ObjectId(req.params.id) },
//         { $set: { status: "confirmed" } }
//       );
//       res.send(result);
//     });

//     app.patch("/contests/reject/:id", async (req, res) => {
//       const result = await contests.updateOne(
//         { _id: new ObjectId(req.params.id) },
//         { $set: { status: "rejected" } }
//       );
//       res.send(result);
//     });

//     // Popular contest
//     // Popular contests (Top 5)
// app.get("/contests/popular", async (req, res) => {
//   const result = await contests
//     .find({ status: "confirmed" }) // শুধু approved contest
//     .sort({ participantsCount: -1 }) // বেশি অংশগ্রহণকারী আগে
//     .limit(5)
//     .toArray();

//   res.send({ contests: result });

// });


//     // ✅ Payment Routes
//     app.post("/payment", async (req, res) => {
//       const { contestId, email, price } = req.body;

//       await contests.updateOne(
//         { _id: new ObjectId(contestId) },
//         { $inc: { participantsCount: 1 } }
//       );

//       const result = await payments.insertOne({
//         contestId,
//         email,
//         price,
//         date: new Date(),
//       });

//       res.send({ success: true, result });
//     });

//     app.get("/participated/:email", async (req, res) => {
//       const pay = await payments.find({ email: req.params.email }).toArray();
//       const ids = pay.map((p) => new ObjectId(p.contestId));
//       const result = await contests.find({ _id: { $in: ids } }).toArray();
//       res.send(result);
//     });

//     // ✅ Submission Routes
//     app.post("/submission", async (req, res) => {
//       const result = await submissions.insertOne(req.body);
//       res.send({ success: true, result });
//     });

//     app.get("/submissions/:id", async (req, res) => {
//       const result = await submissions.find({ contestId: req.params.id }).toArray();
//       res.send(result);
//     });

//     app.post("/declare-winner", async (req, res) => {
//       const { contestId, winnerName, winnerPhoto, winnerEmail } = req.body;

//       const result = await contests.updateOne(
//         { _id: new ObjectId(contestId) },
//         {
//           $set: {
//             winner: { 
//               name: winnerName,
//               photo: winnerPhoto,
//               email: winnerEmail,
              
//             },
//           },
//         }
//       );

//       res.send({ success: true, result });
//     });

//     app.get("/wins/:email", async (req, res) => {
//       const result = await contests.find({ "winner.email": req.params.email }).toArray();
//       res.send(result);
//     });

//     app.get("/leaderboard", async (req, res) => {
//       const pipeline = [
//         { $match: { winner: { $exists: true } } },
//         {
//           $group: {
            
//             _id: "$winner.email",
//             name: { $first: "$winner.name" },
//             photo: { $first: "$winner.photo" },
//             wins: { $sum: 1 },
//           },
//         },
//         { $sort: { wins: -1 } },
//       ];

//       const result = await contests.aggregate(pipeline).toArray();
//       res.send(result);
//     });

//     app.get("/user-stats/:email", async (req, res) => {
//       const participated = await payments.countDocuments({ email: req.params.email });
//       const won = await contests.countDocuments({ "winner.email": req.params.email });
//       res.send({ participated, won });
//     });

//     // ✅ Start Server
//     app.listen(port, () => console.log(`✅ Server running on port ${port}`));
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err);
//   }
// };

// run()




const express = require('express')
const cors =require ('cors')
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const port = process.env.PORT || 3000

// middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nqmctgu.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("contestDB");
    const users = db.collection("users");
    const contests = db.collection("contests");
    const payments = db.collection("payments");
    const submissions = db.collection("submissions");

    app.post("/logout", (req, res) => {
      res.clearCookie("token").send({ success: true });
    });

    // ✅ User Routes
  app.post("/users", async (req, res) => {
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
});



   app.get("/users", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const usersList = await users.find().skip(skip).limit(limit).toArray();
  const total = await users.countDocuments();

  res.send({ users: usersList, total });
});


    app.patch("/update-user/:email", async (req, res) => {
  const email = req.params.email;
  const updateData = req.body; // { bio: "...", profilePic: "..." }

  const result = await users.updateOne(
    { email },
    { $set: updateData }
  );

  res.send(result);
});


    app.get("/users/role/:email", async (req, res) => {
      const email = req.params.email;
      const user = await users.findOne({ email });
      res.send({ role: user?.role });
    });

    app.patch("/users/role/:email", async (req, res) => {
      const email = req.params.email;
      const role = req.body.role;
      const result = await users.updateOne({ email }, { $set: { role } });
      res.send(result);
    });

   
app.get("/contests", async (req, res) => {
  const { page = 1, limit = 10, type, search } = req.query;

  const query = { status: "confirmed" };

  if (type && type !== "all") query.type = type;

  if (search) {
    query.$or = [
      
      { type: { $regex: search, $options: "i" } }         // contest type ✅
    ];
  }

  const total = await contests.countDocuments(query);
  const result = await contests
    .find(query)
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit))
    .toArray();

  res.send({ contests: result, total });
});



    // ✅ Contest Routes
    app.post("/contests", async (req, res) => {
      const result = await contests.insertOne(req.body);
      res.send(result);
    });

   
app.get("/contests", async (req, res) => {
  const { page = 1, limit = 10, type, search } = req.query;
  console.log("👉 Query Params:", { page, limit, type, search });

  const query = { status: "confirmed" };
  if (type && type !== "all") query.type = type;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
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
});
app.get("/admin/contests", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; // প্রতি পেজে 10 contest default
  const skip = (page - 1) * limit;

  const total = await contests.countDocuments(); // সব contest count করবে
  const result = await contests
    .find() // কোনো filter নেই, সব contest দেখাবে
    .skip(skip)
    .limit(limit)
    .toArray();

  res.send({ contests: result, total });
});




    app.get("/contest/:id", async (req, res) => {
      const result = await contests.findOne({ _id: new ObjectId(req.params.id) });
      res.send(result);
    });

    app.get("/creator-contests/:email", async (req, res) => {
      const result = await contests.find({ creatorEmail: req.params.email }).toArray();
      res.send(result);
    });

    app.patch("/contest/:id", async (req, res) => {
      const result = await contests.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
      );
      res.send(result);
    });

    app.delete("/contest/:id",async (req, res) => {
      const result = await contests.deleteOne({ _id: new ObjectId(req.params.id) });
      res.send(result);
    });

    app.patch("/contests/confirm/:id", async (req, res) => {
      const result = await contests.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { status: "confirmed" } }
      );
      res.send(result);
    });

    app.patch("/contests/reject/:id", async (req, res) => {
      const result = await contests.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { status: "rejected" } }
      );
      res.send(result);
    });

    // Popular contest
    // Popular contests (Top 5)
app.get("/contests/popular", async (req, res) => {
  const result = await contests
    .find({ status: "confirmed" }) 
    .sort({ participantsCount: -1 }) 
    .limit(5)
    .toArray();

  res.send({ contests: result });

});


    // ✅ Payment Routes
    app.post("/payment", async (req, res) => {
      const { contestId, email, price } = req.body;

      await contests.updateOne(
        { _id: new ObjectId(contestId) },
        { $inc: { participantsCount: 1 } }
      );

      const result = await payments.insertOne({
        contestId,
        email,
        price,
        date: new Date(),
      });

      res.send({ success: true, result });
    });

    app.get("/participated/:email", async (req, res) => {
      const pay = await payments.find({ email: req.params.email }).toArray();
      const ids = pay.map((p) => new ObjectId(p.contestId));
      const result = await contests.find({ _id: { $in: ids } }).toArray();
      res.send(result);
    });

    // ✅ Submission Routes
    app.post("/submission", async (req, res) => {
      const result = await submissions.insertOne(req.body);
      res.send({ success: true, result });
    });

    app.get("/submissions/:id", async (req, res) => {
      const result = await submissions.find({ contestId: req.params.id }).toArray();
      res.send(result);
    });

    app.post("/declare-winner", async (req, res) => {
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
        }
      );

      res.send({ success: true, result });
    });

    app.get("/wins/:email", async (req, res) => {
      const result = await contests.find({ "winner.email": req.params.email }).toArray();
      res.send(result);
    });

    app.get("/leaderboard", async (req, res) => {
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
    });

    app.get("/user-stats/:email", async (req, res) => {
      const participated = await payments.countDocuments({ email: req.params.email });
      const won = await contests.countDocuments({ "winner.email": req.params.email });
      res.send({ participated, won });
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server Running!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
