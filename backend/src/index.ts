import { createApp } from './app';

const PORT = process.env.PORT || 3000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`[CalendarUnite Backend] Servidor activo en http://localhost:${PORT}`);
});
