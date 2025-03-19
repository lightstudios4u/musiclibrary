const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });
const nextConfig = {
  images: {
    domains: ["resonancestorage.sfo2.digitaloceanspaces.com"], // ✅ Allow DigitalOcean Spaces
  },
};

export default nextConfig;
