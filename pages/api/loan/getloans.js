import Loan from "@/models/Loan";
import Client from "@/models/Client";
import connectDb from "@/db/mongoose";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const { search } = req.query;

      const clientQuery = search
        ? { name: { $regex: search, $options: "i" } }
        : {};

      const clients = await Client.find(clientQuery);
      const clientIDs = clients.map((client) => client._id);

      // Create a search query for loans using a regular expression
      const loanSearchQuery = search
        ? {
            $or: [
              { loanNo: { $regex: search, $options: "i" } },
              { type: { $regex: search, $options: "i" } },
              { client: { $in: clientIDs } },
            ],
          }
        : {};

      const loans = await Loan.find(loanSearchQuery)
        .populate("client", "name")

      res.status(200).json(loans);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default connectDb(handler);
