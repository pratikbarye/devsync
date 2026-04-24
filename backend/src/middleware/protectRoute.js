import { requireAuth } from "@clerk/express";
import User from "../models/User.js";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { upsertStreamUser } from "../lib/stream.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;

      if (!clerkId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // 1️⃣ check if user exists
      let user = await User.findOne({ clerkId });

      // 2️⃣ if NOT exist → fetch from Clerk
      if (!user) {
        const clerkUser = await clerkClient.users.getUser(clerkId);

        const email = clerkUser.emailAddresses[0]?.emailAddress;
        const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`;
        const image = clerkUser.imageUrl;

        // 3️⃣ create user in DB
        user = await User.create({
          clerkId,
          email,
          name,
          profileImage: image,
        });

        // 4️⃣ sync with Stream
        await upsertStreamUser({
          id: clerkId,
          name,
          image,
        });

        console.log("✅ New user created + synced");
      }

      // 5️⃣ attach user
      req.user = user;

      next();
    } catch (error) {
      console.error("❌ protectRoute error:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];