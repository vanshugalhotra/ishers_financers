import Loan from "@/models/Loan";
import Client from "@/models/Client";
import connectDb from "@/db/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      // Create a new loan instance
      let loan = new Loan(req.body);

      // Save the loan to get the loan ID
      await loan.save();

      // Find the client and update its loans array
      const client = await Client.findById(loan.client);
      if (!client) {
        return res.status(404).json({ success: false, error: "Client not found" });
      }

      // Add the new loan's ID to the client's loans array
      client.loans.push(loan._id);

      // Save the client with updated loans array
      await client.save();

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error adding loan:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  } else {
    res.status(400).json({ success: false, error: "This method is not allowed" });
  }
};

export default connectDb(handler);
