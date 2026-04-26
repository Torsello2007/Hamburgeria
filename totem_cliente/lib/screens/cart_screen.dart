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
      backgroundColor: Colors.white,
      appBar: AppBar(title: const Text("RIEPILOGO ORDINE"), centerTitle: true, elevation: 0, backgroundColor: Colors.white, foregroundColor: Colors.black),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Expanded(
              child: ListView.builder(
                itemCount: carrello.length,
                itemBuilder: (c, i) => ListTile(
                  leading: ClipRRect(borderRadius: BorderRadius.circular(8), child: Image.network(carrello[i].immagine, width: 50, height: 50, fit: BoxFit.cover)),
                  title: Text(carrello[i].nome, style: const TextStyle(fontWeight: FontWeight.bold)),
                  trailing: Text("${carrello[i].prezzo}€"),
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.all(25),
              decoration: BoxDecoration(color: const Color(0xFF212529), borderRadius: BorderRadius.circular(25)),
              child: Column(
                children: [
                  Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                    const Text("TOTALE", style: TextStyle(color: Colors.white70)),
                    Text("${totale.toStringAsFixed(2)}€", style: const TextStyle(color: Colors.white, fontSize: 25, fontWeight: FontWeight.w900)),
                  ]),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.orange, minimumSize: const Size.fromHeight(60), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15))),
                    onPressed: () async {
                      // CAMBIA L'URL QUI SOTTO CON IL TUO REALE SE DIVERSO
                      await http.post(Uri.parse('https://super-spork-x5r67qg966g7frg4-5000.app.github.dev/ordini'),
                        headers: {'Content-Type': 'application/json'},
                        body: json.encode({'totale': totale, 'prodotti': carrello.map((p) => {'id': p.id, 'quantita': 1}).toList()}));
                      carrello.clear();
                      context.go('/');
                    },
                    child: const Text("CONFERMA ORDINE", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
