/**
 * Script de test de la messagerie WebSocket + REST
 * Usage: npx tsx test-messaging.ts
 */

import { io, Socket } from "socket.io-client";

const BASE = "http://localhost:4000";

// ─── Helpers ────────────────────────────────────────────────────────────────

async function apiPost(path: string, body: object, token?: string) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function apiGet(path: string, token: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

function connectSocket(token: string): Socket {
  return io(BASE, {
    auth: { token },
    transports: ["websocket"],
  });
}

function waitEvent(socket: Socket, event: string, timeoutMs = 3000): Promise<any> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`Timeout waiting for "${event}"`)), timeoutMs);
    socket.once(event, (data) => {
      clearTimeout(t);
      resolve(data);
    });
  });
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

let pass = 0;
let fail = 0;

function ok(label: string, detail?: string) {
  pass++;
  console.log(`  ✓ ${label}${detail ? ` — ${detail}` : ""}`);
}
function ko(label: string, err: any) {
  fail++;
  console.log(`  ✗ ${label} — ${err?.message ?? err}`);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

async function run() {
  console.log("\n🧪 Test de la messagerie GreenTrade\n");

  // 1. Login
  console.log("── Authentification ──");
  let tokenCamille: string, tokenEmma: string;
  let idCamille: string, idEmma: string;

  try {
    const r1 = await apiPost("/api/auth/login", { email: "camille@ferme-camille.fr", password: "password+123" });
    tokenCamille = r1.token;
    idCamille = r1.user?.id;
    ok("Login Camille", idCamille);
  } catch (e) { ko("Login Camille", e); process.exit(1); }

  try {
    const r2 = await apiPost("/api/auth/login", { email: "emma.dupont@example.com", password: "password+123" });
    tokenEmma = r2.token;
    idEmma = r2.user?.id;
    ok("Login Emma", idEmma);
  } catch (e) { ko("Login Emma", e); process.exit(1); }

  // 2. REST — créer une conversation
  console.log("\n── REST Conversations ──");
  let convId: string;

  try {
    const conv = await apiPost("/api/conversations", { otherUserId: idEmma }, tokenCamille);
    convId = conv.id;
    ok("POST /api/conversations — créer conversation", convId);
  } catch (e) { ko("POST /api/conversations", e); process.exit(1); }

  try {
    const conv2 = await apiPost("/api/conversations", { otherUserId: idEmma }, tokenCamille);
    if (conv2.id === convId) ok("POST /api/conversations — idempotent (retourne la même)");
    else ko("POST /api/conversations — idempotent", new Error(`IDs différents: ${conv2.id} vs ${convId}`));
  } catch (e) { ko("POST /api/conversations — idempotent", e); }

  try {
    const convs = await apiGet("/api/conversations", tokenCamille);
    if (Array.isArray(convs) && convs.length > 0) ok("GET /api/conversations", `${convs.length} conversation(s)`);
    else ko("GET /api/conversations", new Error("Tableau vide ou invalide"));
  } catch (e) { ko("GET /api/conversations", e); }

  // 3. WebSocket — connexion
  console.log("\n── WebSocket ──");
  const sockCamille = connectSocket(tokenCamille!);
  const sockEmma = connectSocket(tokenEmma!);

  await Promise.all([
    waitEvent(sockCamille, "connect").then(() => ok("Connexion WebSocket Camille")),
    waitEvent(sockEmma, "connect").then(() => ok("Connexion WebSocket Emma")),
  ]).catch((e) => { ko("Connexion WebSocket", e); process.exit(1); });

  // 4. Join conversation
  sockCamille.emit("join_conversation", convId);
  sockEmma.emit("join_conversation", convId);

  try {
    const hist = await waitEvent(sockCamille, "conversation_history");
    ok("join_conversation — historique reçu", `${hist.messages.length} message(s)`);
  } catch (e) { ko("join_conversation", e); }

  await sleep(200);

  // 5. Envoyer un message
  let sentMessageId: string;

  try {
    const msgPromise = waitEvent(sockEmma, "new_message");
    sockCamille.emit("send_message", { conversationId: convId, content: "Bonjour Emma, test WebSocket !" });
    const msg = await msgPromise;
    sentMessageId = msg.id;
    ok("send_message — Emma reçoit le message", `"${msg.content}"`);
  } catch (e) { ko("send_message", e); }

  // 6. Indicateur de frappe
  try {
    const typingPromise = waitEvent(sockEmma, "user_typing");
    sockCamille.emit("typing", { conversationId: convId, isTyping: true });
    const t = await typingPromise;
    if (t.isTyping && t.userId === idCamille) ok("typing — Emma reçoit l'indicateur");
    else ko("typing", new Error(`Données incorrectes: ${JSON.stringify(t)}`));
  } catch (e) { ko("typing", e); }

  // 7. Marquer comme lu
  try {
    const readPromise = waitEvent(sockCamille, "messages_read");
    sockEmma.emit("mark_read", convId);
    const r = await readPromise;
    if (r.userId === idEmma) ok("mark_read — Camille reçoit la confirmation");
    else ko("mark_read", new Error(JSON.stringify(r)));
  } catch (e) { ko("mark_read", e); }

  // 8. REST — GET messages
  try {
    const msgs = await apiGet(`/api/conversations/${convId}/messages`, tokenCamille!);
    if (Array.isArray(msgs) && msgs.length > 0) ok("GET /api/conversations/:id/messages", `${msgs.length} message(s)`);
    else ko("GET messages", new Error("Tableau vide"));
  } catch (e) { ko("GET messages", e); }

  // 9. Modifier un message
  try {
    const editPromise = waitEvent(sockEmma, "message_updated");
    sockCamille.emit("edit_message", { messageId: sentMessageId!, content: "Message modifié !" });
    const updated = await editPromise;
    if (updated.content === "Message modifié !") ok("edit_message — Emma reçoit la modification");
    else ko("edit_message", new Error(`Contenu: ${updated.content}`));
  } catch (e) { ko("edit_message", e); }

  // 10. Supprimer un message
  try {
    const delPromise = waitEvent(sockEmma, "message_deleted");
    sockCamille.emit("delete_message", sentMessageId!);
    const d = await delPromise;
    if (d.messageId === sentMessageId) ok("delete_message — Emma reçoit la suppression");
    else ko("delete_message", new Error(JSON.stringify(d)));
  } catch (e) { ko("delete_message", e); }

  // 11. REST — supprimer la conversation
  try {
    const res = await fetch(`${BASE}/api/conversations/${convId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${tokenCamille}` },
    });
    const data = await res.json();
    if (data.success) ok("DELETE /api/conversations/:id");
    else ko("DELETE conversation", new Error(JSON.stringify(data)));
  } catch (e) { ko("DELETE conversation", e); }

  // 12. Auth WebSocket invalide
  try {
    const badSock = io(BASE, { auth: { token: "invalid.token.here" }, transports: ["websocket"] });
    await waitEvent(badSock, "connect_error", 2000);
    ok("Auth WebSocket — token invalide rejeté");
    badSock.disconnect();
  } catch (e) { ko("Auth WebSocket — token invalide", e); }

  // Cleanup
  sockCamille.disconnect();
  sockEmma.disconnect();

  // Résultats
  console.log(`\n─────────────────────────────────`);
  console.log(`✅ ${pass} test(s) réussi(s)   ❌ ${fail} échoué(s)`);
  if (fail === 0) console.log("🎉 Tout fonctionne !\n");
  else console.log("⚠️  Des erreurs sont présentes.\n");

  process.exit(fail > 0 ? 1 : 0);
}

run().catch((e) => {
  console.error("Erreur fatale:", e);
  process.exit(1);
});
