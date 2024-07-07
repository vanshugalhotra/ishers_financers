import Client from "@/models/Client";
import connectDb from "@/db/mongoose";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const { search } = req.query;
      // Create a search query for clients using a regular expression
      const clientSearchQuery = search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { phone: { $regex: search, $options: "i" } },
              { aadharNumber: { $regex: search, $options: "i" } },
              { panNumber: { $regex: search, $options: "i" } },
            ],
          }
        : {};

      // Fetch brands based on the search query
      const clients = await Client.find(clientSearchQuery);

      res.status(200).json(clients);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default connectDb(handler);
