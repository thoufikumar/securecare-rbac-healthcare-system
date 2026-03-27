import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * Convert audit logs into human-readable summary
 */
function prepareAuditSummary(logs) {
  const grouped = {};

  logs.forEach((log) => {
    const userId = log?.performedBy?.userId || "unknown";

    if (!grouped[userId]) {
      grouped[userId] = {
        email: log?.performedBy?.email || "unknown",
        role: log?.performedBy?.role || "unknown",
        events: [],
      };
    }

    const time = new Date(log.timestamp?.seconds * 1000).toLocaleTimeString();

    let eventText = "";

    switch (log.action) {
      case "APPOINTMENT_CREATED":
        eventText = `Scheduled appointment for patient ${log.target?.patientId} at ${time}`;
        break;

      case "TASK_COMPLETED":
        eventText = `Completed task for patient ${log.target?.patientId} at ${time}`;
        break;

      case "PATIENT_CREATED":
        eventText = `Created patient record ${log.target?.patientId} at ${time}`;
        break;

      default:
        eventText = `${log.action} at ${time}`;
    }

    grouped[userId].events.push(eventText);
  });

  return Object.values(grouped);
}

/**
 * Build prompt for AI
 */
function buildPrompt(summary) {
  return `
You are a clinical audit AI system.

Analyze the following hospital activity logs and detect anomalies.

Focus on:
- Unrealistic speed (too many actions in short time)
- Missing or suspicious activity
- Possible fake entries or unsafe practices

Return output strictly in JSON format:

{
  "issues": [
    {
      "issue": "...",
      "severity": "low | medium | high",
      "explanation": "...",
      "recommendation": "..."
    }
  ]
}

DATA:
${JSON.stringify(summary, null, 2)}
`;
}

/**
 * Main AI Analyzer Function
 */
export async function analyzeWithAI(logs) {
  try {
    const summary = prepareAuditSummary(logs);
    const prompt = buildPrompt(summary);

    const response = await axios.post(
      process.env.AI_API_URL,
      {
        model: "grok-2-latest", // adjust if needed
        messages: [
          {
            role: "system",
            content:
              "You are an expert healthcare audit AI detecting anomalies in clinical workflows.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content =
      response.data?.choices?.[0]?.message?.content || "{}";

    // Try parsing JSON safely
    try {
      return JSON.parse(content);
    } catch (err) {
      console.warn("AI response not pure JSON, returning raw");
      return { raw: content };
    }
  } catch (error) {
    console.error("AI Analysis Error:", error.message);

    return {
      issues: [],
      error: "AI service unavailable",
    };
  }
}