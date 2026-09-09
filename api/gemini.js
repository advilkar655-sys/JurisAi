import https from 'https';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      success: false,
      error: 'GEMINI_API_KEY environment variable is not configured in Vercel settings.'
    });
  }

  let bodyData = req.body;
  if (typeof bodyData === 'string') {
    try { bodyData = JSON.parse(bodyData); } catch (e) {}
  }

  const { prompt, systemInstruction } = bodyData || {};
  const combinedPrompt = systemInstruction 
    ? `[SYSTEM INSTRUCTION]\n${systemInstruction}\n\n[USER REQUEST]\n${prompt}` 
    : prompt;

  try {
    const textOutput = await callGeminiServerless(combinedPrompt, apiKey);
    return res.status(200).json({ success: true, text: textOutput });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

function callGeminiServerless(promptText, apiKey) {
  return new Promise((resolve, reject) => {
    const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.5-pro", "gemini-1.5-pro"];
    const versions = ["v1beta", "v1"];
    let mIdx = 0, vIdx = 0;

    function tryNext() {
      if (vIdx >= versions.length) {
        return reject(new Error("Unable to connect to Google Gemini API. Please check your API key."));
      }

      const ver = versions[vIdx];
      const model = models[mIdx];

      const postData = JSON.stringify({
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        generationConfig: { temperature: 0.2, topP: 0.95 }
      });

      const request = https.request({
        hostname: 'generativelanguage.googleapis.com',
        path: `/${ver}/models/${model}:generateContent?key=${apiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, response => {
        let resBody = '';
        response.on('data', chunk => { resBody += chunk; });
        response.on('end', () => {
          if (response.statusCode === 200) {
            try {
              const data = JSON.parse(resBody);
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) return resolve(text);
            } catch (e) {}
          }
          mIdx++;
          if (mIdx >= models.length) {
            mIdx = 0;
            vIdx++;
          }
          tryNext();
        });
      });

      request.on('error', () => {
        mIdx++;
        if (mIdx >= models.length) {
          mIdx = 0;
          vIdx++;
        }
        tryNext();
      });

      request.write(postData);
      request.end();
    }

    tryNext();
  });
}
