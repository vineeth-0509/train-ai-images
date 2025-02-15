import express from "express";
import {
  TrainModel,
  GenerateImage,
  GenerateImagesFromPack,
} from "../../packages/common/types";
import { prismaClient } from "../../packages/db";

const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());

const USER_ID = "123";

app.post("/ai/training", async (req, res) => {
  const parsedBody = TrainModel.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json({
      message: "Input incorrect",
    });
    return;
  }
  const data = await prismaClient.model.create({
    data: {
      name: parsedBody.data.name,
      type: parsedBody.data.type,
      age: parsedBody.data.age,
      ethinicity: parsedBody.data.ethinicity,
      eyeColor: parsedBody.data.eyeColor,
      bald: parsedBody.data.bald,
      userId: USER_ID,
    },
  });
  res.json({
    modelId: data.id,
  });
});

app.post("/ai/generate", async (req, res) => {
  const parsedBody = GenerateImage.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json({
      msg: "Incorrect input",
    });
    return;
  }
  const data = await prismaClient.outputImages.create({
    data: {
      prompt: parsedBody.data.prompt,
      userId: USER_ID,
      modelId: parsedBody.data?.modelId,
      imageUrl: "",
    },
  });
  res.json({
    imageId: data.id,
  });
});

app.post("/pack/generate", async (req, res) => {
  const parsedBody = GenerateImagesFromPack.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json({
      message: "Input incorrect",
    });
    return;
  }

  const prompts = await prismaClient.packPrompts.findMany({
    where: {
      packId: parsedBody.data.packId,
    },
  });

  const images = await prismaClient.outputImages.createManyAndReturn({
    data: prompts.map((prompt) => ({
      prompt: prompt.prompt,
      userId: USER_ID,
      modelId: parsedBody.data.modelId,
      imageUrl: "",
    })),
  });

  res.json({
    images: images.map((image) => image.id),
  });
});

app.get("/pack/bulk", async (req, res) => {
  const packs = await prismaClient.packs.findMany({});
  res.json({
    packs,
  });
});

app.get("/image/bulk", async (req, res) => {
  // try {
  //   let images: string[] = [];
  //   if(Array.isArray(req.query.images)){
  //     images = req.query.images;
  //   } else if (typeof req.query.images === "string"){
  //     images = [req.query.images];
  //   }
  //   const imagesData = await prismaClient.outputImages.findMany({
  //     where: {
  //       id: { in: images },
  //       userId: USER_ID,
  //     },
  //     skip: parseInt(offset),
  //     take: parseInt(limit),
  //   });

  //   res.json({
  //     images: imagesData,
  //   });
  // } catch (error) {
  //   res.status(500).json({
  //     message: "Internal server error",
  //   });
  //   console.log("error in image/bulk", error);
  // }
  const ids = req.query.images as string[];
  const limit = (req.query.limit as string) ?? "10";
  const offset = (req.query.offset as string) ?? "0";

  const imagesData = await prismaClient.outputImages.findMany({
    where: {
      id: { in: ids },
      userId: USER_ID,
    },
    skip: parseInt(offset),
    take: parseInt(limit),
  });

  res.json({
    images: imagesData,
  });
});

app.listen(PORT, () => {
  console.log("on 8080 the server is running for the backend!!");
});
