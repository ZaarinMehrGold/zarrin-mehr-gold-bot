export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const token = env.TELEGRAM_BOT_TOKEN;
    const api = `https://api.telegram.org/bot${token}`;

    if (url.pathname === "/setup") {
      const r = await fetch(`${api}/setWebhook?url=${url.origin}/webhook`);
      return new Response(await r.text());
    }

    if (url.pathname !== "/webhook") {
      return new Response("Zarrin Mehr Gold Bot is running!");
    }

    const update = await request.json();
    const msg = update.message;
    if (!msg) return new Response("OK");

    const chat = msg.chat.id;
    const text = msg.text || "";

    let reply = "به ربات زرین مهر خوش آمدید 💛";
    let keyboard = {
      keyboard: [
        ["🪙 محاسبه طلا"],
        ["💛 نیکوکاری"],
        ["📖 راهنما"]
      ],
      resize_keyboard: true
    };

    if (text === "/start") {
      reply = "به زرین مهر خوش آمدید 💛\nخدمات ما را از منو انتخاب کنید.";
    } else if (text.includes("نیکوکاری")) {
      reply = "💛 بخش مهر نیکوکاری زرین مهر در حال آماده‌سازی است.";
    } else if (text.includes("محاسبه طلا")) {
      reply = "🪙 بخش محاسبه طلا در حال آماده‌سازی است.";
    } else if (text.includes("راهنما") || text === "/help") {
      reply = "برای شروع، یکی از گزینه‌های منو را انتخاب کنید.";
    }

    await fetch(`${api}/sendMessage`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        chat_id: chat,
        text: reply,
        reply_markup: keyboard
      })
    });

    return new Response("OK");
  }
};
