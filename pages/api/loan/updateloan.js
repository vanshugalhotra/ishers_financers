import Loan from "@/models/Loan";
import connectDb from "@/db/mongoose";

const handler = async (req, res) => {
  if (req.method == "PATCH") {
    const { _id } = req.body;

    try {
      const loan = await Loan.findByIdAndUpdate(_id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!loan) {
        return res
          .status(404)
          .json({ success: false, error: "Loan not found" });
      }

      res.status(200).json({ success: true });
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
