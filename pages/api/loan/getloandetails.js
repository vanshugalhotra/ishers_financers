import Loan from "@/models/Loan";
import connectDb from "@/db/mongoose";
import Client from "@/models/Client";

const handler = async (req, res) => {
  if (req.method === "GET") {
    const { _id } = req.query;

    try {
      // Find the loan by id
      const loan = await Loan.findById(_id);

      if (!loan) {
        return res
          .status(404)
          .json({ success: false, error: "loan not found" });
      }
      res.status(200).json({ success: true, loan });
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
