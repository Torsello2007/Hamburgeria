import 'package:go_router/go_router.dart';
import 'screens/menu_screen.dart';
import 'screens/cart_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(path: '/', builder: (context, state) => const MenuScreen()),
    GoRoute(path: '/carrello', builder: (context, state) => const CartScreen()),
  ],
);
