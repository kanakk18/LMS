import User from '../models/User.js'; // Adjust path if needed

export const clerkWebnhooks = async (req, res) => {
  try {
    const event = req.body;
    const type = event.type;
    const data = event.data;

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

    res.status(200).json({ message: "Webhook processed" });

  } catch (err) {
    console.error("❌ Error processing webhook:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
