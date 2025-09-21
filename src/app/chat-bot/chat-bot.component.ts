
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatbotService, ChatTurn } from '../services/chatbot.service';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent {
open = false;
  input = '';
  sending = false;
  suggestions: string[] = ['What is the minimum order?', 'Do you deliver to my area?', 'Contact details'];

  messages: ChatTurn[] = [
    { role: 'assistant', content: 'Hi! I’m the Mushroom Store assistant. Ask me about products, delivery, or orders.' }
  ];

  @ViewChild('scrollArea') scrollArea!: ElementRef<HTMLDivElement>;

  constructor(private chat: ChatbotService) {}

  toggle() { this.open = !this.open; setTimeout(() => this.scrollToBottom(), 0); }
  pick(s: string) { this.input = s; this.send(); }

  send() {
    const text = this.input.trim();
    if (!text || this.sending) return;
    this.messages.push({ role: 'user', content: text });
    this.input = '';
    this.sending = true;
    this.scrollToBottom();

    this.chat.send(text, this.messages.slice(-10)).subscribe({
      next: (res) => {
        if (res.suggestions) this.suggestions = res.suggestions;
        this.messages.push({ role: 'assistant', content: res.reply });
        this.sending = false;
        this.scrollToBottom();
      },
      error: () => {
        this.messages.push({ role: 'assistant', content: 'Sorry, something went wrong. Please try again.' });
        this.sending = false;
        this.scrollToBottom();
      }
    });
  }

  private scrollToBottom() {
    if (!this.scrollArea) return;
    const el = this.scrollArea.nativeElement;
    setTimeout(() => el.scrollTop = el.scrollHeight, 0);
  }
}
