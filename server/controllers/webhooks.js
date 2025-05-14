import User from '../models/User.js'; // Make sure this path is correct

export const clerkWebnhooks = async (req, res) => {
  try {
    const { type, data } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0]?.email_address || '',
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          imageUrl: data.image_url || '',
        };

        await User.create(userData);
        console.log("✅ User created in MongoDB");
        break;
      }

      case "user.updated": {
        await User.findByIdAndUpdate(
          data.id,
          {
            email: data.email_addresses[0]?.email_address || '',
            name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
            imageUrl: data.image_url || '',
          },
          { new: true }
        );
        console.log("✅ User updated");
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        console.log("✅ User deleted");
        break;
      }

      default:
        console.warn("⚠️ Unknown Clerk event type:", type);
    }

    return res.status(200).json({ message: "Webhook processed" });
  } catch (err) {
    console.error("❌ Error processing Clerk webhook:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
