import express from "express";
const app = express();
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import userModel from "./models/user.model.js";
dotenv.config();
const PORT = process.env.PORT || 6789;

import users from "./db/user.js";

// adding middlewares
app.use(
  cors({
    origin: ["", process.env.CLIENT_URL],
  })
);

// route for loading json into DB
app.get("/api/load", async (req, res) => {
  // converting income & phone_price to number
  const mod_users = users.map((item) => ({
    ...item,
    income: Number(item.income.substring(1)),
    phone_price: Number(item.phone_price),
  }));
  // console.log(mod_users.slice(0, 4));
  try {
    const akg = await userModel.insertMany(mod_users);
    res.status(200).json({
      data: akg,
      success: true,
      message: "Data loaded successfully.",
    });
  } catch (error) {
    res.status(501).json({ success: true, message: "Something went wrong" });
  }
});

/*
1. Users which have income lower than $5 USD and have a car of brand “BMW” or “Mercedes”.
2. Male Users which have phone price greater than 10,000.
3. Users whose last name starts with “M” and has a quote character length greater than 15 and email includes his/her last name.
4. Users which have a car of brand “BMW”, “Mercedes” or “Audi” and whose email does not include any digit.
5. Show the data of top 10 cities which have the highest number of users and their average income.
**/

// route for getting data from DB
app.get("/api/users/one", async (req, res) => {
  try {
    // we can regex from same
    //  eg. car: { $regex: /BMW|Mercedes/ }
    const table_one = await userModel.find({
      income: { $lt: 5 },
      car: { $in: ["BMW", "Mercedes-Benz"] },
    });
    res.status(200).json({
      data: table_one,
      // {
      //   table_one,
      //   table_two,
      //   table_three,
      //   table_four,
      //   table_five,
      // },
      success: true,
      message: "Data loaded successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({ success: true, message: "Something went wrong" });
  }
});

app.get("/api/users/two", async (req, res) => {
  try {
    const table_two = await userModel
      .find({
        phone_price: { $gt: 10000 },
      })
      .sort({ phone_price: -1 });

    res.status(200).json({
      data: table_two,
      success: true,
      message: "Data loaded successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({ success: true, message: "Something went wrong" });
  }
});

app.get("/api/users/three", async (req, res) => {
  try {
    const table_three = await userModel
      .find({
        $and: [
          { last_name: /^M/ },
          { $expr: { $gt: [{ $strLenCP: "$quote" }, 15] } },
          {
            $expr: {
              $regexMatch: {
                input: "$email",
                regex: { $concat: [".*", "$last_name", ".*"] },
                options: "i",
              },
            },
          },
        ],
      });
    res.status(200).json({
      data: table_three,
      success: true,
      message: "Data loaded successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({ success: true, message: "Something went wrong" });
  }
});

app.get("/api/users/four", async (req, res) => {
  try {
    const table_four = await userModel.find({
      $and: [
        { car: { $in: ["BMW", "Mercedes-Benz", "Audi"] } },
        { email: { $not: { $regex: /\d/ } } },
      ],
    });
    res.status(200).json({
      data: table_four,
      success: true,
      message: "Data loaded successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({ success: true, message: "Something went wrong" });
  }
});

app.get("/api/users/five", async (req, res) => {
  try {
    const table_five = await userModel.aggregate([
      {
        $group: {
          _id: "$city",
          city: { $first: "$city" },
          avg_income: {
            $avg: { $convert: { input: "$income", to: "int", onError: 0 } },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      data: table_five,
      success: true,
      message: "Data loaded successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({ success: true, message: "Something went wrong" });
  }
});

//  connecting mongoAtlas & starting server
mongoose.connect(process.env.MONGO_URI);
console.log("connected mongoAtlas");
app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`server is listening at http://localhost:6789`);
});
