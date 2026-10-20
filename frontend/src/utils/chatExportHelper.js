export const exportChatTranscript = (title = 'Conversation', messages = []) => {
  const lines = [
    `EliteEdu Chat Transcript - ${title}`,
    `Exported: ${new Date().toLocaleString()}`,
    '--------------------------------------------------',
    ...messages.map((m) => {
      const time = new Date(m.createdAt).toLocaleString();
      const text = m.message_text || (m.attachment_name ? `[Attachment: ${m.attachment_name}]` : '');
      return `[${time}] ${m.sender_name}: ${text}`;
    })
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `chat-${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
  link.click();
  URL.revokeObjectURL(url);
};
