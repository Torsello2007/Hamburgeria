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
      <!-- Navbar -->
      <nav style="background: white; padding: 20px; border-radius: 15px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 20px;">
        <h2 style="margin: 0; color: #212529;">Staff Dashboard 🍔</h2>
        <div>
          <button (click)="view='ordini'" [style.background]="view=='ordini'?'#FF851B':'#EEE'" [style.color]="view=='ordini'?'white':'black'" style="border:none; padding:10px 20px; border-radius:8px; cursor:pointer; margin-right:10px; font-weight:bold;">ORDINI</button>
          <button (click)="view='menu'" [style.background]="view=='menu'?'#FF851B':'#EEE'" [style.color]="view=='menu'?'white':'black'" style="border:none; padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:bold;">GESTIONE MENU</button>
        </div>
      </nav>

      <!-- Vista Ordini -->
      <div *ngIf="view=='ordini'">
        <div *ngFor="let o of ordini" style="background:white; border-radius:15px; padding:20px; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
          <div>
            <h3 style="margin:0">Ordine #{{o.id}} - <span style="color:#FF851B">{{o.stato}}</span></h3>
            <p style="margin:5px 0">Totale: {{o.totale}}€</p>
          </div>
          <div style="display:flex; gap:10px">
            <button (click)="aggiornaStato(o.id, 'In preparazione')" style="background:#FF851B; color:white; border:none; padding:10px 15px; border-radius:8px; cursor:pointer;">IN PREP.</button>
            <button (click)="aggiornaStato(o.id, 'Pronto')" style="background:#2ECC40; color:white; border:none; padding:10px 15px; border-radius:8px; cursor:pointer; font-weight:bold;">PRONTO</button>
          </div>
        </div>
      </div>

      <!-- Vista Gestione Menu -->
      <div *ngIf="view=='menu'">
        <!-- FORM AGGIUNGI -->
        <div style="background:white; padding:25px; border-radius:15px; margin-bottom:25px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <h3 style="display: inline-block; margin: 0; margin-left: 1px; width: 33%; font-size: 16px;">➕ Nome Prodotto</h3>
          <h3 style="display: inline-block; margin: 0; margin-left: 57px; width: 100px; font-size: 16px;">➕ Prezzo</h3>
          <h3 style="display: inline-block; margin: 0; margin-left: 45px; font-size: 16px;">➕ Carica Foto Prodotto</h3>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <input [(ngModel)]="nuovoP.nome" placeholder="Nome (es. Burger" style="flex:2; padding:12px; border:1px solid #DDD; border-radius:8px;">
            <input [(ngModel)]="nuovoP.prezzo" type="number" placeholder="Prezzo (€)" style="width:100px; padding:12px; border:1px solid #DDD; border-radius:8px;">
            <input [(ngModel)]="nuovoP.immagine" placeholder="URL Foto Immagine" style="flex:2; padding:12px; border:1px solid #DDD; border-radius:8px;">
            <select [(ngModel)]="nuovoP.categoria" style="padding:12px; border:1px solid #DDD; border-radius:8px;">
              <option value="panini">Panini</option>
              <option value="contorni">Contorni</option>
              <option value="bevande">Bevande</option>
            </select>
            <button (click)="aggiungi()" style="background:#FF851B; color:white; border:none; padding:12px 25px; border-radius:8px; cursor:pointer; font-weight:bold;">AGGIUNGI</button>
          </div>
        </div>

        <!-- LISTA CON EDIT E DELETE -->
        <div *ngFor="let p of prodotti" style="background:white; padding:15px; margin-bottom:10px; border-radius:12px; display:flex; justify-content:space-between; align-items:center; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
           <div style="display:flex; align-items:center; gap:20px; flex:1">
              <img [src]="p.immagine" style="width:50px; height:50px; border-radius:8px; object-fit:cover" onerror="this.src='https://via.placeholder.com/50'">
              <div style="display:flex; flex-direction:column; gap:5px">
                <input [(ngModel)]="p.nome" (change)="salva(p)" style="border:none; font-weight:bold; font-size:16px; background:transparent; width:250px" title="Clicca per modificare il nome">
                <small style="color:grey; text-transform:uppercase">{{p.categoria}}</small>
              </div>
           </div>
           <div style="display:flex; align-items:center; gap:25px">
              <div style="display:flex; align-items:center;">
                <input [(ngModel)]="p.prezzo" type="number" (change)="salva(p)" style="width:70px; padding:8px; border:1px solid #EEE; border-radius:5px; font-weight:bold; text-align:center">
                <span style="margin-left:5px">€</span>
              </div>
              <button (click)="elimina(p.id)" style="color:#E74C3C; background:none; border:none; cursor:pointer; font-weight:bold; font-size:13px;">🗑️ ELIMINA</button>
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
  
  aggiornaStato(id:any, s:string) { 
    this.http.put(this.api+'/ordini/'+id, {stato:s}).subscribe(()=>this.refresh()); 
  }
  
  aggiungi() { 
    if(!this.nuovoP.nome) return;
    this.http.post(this.api+'/prodotti', this.nuovoP).subscribe(()=> {
      this.refresh();
      this.nuovoP = { nome: '', prezzo: 0, immagine: '', categoria: 'panini' };
    });
  }
  
  salva(p:any) { 
    this.http.put(this.api+'/prodotti/'+p.id, p).subscribe(()=>this.refresh()); 
  }
  
  elimina(id:any) { 
    if(confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      this.http.delete(this.api+'/prodotti/'+id).subscribe(()=>this.refresh()); 
    }
  }
}
