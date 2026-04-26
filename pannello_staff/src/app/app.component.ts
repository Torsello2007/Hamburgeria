import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div style="padding: 40px; font-family: sans-serif; background: #2c3e50; color: white; min-height: 100vh;">
      <h1 style="color: #f1c40f;">👨‍🍳 Pannello Staff - Cucina</h1>
      <p>Controllo connessione... se vedi questa pagina, Angular è OK!</p>
      <button (click)="getOrdini()" style="padding: 15px; background: #f1c40f; border: none; cursor: pointer; font-weight: bold; border-radius: 5px;">🔄 AGGIORNA ORDINI</button>
      <hr>
      <div *ngFor="let o of ordini" style="background: #34495e; margin: 10px 0; padding: 15px; border-radius: 8px; border-left: 5px solid #2ecc71;">
        <h3>Ordine #{{o.id}} - Totale: {{o.totale}}€</h3>
        <p>Stato attuale: <b>{{o.stato}}</b></p>
      </div>
      <div *ngIf="ordini.length == 0" style="margin-top: 20px; color: #bdc3c7;">
        Nessun ordine trovato. Vai sul Totem (8080) e invia un ordine per testare!
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  ordini: any[] = [];
  // URL del tuo backend
  private apiUrl = 'https://super-spork-x5r67qg966g7frg4-5000.app.github.dev/ordini';

  constructor(private http: HttpClient) {}
  ngOnInit() { this.getOrdini(); }
  getOrdini() {
    this.http.get<any[]>(this.apiUrl).subscribe(
      data => this.ordini = data,
      err => console.error("Errore nel recupero ordini:", err)
    );
  }
}
