import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  template: `
    <div style="background: #F8F9FA; min-height: 100vh; font-family: sans-serif; padding: 20px;">
      <nav style="background: white; padding: 20px; border-radius: 15px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 20px;">
        <h2 style="margin: 0;">Staff Dashboard 🍔</h2>
        <div>
          <button (click)="view='ordini'" [style.background]="view=='ordini'?'#FF851B':'#EEE'" style="border:none; padding:10px 20px; border-radius:8px; cursor:pointer; margin-right:10px;">ORDINI</button>
          <button (click)="view='menu'" [style.background]="view=='menu'?'#FF851B':'#EEE'" style="border:none; padding:10px 20px; border-radius:8px; cursor:pointer;">MENU</button>
        </div>
      </nav>

      <div *ngIf="view=='ordini'">
        <div *ngFor="let o of ordini" style="background:white; border-radius:15px; padding:20px; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h3 style="margin:0">Ordine #{{o.id}} - <small style="color:orange">{{o.stato}}</small></h3>
            <p>Totale: {{o.totale}}€</p>
          </div>
          <div>
            <button (click)="aggiornaStato(o.id, 'In preparazione')" style="background:#FF851B; color:white; border:none; padding:10px 15px; border-radius:8px; cursor:pointer; margin-right:5px;">IN PREP.</button>
            <button (click)="aggiornaStato(o.id, 'Pronto')" style="background:#2ECC40; color:white; border:none; padding:10px 15px; border-radius:8px; cursor:pointer;">PRONTO</button>
          </div>
        </div>
      </div>

      <div *ngIf="view=='menu'">
        <!-- Form di aggiunta e lista prodotti con input modificabili (come avevamo fatto) -->
        <p>Qui puoi gestire i tuoi prodotti...</p>
        <div *ngFor="let p of prodotti" style="background:white; padding:15px; margin-bottom:10px; border-radius:10px; display:flex; justify-content:space-between; align-items:center;">
             <div style="display:flex; align-items:center; gap:15px">
                <img [src]="p.immagine" style="width:40px; height:40px; border-radius:5px; object-fit:cover">
                <input [(ngModel)]="p.nome" (change)="salva(p)" style="border:none; font-weight:bold;">
             </div>
             <input [(ngModel)]="p.prezzo" type="number" (change)="salva(p)" style="width:60px;">
        </div>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  view = 'ordini'; ordini: any[] = []; prodotti: any[] = [];
  api = 'https://super-spork-x5r67qg966g7frg4-5000.app.github.dev';
  constructor(private http: HttpClient) {}
  ngOnInit() { this.refresh(); setInterval(() => this.refresh(), 5000); }
  refresh() {
    this.http.get<any[]>(this.api+'/ordini').subscribe(d => this.ordini = d);
    this.http.get<any[]>(this.api+'/prodotti').subscribe(d => this.prodotti = d);
  }
  aggiornaStato(id:any, s:string) { this.http.put(this.api+'/ordini/'+id, {stato:s}).subscribe(()=>this.refresh()); }
  salva(p:any) { this.http.put(this.api+'/prodotti/'+p.id, p).subscribe(); }
}
