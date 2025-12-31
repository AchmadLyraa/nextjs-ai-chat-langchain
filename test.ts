import { JSONLoader } from "@langchain/classic/document_loaders/fs/json";

const loader = new JSONLoader("src/data/data.json", [
  "/state",
  "/code",
  "/nickname",
  // "/website",
  // "/admission_date",
  // "/admission_number",
  // "/capital_city",
  // "/capital_url",
  // "/population",
  // "/population_rank",
  // "/constitution_url",
  // "/twitter_url",
]);

const docs = await loader.load();

console.log(docs);
