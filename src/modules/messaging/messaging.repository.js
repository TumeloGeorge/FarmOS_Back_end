const db = require('../../db');

exports.createConversation = async (conversation) => {
  const result = await db.query(
    `INSERT INTO conversations (conversation_id, farm_id, title, conversation_type, created_by)
     VALUES (gen_random_uuid(), $1, $2, $3, $4)
     RETURNING *`,
    [conversation.farmId, conversation.title, conversation.conversationType, conversation.createdBy]
  );
  return result.rows[0];
};

exports.findConversationById = async (conversationId) => {
  const result = await db.query(
    `SELECT * FROM conversations WHERE conversation_id = $1 AND deleted_at IS NULL`,
    [conversationId]
  );
  return result.rows[0];
};

exports.findConversationForUser = async (conversationId, userId) => {
  const result = await db.query(
    `SELECT c.* FROM conversations c
     JOIN conversation_members cm ON c.conversation_id = cm.conversation_id
     WHERE c.conversation_id = $1 AND cm.user_id = $2 AND c.deleted_at IS NULL`,
    [conversationId, userId]
  );
  return result.rows[0];
};

exports.findConversationMembers = async (conversationId) => {
  const result = await db.query(
    `SELECT u.user_id, u.full_name, u.email, cm.joined_at
     FROM conversation_members cm
     JOIN users u ON cm.user_id = u.user_id
     WHERE cm.conversation_id = $1`,
    [conversationId]
  );
  return result.rows;
};

exports.addMember = async (conversationId, userId) => {
  return db.query(
    `INSERT INTO conversation_members (conversation_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (conversation_id, user_id) DO NOTHING`,
    [conversationId, userId]
  );
};

exports.removeMember = async (conversationId, userId) => {
  return db.query(
    `DELETE FROM conversation_members WHERE conversation_id = $1 AND user_id = $2`,
    [conversationId, userId]
  );
};

exports.createMessage = async (message) => {
  const result = await db.query(
    `INSERT INTO messages (message_id, conversation_id, sender_id, body, message_type, reply_to)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
     RETURNING *`,
    [message.conversationId, message.senderId, message.body, message.messageType, message.replyTo]
  );
  return result.rows[0];
};

exports.findMessageById = async (messageId) => {
  const result = await db.query(
    `SELECT * FROM messages WHERE message_id = $1 AND deleted_at IS NULL`,
    [messageId]
  );
  return result.rows[0];
};

exports.updateMessage = async (messageId, body) => {
  const result = await db.query(
    `UPDATE messages SET body = $1, is_edited = TRUE, updated_at = NOW()
     WHERE message_id = $2 AND deleted_at IS NULL
     RETURNING *`,
    [body, messageId]
  );
  return result.rows[0];
};

exports.deleteMessage = async (messageId) => {
  const result = await db.query(
    `UPDATE messages SET deleted_at = NOW(), updated_at = NOW()
     WHERE message_id = $1 AND deleted_at IS NULL
     RETURNING *`,
    [messageId]
  );
  return result.rows[0];
};

exports.markMessageRead = async (conversationId, messageId, userId) => {
  const result = await db.query(
    `INSERT INTO message_reads (conversation_id, message_id, user_id, read_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (message_id, user_id) DO UPDATE SET read_at = EXCLUDED.read_at
     RETURNING *`,
    [conversationId, messageId, userId]
  );
  return result.rows[0];
};

exports.getMessages = async (conversationId, limit = 50, offset = 0) => {
  const result = await db.query(
    `SELECT m.message_id,
             m.conversation_id,
             m.sender_id,
             u.full_name AS sender_name,
             m.message_type,
             m.body,
             m.reply_to,
             m.is_edited,
             m.created_at,
             COALESCE(json_agg(json_build_object('userId', mr.user_id, 'readAt', mr.read_at))
               FILTER (WHERE mr.user_id IS NOT NULL), '[]') AS read_by
     FROM messages m
     JOIN users u ON m.sender_id = u.user_id
     LEFT JOIN message_reads mr ON mr.message_id = m.message_id
     WHERE m.conversation_id = $1 AND m.deleted_at IS NULL
     GROUP BY m.message_id, u.full_name
     ORDER BY m.created_at ASC
     LIMIT $2 OFFSET $3`,
    [conversationId, limit, offset]
  );
  return result.rows;
};

