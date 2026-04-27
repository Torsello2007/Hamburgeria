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
  String categoria = 'panini';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      body: Row(
        children: [
          Expanded(flex: 3, child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Padding(padding: EdgeInsets.all(30), child: Text("HAMBURGERIA\nDIGITAL", style: TextStyle(fontSize: 30, fontWeight: FontWeight.w900, height: 0.9))),
              Row(mainAxisAlignment: MainAxisAlignment.center, children: ['Panini', 'Contorni', 'Bevande'].map((c) => Padding(
                padding: const EdgeInsets.symmetric(horizontal: 5),
                child: ChoiceChip(label: Text(c), selected: categoria == c.toLowerCase(), onSelected: (s) => setState(() => categoria = c.toLowerCase()), selectedColor: Colors.orange, labelStyle: TextStyle(color: categoria == c.toLowerCase() ? Colors.white : Colors.black, fontSize: 12)),
              )).toList()),
              Expanded(child: _buildGrid()),
            ],
          )),
          Expanded(flex: 1, child: _buildSidebar()),
        ],
      ),
    );
  }

  Widget _buildGrid() {
    return FutureBuilder<List<Prodotto>>(
      future: http.get(Uri.parse(api)).then((r) => (json.decode(r.body) as List).map((e) => Prodotto.fromJson(e)).where((p)=>p.categoria.toLowerCase()==categoria).toList()),
      builder: (context, snap) {
        if (snap.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator(color: Colors.orange));
        if (!snap.hasData || snap.data!.isEmpty) return const Center(child: Text("Nessun prodotto in questa categoria"));
        return GridView.builder(
          padding: const EdgeInsets.all(20),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 3, childAspectRatio: 0.7, crossAxisSpacing: 10, mainAxisSpacing: 10),
          itemCount: snap.data!.length,
          itemBuilder: (context, i) {
            final p = snap.data![i];
            return Container(
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(15), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 5)]),
              child: Column(children: [
                Expanded(child: ClipRRect(borderRadius: const BorderRadius.vertical(top: Radius.circular(15)), child: Image.network(p.immagine, fit: BoxFit.cover, width: double.infinity, errorBuilder: (c,e,s)=>const Icon(Icons.fastfood, size: 30, color: Colors.grey)))),
                Padding(padding: const EdgeInsets.all(5), child: Column(children: [
                  Text(p.nome, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11), textAlign: TextAlign.center, maxLines: 1),
                  Text("${p.prezzo}€", style: const TextStyle(color: Colors.orange, fontWeight: FontWeight.bold, fontSize: 11)),
                  ElevatedButton(style: ElevatedButton.styleFrom(backgroundColor: Colors.orange, minimumSize: const Size.fromHeight(25), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5))), onPressed: () => setState(() => carrello.add(p)), child: const Text("ADD", style: TextStyle(color: Colors.white, fontSize: 9)))
                ]))
              ]),
            );
          },
        );
      },
    );
  }

  Widget _buildSidebar() {
    double totale = carrello.fold(0.0, (s, i) => s + i.prezzo);
    return Container(color: Colors.white, padding: const EdgeInsets.all(15), child: Column(children: [
      const Text("ORDINE", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
      Expanded(child: ListView.builder(itemCount: carrello.length, itemBuilder: (c, i) => ListTile(dense: true, title: Text(carrello[i].nome, style: const TextStyle(fontSize: 10)), trailing: Text("${carrello[i].prezzo}€", style: const TextStyle(fontSize: 10))))),
      const Divider(),
      Text("TOTALE: ${totale.toStringAsFixed(2)}€", style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
      const SizedBox(height: 10),
      ElevatedButton(style: ElevatedButton.styleFrom(backgroundColor: Colors.black, minimumSize: const Size.fromHeight(45), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))), onPressed: carrello.isEmpty ? null : () => context.go('/carrello'), child: const Text("PAGA", style: TextStyle(color: Colors.white, fontSize: 14)))
    ]));
  }
}
