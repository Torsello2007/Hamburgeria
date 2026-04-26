import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  template: `
    <div style="background: #F8F9FA; min-height: 100vh; font-family: 'Segoe UI', sans-serif;">
      <nav style="background: white; padding: 20px 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center;">
        <h1 style="margin: 0; color: #212529;">Staff Dashboard 🍔</h1>
        <div>
          <button (click)="view='ordini'" [style.background]="view=='ordini'?'#FF851B':'#E9ECEF'" [style.color]="view=='ordini'?'white':'black'" style="border:none; padding:10px 20px; border-radius:8px; cursor:pointer; margin-right:10px; font-weight:bold;">GESTIONE ORDINI</button>
          <button (click)="view='menu'" [style.background]="view=='menu'?'#FF851B':'#E9ECEF'" [style.color]="view=='menu'?'white':'black'" style="border:none; padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:bold;">GESTIONE MENU</button>
        </div>
      </nav>

      <div style="padding: 40px;">
        <!-- GESTIONE MENU -->
        <div *ngIf="view=='menu'">
          <div style="background:white; padding:30px; border-radius:15px; margin-bottom:30px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
            <h3 style="margin-top:0">Nuovo Prodotto</h3>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <input [(ngModel)]="nuovoP.nome" placeholder="Nome Panino" style="padding:12px; border:1px solid #DDD; border-radius:8px; flex:1">
              <input [(ngModel)]="nuovoP.prezzo" type="number" placeholder="Prezzo (€)" style="padding:12px; border:1px solid #DDD; border-radius:8px; width:120px">
              <input [(ngModel)]="nuovoP.immagine" placeholder="URL Foto Prodotto" style="padding:12px; border:1px solid #DDD; border-radius:8px; flex:2">
              <select [(ngModel)]="nuovoP.categoria" style="padding:12px; border:1px solid #DDD; border-radius:8px;">
                <option value="panini">Panini</option>
                <option value="contorni">Contorni</option>
                <option value="bevande">Bevande</option>
              </select>
              <button (click)="aggiungi()" style="background:#FF851B; color:white; border:none; padding:12px 30px; border-radius:8px; cursor:pointer; font-weight:bold;">AGGIUNGI</button>
            </div>
          </div>
          <div *ngFor="let p of prodotti" style="background:white; padding:15px; border-radius:10px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="display:flex; align-items:center; gap:15px">
              <img [src]="p.immagine" style="width:40px; height:40px; border-radius:8px; object-fit:cover">
              <b>{{p.nome}}</b> <span style="color:grey; font-size:12px">({{p.categoria}})</span>
            </div>
            <div>
              <span style="margin-right:20px; font-weight:bold">{{p.prezzo}}€</span>
              <button (click)="elimina(p.id)" style="color:#e74c3c; background:none; border:none; cursor:pointer; font-weight:bold;">ELIMINA</button>
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
              <button (click)="aggiornaStato(o.id, 'In preparazione')" style="background:#E9ECEF; border:none; padding:10px 15px; border-radius:8px; cursor:pointer;">In Prep.</button>
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
  aggiungi() { 
    if(!this.nuovoP.nome || !this.nuovoP.immagine) return;
    this.http.post(this.api+'/prodotti', this.nuovoP).subscribe(()=> {
      this.refresh(); 
      this.nuovoP={nome:'',prezzo:0,immagine:'',categoria:'panini'};
    }); 
  }
  elimina(id:any) { if(confirm('Eliminare prodotto?')) this.http.delete(this.api+'/prodotti/'+id).subscribe(()=>this.refresh()); }
}
