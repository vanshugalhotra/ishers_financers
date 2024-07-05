import Client from "@/models/Client";
import connectDb from "@/db/mongoose";

const handler = async (req, res) => {
  if (req.method == "POST") {
    try {
      let client = new Client(req.body);
      await client.save();

      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false });
    }
  } else {
    res
      .status(400)
      .json({ success: false, error: "This method is not allowed" });
  }
};

export default connectDb(handler);
