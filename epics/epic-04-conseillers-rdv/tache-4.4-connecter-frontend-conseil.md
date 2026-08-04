# Tâche 4.4 - Connecter le frontend conseil

**Epic :** 04 - Système de Conseillers & Rendez-vous
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/app/conseil/page.tsx`

## Description

Remplacer les 6 conseillers mock par les vrais profils d'advisors de la base de données.

## Actions à réaliser

1. **Remplacer les données mock :**
   - `useFetch<Advisor[]>('/advisors')` pour charger la liste
   - Filtrer par domaine et nom via query params

2. **Adapter l'affichage :**
   - Utiliser les vrais noms, domaines, universités
   - Afficher l'avatar avec initiales (comme actuellement)
   - Indicateur "en ligne" basé sur les créneaux du jour

3. **Remplacer le chat simulé :**
   - Le chat actuel simule des réponses avec un delay
   - Option 1 : Garder le chat comme "demande de conseil" (envoie une notification à l'advisor)
   - Option 2 : Remplacer par un bouton "Prendre rendez-vous" directement
   - Recommandation : Option 2 en V1, chat réel en V2

4. **Lien vers réservation :**
   - Bouton "Prendre rendez-vous" ouvre le modal de réservation (tâche 4.5)

## Critères d'acceptation

- [ ] Les conseillers proviennent de l'API
- [ ] Les filtres fonctionnent via l'API
- [ ] Le bouton de réservation est fonctionnel
- [ ] L'affichage est cohérent avec les données réelles
