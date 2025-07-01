import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from 'stompjs';

export function NotificationPanel() {
  const [messages, setMessages] = useState<string[]>([]);
  useEffect(() => {
    const sock = new SockJS('http://localhost:8080/ws');
    const stomp = new Client({
      webSocketFactory: () => sock as any,
      debug: () => {},
    });
    stomp.onConnect = () => {
      stomp.subscribe('/topic/notifications', msg => {
        setMessages(prev => [...prev, msg.body || '']);
      });
    };
    stomp.activate();
    return () => { stomp.deactivate(); }
  }, []);
  return (
    <div style={{border:'1px solid #ccc', padding:8, margin:8}}><b>실시간 알림</b><ul>{messages.map((m,i) => <li key={i}>{m}</li>)}</ul></div>
  );
}

