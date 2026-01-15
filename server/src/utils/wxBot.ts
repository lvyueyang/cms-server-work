import axios from 'axios';

interface SendWxBotMsgOptions {
  url?: string;
  mentioned_list?: string[];
  mentioned_mobile_list?: string[];
}
export function sendWxBotMsg(content: string, options: SendWxBotMsgOptions = {}) {
  return axios.post(options.url || ``, {
    msgtype: 'markdown',
    markdown: {
      content,
      ...options,
    },
  });
}
