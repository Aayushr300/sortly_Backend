// controllers/policy.controller.js
const { getStaticPage } = require("../services/policy.service");

exports.getPolicyPage = async (req, res) => {
  const { pageKey } = req.params;

  try {
    const result = await getStaticPage(pageKey);

    if (!result) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error in getPolicyPage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
