const express = require("express");
const app = express();
app.use(express.json());

const EVENTS = {
  "Zomaland": { capacity: 100, booked: 75, location: "JP Nagar", time: "2 PM" },
  "ComicCon": { capacity: 50, booked: 40, location: "Indiranagar", time: "3 PM" },
  "MarketFest": { capacity: 30, booked: 20, location: "Koramangala", time: "10 AM" }
};

app.post("/check-event", (req, res) => {
  const { eventName, people } = req.body;
  const count = parseInt(people);
  const event = EVENTS[eventName];

  if (!event) {
    const alternatives = Object.entries(EVENTS)
      .filter(([name, e]) => e.capacity - e.booked >= count)
      .map(([name, e]) => `${name} at ${e.location} – ${e.time} – ${e.capacity - e.booked} slots`);

    return res.json({
      status: "fail",
      message: "Event not found or insufficient slots",
      available: false,
      alternatives
    });
  }

  const remaining = event.capacity - event.booked;

  if (count <= remaining) {
    return res.json({
      status: "success",
      message: `✅ ${count} slots available for ${eventName}`,
      available: true
    });
  } else {
    const alternatives = Object.entries(EVENTS)
      .filter(([name, e]) => e.capacity - e.booked >= count && name !== eventName)
      .map(([name, e]) => `${name} at ${e.location} – ${e.time} – ${e.capacity - e.booked} slots`);

    return res.json({
      status: "fail",
      message: `❌ Only ${remaining} slots left for ${eventName}`,
      available: false,
      remaining,
      alternatives
    });
  }
});

app.get("/", (req, res) => res.send("Webhook running ✅"));
app.listen(process.env.PORT || 3000, () => console.log("Server started"));