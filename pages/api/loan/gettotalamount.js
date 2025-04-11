import Loan from "@/models/Loan";
import Client from "@/models/Client";
import connectDb from "@/db/mongoose";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      // Fetch all loans from the database
      const loans = await Loan.find();

      // Calculate the total amount of all loans
      const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);

      res.status(200).json({ success: true, totalAmount });
    } catch (error) {
      console.error("Error fetching total amount:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  } else {
    res
      .status(400)
      .json({ success: false, error: "This method is not allowed" });
  }
};

export default connectDb(handler);
