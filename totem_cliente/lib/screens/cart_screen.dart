import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'menu_screen.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});
  @override
  Widget build(BuildContext context) {
    double totale = carrello.fold(0.0, (s, i) => s + i.prezzo);
    return Scaffold(
      appBar: AppBar(title: const Text("CONFERMA")),
      body: Column(
        children: [
          Expanded(child: ListView.builder(itemCount: carrello.length, itemBuilder: (c, i) => ListTile(title: Text(carrello[i].nome), trailing: Text("${carrello[i].prezzo}€")))),
          Container(
            padding: const EdgeInsets.all(20),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.orange, minimumSize: const Size.fromHeight(60)),
              onPressed: () async {
                final r = await http.post(
                  Uri.parse('https://super-spork-x5r67qg966g7frg4-5000.app.github.dev/ordini'),
                  headers: {'Content-Type': 'application/json'},
                  body: json.encode({'totale': totale, 'prodotti': carrello.map((p) => {'id': p.id, 'quantita': 1}).toList()})
                );
                if (r.statusCode == 200) {
                  carrello.clear();
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("✅ ORDINE INVIATO!"), backgroundColor: Colors.green));
                  context.go('/');
                }
              },
              child: const Text("PAGA E ORDINA", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          )
        ],
      ),
    );
  }
}
