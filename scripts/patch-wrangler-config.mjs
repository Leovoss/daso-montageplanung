import { readFileSync, writeFileSync } from "node:fs";

const path = "dist/server/wrangler.json";
const config = JSON.parse(readFileSync(path, "utf8"));

config.name = "daso-montageplanung";
config.topLevelName = "daso-montageplanung";
config.d1_databases = [
  {
    binding: "DB",
    database_name: "daso-montageplanung",
    database_id: "42f5d224-bb84-4fd2-a1f8-d6abfda88956",
  },
];
config.r2_buckets = [
  { binding: "BUCKET", bucket_name: "daso-montageplanung-files" },
];

writeFileSync(path, JSON.stringify(config));
console.log("Patched dist/server/wrangler.json with production D1/R2 bindings.");
