import { ObjectId } from "mongodb";
import { Router } from "express";

import { db } from "../utils/db.js";

const productRouter = Router();

//GET
// Pagination
productRouter.get("/", async (req, res) => {
  try {
    const name = req.query.keywords;
    const category = req.query.category;
    const page = parseInt(req.query.page) || 1; // default page is 1
    const limit = parseInt(req.query.limit) || 5; // default limit is 5

    const query = {};

    if (name) {
      query.name = new RegExp(name, "i");
    }

    if (category) {
      query.category = new RegExp(category, "i");
    }

    const collection = db.collection("products");

    const allProducts = await collection.find(query).toArray();

    const products = await collection
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return res.json({ data: products, total: allProducts.length });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

//GET ID
productRouter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.id);

    const productById = await collection.findOne({ _id: productId });

    return res.json({ data: productById });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

//POST
productRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("products");

    const productData = { ...req.body, created_at: new Date() };
    console.log("Received product data:", productData);

    const newProductData = await collection.insertOne(productData);
    return res.json({
      message: `Product Id (${newProductData.insertedId}) has been created successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

//PUT
productRouter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const newProductData = { ...req.body, modified_at: new Date() };

    const productId = new ObjectId(req.params.id);
    await collection.updateOne(
      {
        _id: productId,
      },
      {
        $set: newProductData,
      }
    );
    return res.json({
      message: `Product ${productId} has been updated successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

//DELETE
productRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.id);

    await collection.deleteOne({ _id: productId });

    return res.json({
      message: `Product ${productId} has been deleted successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

export default productRouter;
