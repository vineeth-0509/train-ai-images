import { z } from "zod";

const GenederEnum = z.enum(["Man", "Woman", "Other"]);
const EthnicityEnum = z.enum([
  "White",
  "Black",
  "Asian American",
  "East Asian",
  "South East Asian",
  "Middle Eastern",
  "Pacific",
  "Hispanic",
]);
const EyeColorEnum = z.enum(["Brown", "Blue", "Hazel", "Gray"]);

export const TrainModel = z.object({
  name: z.string(),
  type: GenederEnum,
  age: z.number(),
  ethnicity: EthnicityEnum,
  eyeColor: EyeColorEnum,
  bald: z.boolean(),
  images: z.array(z.string()),
});

export const GenerateImage = z.object({
  prompt: z.string(),
  modelId: z.string(),
  num: z.number(),
});

export const GeneralImagesFromPack = z.object({
  modelId: z.string(),
  packId: z.string(),
});
