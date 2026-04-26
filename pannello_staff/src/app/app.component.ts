import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  template: `
    <div style="padding: 20px; font-family: sans-serif; background: #2c3e50; color: white; min-height: 100vh;">
      <h1>👨‍🍳 Pannello Staff - Ordini</h1>
      <button (click)="getOrdini()" style="padding: 10px; background: #f1c40f; border: none; cursor: pointer;">Aggiorna Ordini</button>
      <div *ngFor="let o of ordini" style="background: #34495e; margin: 10px 0; padding: 15px; border-radius: 5px;">
        <h3>Ordine #{{o.id}} [{{o.stato}}] - Totale: {{o.totale}}€</h3>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  ordini: any[] = [];
  constructor(private http: HttpClient) {}
  ngOnInit() { this.getOrdini(); }
  getOrdini() {
    this.http.get<any[]>('https://super-spork-x5r67qg966g7frg4-5000.app.github.dev/ordini').subscribe(data => this.ordini = data);
  }
}
