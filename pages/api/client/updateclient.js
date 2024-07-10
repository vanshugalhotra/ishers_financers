import Client from "@/models/Client";
import connectDb from "@/db/mongoose";

const handler = async (req, res) => {
  if (req.method === "PATCH") {
    const { _id, loanId } = req.body;

    try {
      const client = await Client.findByIdAndUpdate(
        _id,
        { $pull: { loans: loanId } },
        { new: true, runValidators: true }
      );

      if (!client) {
        return res
          .status(404)
          .json({ success: false, error: "Client not found" });
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
