import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebnhooks = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET); // make sure env var is correct

    const payload = req.body.toString(); // get raw body
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const evt = wh.verify(payload, headers); // verify signature
    const { data, type } = JSON.parse(payload);

    console.log("📩 Webhook received:", type);

    switch (type) {
      case "user.created":
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };

        await User.create(userData);
        console.log("✅ User created in MongoDB");
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        });
        console.log("✅ User updated");
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        console.log("✅ User deleted");
        break;

      default:
        console.log("⚠️ Unknown event type:", type);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    return res.status(400).json({ error: err.message });
  }
};
