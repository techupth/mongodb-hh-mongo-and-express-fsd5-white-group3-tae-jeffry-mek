import { ObjectId } from "mongodb";
import { Router } from "express";

import { db } from "../utils/db.js";

const productRouter = Router();

//GET
productRouter.get("/", async (req, res) => {
  try {
    const collection = db.collection("products");

    const products = await collection.find({}).limit(10).toArray();

    return res.json({ data: products });
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
