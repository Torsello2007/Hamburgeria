import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/prodotto.dart';

// Carrello globale semplice per l'esercizio
List<Prodotto> carrello = [];

class MenuScreen extends StatefulWidget {
  const MenuScreen({super.key});
  @override
  State<MenuScreen> createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen> {
  Future<List<Prodotto>> fetchProdotti() async {
    // Nota: usiamo l'IP locale di codespaces o 127.0.0.1
    final response = await http.get(Uri.parse('https://super-spork-x5r67qg966g7frg4-5000.app.github.dev/prodotti'));
    if (response.statusCode == 200) {
      List jsonResponse = json.decode(response.body);
      return jsonResponse.map((data) => Prodotto.fromJson(data)).toList();
    } else {
      throw Exception('Errore caricamento prodotti');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hamburgeria - Menu'),
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_cart),
            onPressed: () => context.go('/carrello'),
          )
        ],
      ),
      body: FutureBuilder<List<Prodotto>>(
        future: fetchProdotti(),
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return ListView.builder(
              itemCount: snapshot.data!.length,
              itemBuilder: (context, index) {
                final p = snapshot.data![index];
                return ListTile(
                  leading: Image.network(p.immagine, width: 50),
                  title: Text(p.nome),
                  subtitle: Text('${p.prezzo}€'),
                  trailing: ElevatedButton(
                    onPressed: () {
                      setState(() { carrello.add(p); });
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Aggiunto!')));
                    },
                    child: const Icon(Icons.add),
                  ),
                );
              },
            );
          } else if (snapshot.hasError) {
            return Center(child: Text('Avvia il backend Flask!'));
          }
          return const Center(child: CircularProgressIndicator());
        },
      ),
    );
  }
}
