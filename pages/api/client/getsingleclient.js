import Client from "@/models/Client";
import connectDb from "@/db/mongoose";

const handler = async (req, res) => {
  if (req.method === "GET") {
    const { _id } = req.query;

    try {
      // Find the client by id and delete it
      const client = await Client.findById(_id);

      if (!client) {
        return res
          .status(404)
          .json({ success: false, error: "client not found" });
      }
      res.status(200).json({ success: true, client });
    } catch (error) {
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  } else {
    res
      .status(400)
      .json({ success: false, error: "This method is not allowed" });
  }
};

export default connectDb(handler);
