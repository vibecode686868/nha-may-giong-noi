// Cổng trung gian gọi AI: nhận key của từng người dùng, chuyển tiếp yêu cầu, KHÔNG lưu key.
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Chỉ hỗ trợ phương thức POST." });
    return;
  }
  const { provider, apiKey, model, prompt } = req.body || {};
  if (!provider || !apiKey || !model || !prompt) {
    res.status(400).json({ error: "Thiếu thông tin: nhà cung cấp, API key, model hoặc nội dung." });
    return;
  }
  if (String(prompt).length > 8000) {
    res.status(400).json({ error: "Nội dung quá dài." });
    return;
  }

  try {
    let text = "";
    if (provider === "claude") {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model, max_tokens: 1500, messages: [{ role: "user", content: prompt }] })
      });
      const j = await r.json();
      if (!r.ok) throw new Error((j.error && j.error.message) || "Claude trả về lỗi " + r.status);
      text = (j.content || []).filter(c => c.type === "text").map(c => c.text).join("");
    } else if (provider === "openai") {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: "Bearer " + apiKey },
        body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }] })
      });
      const j = await r.json();
      if (!r.ok) throw new Error((j.error && j.error.message) || "ChatGPT trả về lỗi " + r.status);
      text = j.choices && j.choices[0] && j.choices[0].message ? j.choices[0].message.content : "";
    } else if (provider === "gemini") {
      const url = "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent";
      const r = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
      });
      const j = await r.json();
      if (!r.ok) throw new Error((j.error && j.error.message) || "Gemini trả về lỗi " + r.status);
      const parts = j.candidates && j.candidates[0] && j.candidates[0].content ? j.candidates[0].content.parts : [];
      text = (parts || []).map(p => p.text || "").join("");
    } else {
      res.status(400).json({ error: "Nhà cung cấp không hợp lệ." });
      return;
    }
    res.status(200).json({ text });
  } catch (e) {
    res.status(502).json({ error: e.message || "Không gọi được AI." });
  }
};
