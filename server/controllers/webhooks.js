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
