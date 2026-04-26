import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/prodotto.dart';

List<Prodotto> carrello = [];

class MenuScreen extends StatefulWidget {
  const MenuScreen({super.key});
  @override
  State<MenuScreen> createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen> {
  final String api = 'https://super-spork-x5r67qg966g7frg4-5000.app.github.dev/prodotti';
  String categoriaSelezionata = 'Tutti';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      body: Row(
        children: [
          Expanded(flex: 3, child: _buildGrid()),
          Expanded(flex: 1, child: _buildSidebar()),
        ],
      ),
    );
  }

  Widget _buildGrid() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.fromLTRB(30, 30, 30, 10),
          child: Text("HAMBURGERIA\nDIGITAL", style: TextStyle(fontSize: 35, fontWeight: FontWeight.w900, height: 0.9)),
        ),
        _buildCategoryBar(),
        Expanded(
          child: FutureBuilder<List<Prodotto>>(
            future: http.get(Uri.parse(api)).then((r) => (json.decode(r.body) as List).map((e) => Prodotto.fromJson(e)).toList()),
            builder: (context, snap) {
              if (!snap.hasData) return const Center(child: CircularProgressIndicator());
              
              var prodottiFiltrati = categoriaSelezionata == 'Tutti' 
                ? snap.data! 
                : snap.data!.where((p) => p.categoria.toLowerCase() == categoriaSelezionata.toLowerCase()).toList();

              return GridView.builder(
                padding: const EdgeInsets.all(20),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 3, childAspectRatio: 0.7, crossAxisSpacing: 15, mainAxisSpacing: 15),
                itemCount: prodottiFiltrati.length,
                itemBuilder: (context, i) {
                  final p = prodottiFiltrati[i];
                  return Container(
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)]),
                    child: Column(
                      children: [
                        Expanded(child: ClipRRect(borderRadius: const BorderRadius.vertical(top: Radius.circular(20)), child: Image.network(p.immagine, fit: BoxFit.cover, width: double.infinity, errorBuilder: (c,e,s) => Icon(Icons.fastfood, color: Colors.grey[300], size: 50)))),
                        Padding(
                          padding: const EdgeInsets.all(10),
                          child: Column(
                            children: [
                              Text(p.nome, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13), textAlign: TextAlign.center, maxLines: 1),
                              Text("${p.prezzo}€", style: const TextStyle(color: Colors.orange, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 8),
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(backgroundColor: Colors.orange, minimumSize: const Size.fromHeight(35), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
                                onPressed: () => setState(() => carrello.add(p)),
                                child: const Text("AGGIUNGI", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11)),
                              )
                            ],
                          ),
                        )
                      ],
                    ),
                  );
                },
              );
            },
          ),
        )
      ],
    );
  }

  Widget _buildCategoryBar() {
    return Container(
      height: 60,
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: ListView(
        scrollDirection: Axis.horizontal,
        children: ['Tutti', 'Panini', 'Contorni', 'Bevande'].map((cat) => Padding(
          padding: const EdgeInsets.only(right: 10),
          child: ChoiceChip(
            label: Text(cat),
            selected: categoriaSelezionata == cat,
            onSelected: (s) => setState(() => categoriaSelezionata = cat),
            selectedColor: Colors.orange,
            labelStyle: TextStyle(color: categoriaSelezionata == cat ? Colors.white : Colors.black),
          ),
        )).toList(),
      ),
    );
  }

  Widget _buildSidebar() {
    double totale = carrello.fold(0.0, (s, i) => s + i.prezzo);
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          const Text("IL TUO ORDINE", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          Expanded(child: ListView.builder(itemCount: carrello.length, itemBuilder: (c, i) => ListTile(title: Text(carrello[i].nome, style: TextStyle(fontSize: 12)), trailing: Text("${carrello[i].prezzo}€")))),
          const Divider(),
          Text("TOTALE: ${totale.toStringAsFixed(2)}€", style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 15),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.black, minimumSize: const Size.fromHeight(50), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15))),
            onPressed: carrello.isEmpty ? null : () => context.go('/carrello'),
            child: const Text("PAGA E ORDINA", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          )
        ],
      ),
    );
  }
}
