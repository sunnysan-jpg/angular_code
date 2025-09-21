import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ChatTurn { role: 'user'|'assistant'; content: string; }

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {   

  private api = 'https://ecommerce-mushroom.onrender.com/api/chat-bot/chat';
  private sidKey = 'dunnyyadav';

  constructor(private http: HttpClient) {}

  getSessionId(): string {
    let sid = localStorage.getItem(this.sidKey);
    if (!sid) { sid = 'sid_' + Math.random().toString(36).slice(2); localStorage.setItem(this.sidKey, sid); }
    return sid;
  }

  send(message: string, history: ChatTurn[]) {
    const sessionId = this.getSessionId();
    return this.http.post<{reply:string; suggestions?:string[]; sessionId:string}>(this.api, {
      message,
      history,
      sessionId
    });
  }
}
