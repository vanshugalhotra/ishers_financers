import Loan from "@/models/Loan";
import connectDb from "@/db/mongoose";
import Client from "@/models/Client";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      // Fetch all unpaid loans from the database
      const unpaidLoans = await Loan.find({ paid: false }).populate({
        path: "client",
        select: "name phone image", // Specify the fields you want to populate
      });

      res.status(200).json({ success: true, loans: unpaidLoans });
    } catch (error) {
      console.error("Error fetching unpaid loans:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  } else {
    res
      .status(400)
      .json({ success: false, error: "This method is not allowed" });
  }
};

export default connectDb(handler);
