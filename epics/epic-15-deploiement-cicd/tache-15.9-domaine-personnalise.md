# Tâche 15.9 - Domaine personnalisé

**Epic :** 15 - Déploiement, CI/CD & Monitoring
**Priorité :** Basse
**Statut :** [ ] À faire

## Actions à réaliser

1. **Acheter un domaine :** `okampus.gn` ou `okampus.com` ou `okampus.app`
2. **Configurer les DNS :** Pointer vers Railway
3. **SSL :** Certificat automatique via Railway
4. **Sous-domaines :**
   - `okampus.gn` → frontend
   - `api.okampus.gn` → backend
5. **Mettre à jour les variables d'environnement :**
   - NEXTAUTH_URL, CORS origins, API_URL

## Critères d'acceptation

- [ ] Le site est accessible via le domaine personnalisé
- [ ] HTTPS fonctionne sur le domaine
- [ ] L'API est accessible via le sous-domaine api
- [ ] Toutes les variables sont mises à jour
