import { z } from "zod";

const GenederEnum = z.enum(["Man", "Woman", "others"]);
const EthnicityEnum = z.enum([
  "White",
  "Black",
  "Asian_American",
  "East_Asian",
  "South_East_Asian",
  "Middle_Eastern",
  "Pacific",
  "Hispanic",
]);
const EyeColorEnum = z.enum(["Brown", "Blue", "Hazel", "Gray"]);

export const TrainModel = z.object({
  name: z.string(),
  type: GenederEnum,
  age: z.number(),
  ethinicity: EthnicityEnum,
  eyeColor: EyeColorEnum,
  bald: z.boolean(),
  images: z.array(z.string()),
});

export const GenerateImage = z.object({
  prompt: z.string(),
  modelId: z.string(),
  num: z.number(),
});

export const GenerateImagesFromPack = z.object({
  modelId: z.string(),
  packId: z.string(),
});
