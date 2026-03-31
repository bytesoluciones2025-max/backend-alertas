const express = require("express");
const fetch = require("node-fetch");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

// 🔑 PEGA AQUÍ TU serviceAccount.json
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 🔥 FUNCIÓN PARA ENVIAR NOTIFICACIÓN (FCM v1)
app.post("/enviar-alerta", async (req, res) => {
  try {
    const { mensaje } = req.body;

    const message = {
      notification: {
        title: "🚨 Alerta Escolar",
        body: mensaje,
      },
      android: {
        priority: "high",
        notification: {
          sound: "default",
          channelId: "alertas_emergencia_v2",
        },
      },
      topic: "alertas",
    };

    await admin.messaging().send(message);

    res.status(200).send("✅ Notificación enviada");
  } catch (error) {
    console.error(error);
    res.status(500).send("❌ Error");
  }
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo en puerto " + PORT));
