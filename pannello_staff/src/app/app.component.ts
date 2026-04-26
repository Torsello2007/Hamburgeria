import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  template: `
    <div style="background: #F8F9FA; min-height: 100vh; font-family: sans-serif;">
      <nav style="background: white; padding: 20px 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center;">
        <h1 style="margin: 0; color: #212529;">Staff Dashboard 🍔</h1>
        <div>
          <button (click)="view='ordini'" [style.background]="view=='ordini'?'#FF851B':'#E9ECEF'" [style.color]="view=='ordini'?'white':'black'" style="border:none; padding:10px 20px; border-radius:8px; cursor:pointer; margin-right:10px; font-weight:bold;">ORDINI</button>
          <button (click)="view='menu'" [style.background]="view=='menu'?'#FF851B':'#E9ECEF'" [style.color]="view=='menu'?'white':'black'" style="border:none; padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:bold;">MENU</button>
        </div>
      </nav>

      <div style="padding: 40px;">
        <!-- GESTIONE MENU -->
        <div *ngIf="view=='menu'">
          <div style="background:white; padding:30px; border-radius:15px; margin-bottom:30px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <h3 style="margin-top:0">Nuovo Prodotto</h3>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <input [(ngModel)]="nuovoP.nome" placeholder="Nome Prodotto" style="padding:12px; border:1px solid #DDD; border-radius:8px; flex:1">
              <input [(ngModel)]="nuovoP.prezzo" type="number" placeholder="Prezzo (€)" style="padding:12px; border:1px solid #DDD; border-radius:8px; width:120px">
              <input [(ngModel)]="nuovoP.immagine" placeholder="Carica Foto (URL)" style="padding:12px; border:1px solid #DDD; border-radius:8px; flex:2">
              <select [(ngModel)]="nuovoP.categoria" style="padding:12px; border:1px solid #DDD; border-radius:8px;">
                <option value="panini">Panini</option>
                <option value="contorni">Contorni</option>
                <option value="bevande">Bevande</option>
              </select>
              <button (click)="aggiungi()" style="background:#FF851B; color:white; border:none; padding:12px 30px; border-radius:8px; cursor:pointer; font-weight:bold;">AGGIUNGI</button>
            </div>
          </div>

          <div *ngFor="let p of prodotti" style="background:white; padding:15px; border-radius:10px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="display:flex; align-items:center; gap:15px; flex:1">
              <img [src]="p.immagine" style="width:50px; height:50px; border-radius:10px; object-fit:cover">
              <input [(ngModel)]="p.nome" (change)="salva(p)" style="border:none; font-weight:bold; font-size:16px; width:200px">
            </div>
            <div style="display:flex; align-items:center; gap:20px">
              <input [(ngModel)]="p.prezzo" type="number" (change)="salva(p)" style="width:80px; padding:5px; border:1px solid #EEE; border-radius:5px; text-align:center">
              <button (click)="elimina(p.id)" style="color:#e74c3c; border:none; background:none; cursor:pointer; font-weight:bold;">ELIMINA</button>
            </div>
          </div>
        </div>

        <!-- ORDINI -->
        <div *ngIf="view=='ordini'">
          <div *ngFor="let o of ordini" style="background:white; border-radius:15px; padding:20px; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
            <div>
              <h3 style="margin:0">Ordine #{{o.id}}</h3>
              <p style="margin:5px 0">Stato: <b style="color:#FF851B">{{o.stato}}</b> | Totale: {{o.totale}}€</p>
            </div>
            <div style="display:flex; gap:10px">
              <button (click)="aggiornaStato(o.id, 'In preparazione')" style="background:#FF851B; color:white; border:none; padding:10px 15px; border-radius:8px; cursor:pointer; font-weight:bold;">IN PREP.</button>
              <button (click)="aggiornaStato(o.id, 'Pronto')" style="background:#2ECC40; color:white; border:none; padding:10px 15px; border-radius:8px; cursor:pointer; font-weight:bold;">PRONTO</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  view = 'ordini';
  ordini: any[] = [];
  prodotti: any[] = [];
  nuovoP = { nome: '', prezzo: 0, immagine: '', categoria: 'panini' };
  api = 'https://super-spork-x5r67qg966g7frg4-5000.app.github.dev';

  constructor(private http: HttpClient) {}
  ngOnInit() { this.refresh(); setInterval(() => this.refresh(), 5000); }
  refresh() {
    this.http.get<any[]>(this.api+'/ordini').subscribe(d => this.ordini = d);
    this.http.get<any[]>(this.api+'/prodotti').subscribe(d => this.prodotti = d);
  }
  aggiornaStato(id:any, s:string) { this.http.put(this.api+'/ordini/'+id, {stato:s}).subscribe(()=>this.refresh()); }
  aggiungi() { this.http.post(this.api+'/prodotti', this.nuovoP).subscribe(()=> { this.refresh(); this.nuovoP={nome:'',prezzo:0,immagine:'',categoria:'panini'}; }); }
  salva(p:any) { this.http.put(this.api+'/prodotti/'+p.id, p).subscribe(); }
  elimina(id:any) { if(confirm('Eliminare?')) this.http.delete(this.api+'/prodotti/'+id).subscribe(()=>this.refresh()); }
}
