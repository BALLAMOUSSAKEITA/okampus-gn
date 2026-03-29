# Tâche 8.7 - Notifications push PWA

**Epic :** 08 - Système de Notifications
**Priorité :** Basse
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/public/sw.js` (service worker)
- `okampus-api/app/services/push.py` (nouveau)

## Description

Envoyer des notifications push via l'API Push du navigateur pour les utilisateurs ayant installé la PWA.

## Actions à réaliser

1. **Demander la permission push au premier login**
2. **Sauvegarder le subscription endpoint en DB**
3. **Envoyer des push depuis le backend via web-push**
4. **Afficher la notification système même si l'app est fermée**

## Critères d'acceptation

- [ ] Les notifications push s'affichent sur mobile et desktop
- [ ] L'utilisateur peut activer/désactiver les push
- [ ] Les push ne sont envoyés que pour les événements importants