exports.getConversations = async (userId) => {
  const result = await db.query(
    `SELECT c.conversation_id,
             c.farm_id,
             c.title,
             c.conversation_type,
             COALESCE(lm.last_message, NULL) AS last_message,
             COALESCE(ur.unread_count, 0) AS unread_count
     FROM conversations c
     JOIN conversation_members cm ON c.conversation_id = cm.conversation_id
     LEFT JOIN LATERAL (
       SELECT json_build_object(
         'messageId', m.message_id,
         'body', m.body,
         'senderName', u.full_name,
         'createdAt', m.created_at
       ) AS last_message
       FROM messages m
       JOIN users u ON u.user_id = m.sender_id
       WHERE m.conversation_id = c.conversation_id AND m.deleted_at IS NULL
       ORDER BY m.created_at DESC
       LIMIT 1
     ) lm ON TRUE
     LEFT JOIN (
       SELECT m.conversation_id,
              COUNT(*) AS unread_count
       FROM messages m
       LEFT JOIN message_reads mr
         ON m.message_id = mr.message_id AND mr.user_id = $1
       WHERE m.deleted_at IS NULL
         AND mr.message_id IS NULL
       GROUP BY m.conversation_id
     ) ur ON ur.conversation_id = c.conversation_id
     WHERE cm.user_id = $1
       AND c.deleted_at IS NULL
     ORDER BY lm.last_message->>'createdAt' DESC NULLS LAST`,
    [userId]
  );
  return result.rows;
};

exports.findConversationByTitle = async (farmId, title) => {
  const result = await db.query(
    `SELECT * FROM conversations WHERE farm_id = $1 AND title = $2 AND deleted_at IS NULL`,
    [farmId, title]
  );
  return result.rows[0];
};

exports.findDirectConversationByParticipants = async (farmId, userId, participantId) => {
  const result = await db.query(
    `SELECT c.*
     FROM conversations c
     WHERE c.farm_id = $1
       AND c.conversation_type = 'DIRECT'
       AND c.deleted_at IS NULL
       AND EXISTS (
         SELECT 1 FROM conversation_members cm WHERE cm.conversation_id = c.conversation_id AND cm.user_id = $2
       )
       AND EXISTS (
         SELECT 1 FROM conversation_members cm WHERE cm.conversation_id = c.conversation_id AND cm.user_id = $3
       )
       AND (
         SELECT COUNT(*) FROM conversation_members cm WHERE cm.conversation_id = c.conversation_id
       ) = 2`,
    [farmId, userId, participantId]
  );
  return result.rows[0];
};

exports.isUserInConversation = async (conversationId, userId) => {
  const result = await db.query(
    `SELECT 1 FROM conversation_members WHERE conversation_id = $1 AND user_id = $2`,
    [conversationId, userId]
  );
  return result.rowCount === 1;
};

exports.isUserInFarm = async (userId, farmId) => {
  const result = await db.query(
    `SELECT 1 FROM farm_memberships WHERE farm_id = $1 AND user_id = $2`,
    [farmId, userId]
  );
  return result.rowCount === 1;
};

exports.findConversationIdByMessageId = async (messageId) => {
  const result = await db.query(
    `SELECT conversation_id FROM messages WHERE message_id = $1 AND deleted_at IS NULL`,
    [messageId]
  );
  return result.rows[0]?.conversation_id;
};

exports.getUnreadCount = async (userId, conversationId) => {
  const result = await db.query(
    `SELECT COUNT(*)::int AS unread_count
     FROM messages m
     LEFT JOIN message_reads mr ON m.message_id = mr.message_id AND mr.user_id = $1
     WHERE m.conversation_id = $2
       AND m.deleted_at IS NULL
       AND mr.message_id IS NULL`,
    [userId, conversationId]
  );
  return result.rows[0]?.unread_count || 0;
};

exports.archiveConversation = async (conversationId, updates) => {
  const result = await db.query(
    `UPDATE conversations
     SET title = COALESCE($1, title), archived = COALESCE($2, archived), updated_at = NOW()
     WHERE conversation_id = $3 AND deleted_at IS NULL
     RETURNING *`,
    [updates.title || null, updates.archived === true, conversationId]
  );
  return result.rows[0];
};
