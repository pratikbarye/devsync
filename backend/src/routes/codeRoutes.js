import express from "express";

const router = express.Router();

const JUDGE0_API = "https://ce.judge0.com";

// ✅ STEP 1: Submit code
router.post("/execute", async (req, res) => {
  try {
    const { language, code } = req.body;

    // language IDs (important!)
    const languageMap = {
      javascript: 63,
      python: 71,
      java: 62,
    };

    const language_id = languageMap[language];

    if (!language_id) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    // 🔥 STEP A: Send code to Judge0
    const submitResponse = await fetch(`${JUDGE0_API}/submissions?base64_encoded=false&wait=true`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_code: code,
        language_id,
      }),
    });

    const result = await submitResponse.json();

    // 🔥 DEBUG (important)
    console.log("JUDGE0 RESPONSE:", result);

    res.json(result);

  } catch (error) {
    console.error("Judge0 Error:", error);
    res.status(500).json({ error: "Execution failed" });
  }
});

export default router;