import Loan from "@/models/Loan";
import connectDb from "@/db/mongoose";

const handler = async (req, res) => {
  if (req.method === "DELETE") {
    const { _id } = req.query;

    try {
      // Find the loan by id and delete it
      const loan = await Loan.findByIdAndDelete(_id);

      if (!loan) {
        return res
          .status(404)
          .json({ success: false, error: "loan not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "loan deleted successfully" });
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
