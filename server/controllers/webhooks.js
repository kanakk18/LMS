import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebnhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.clerkWebnhooks);

    const evt = await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    console.log("📩 Webhook received:", type);

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };

        await User.create(userData)
          .then(() => console.log("✅ User created in MongoDB"))
          .catch((err) => console.error("❌ MongoDB create error:", err));

        return res.json({});
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };

        await User.findByIdAndUpdate(data.id, userData)
          .then(() => console.log("✅ User updated"))
          .catch((err) => console.error("❌ MongoDB update error:", err));

        return res.json({});
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id)
          .then(() => console.log("✅ User deleted"))
          .catch((err) => console.error("❌ MongoDB delete error:", err));

        return res.json({});
      }

      default:
        console.log("ℹ️ Unknown webhook type");
        return res.status(400).json({ error: "Unhandled event type" });
    }
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
