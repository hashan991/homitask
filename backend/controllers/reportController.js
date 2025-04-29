const { generateDatabaseReport } = require("../report/reportService");

async function generateReport(req, res) {
  try {
    const report = await generateDatabaseReport();
    res.status(200).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate report", error });
  }
}

module.exports = { generateReport };
