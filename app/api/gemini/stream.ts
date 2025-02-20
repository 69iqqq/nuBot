import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // Ensure the headers are sent immediately

  const { prompt } = req.query;

  // Simulate streaming response (replace this with the actual API logic)
  let responseText = ""; // Store partial response

  const interval = setInterval(() => {
    responseText += ` ... more content from AI`;
    res.write(`data: {"partial_response": "${responseText}"}\n\n`);

    if (responseText.length > 200) { // Adjust when to finish based on response length
      clearInterval(interval);
      res.write(`data: {"done": true}\n\n`);
      res.end();
    }
  }, 1000); // Send a chunk every 1 second
}
