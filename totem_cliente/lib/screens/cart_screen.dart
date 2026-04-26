import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'menu_screen.dart'; // Per accedere alla lista 'carrello'

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  double get totale => carrello.fold(0, (sum, item) => sum + item.prezzo);

  Future<void> inviaOrdine() async {
    if (carrello.isEmpty) return;

    try {
      final response = await http.post(
        Uri.parse('https://super-spork-x5r67qg966g7frg4-5000.app.github.dev/ordini'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'totale': totale,
          'prodotti': carrello.map((p) => {'id': p.id, 'quantita': 1}).toList(),
        }),
      );

      if (response.statusCode == 200) {
        setState(() { carrello.clear(); });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('✅ Ordine inviato in cucina!')),
          );
          context.go('/');
        }
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('❌ Errore: Controlla che Flask sia attivo!')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Il tuo Ordine')),
      body: Column(
        children: [
          Expanded(
            child: carrello.isEmpty 
              ? const Center(child: Text('Il carrello è vuoto'))
              : ListView.builder(
                  itemCount: carrello.length,
                  itemBuilder: (context, index) {
                    final p = carrello[index];
                    return ListTile(
                      title: Text(p.nome),
                      trailing: Text('${p.prezzo}€'),
                    );
                  },
                ),
          ),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: Colors.grey[200]),
            child: Column(
              children: [
                Text('Totale: ${totale.toStringAsFixed(2)}€', 
                     style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: carrello.isEmpty ? null : inviaOrdine,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange,
                    minimumSize: const Size.fromHeight(50)
                  ),
                  child: const Text('INVIA ORDINE', style: TextStyle(color: Colors.white)),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}
