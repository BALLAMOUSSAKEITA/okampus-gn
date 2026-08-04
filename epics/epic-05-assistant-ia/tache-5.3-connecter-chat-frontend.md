# Tâche 5.3 - Connecter le chat frontend

**Epic :** 05 - Assistant IA Intelligent
**Priorité :** Haute
**Statut :** [ ] À faire
**Fichiers concernés :**
- `okampus-app/src/app/assistant/page.tsx`

## Description

Remplacer la logique locale `generateOrientationAdvice()` par des appels à l'API backend avec streaming.

## Actions à réaliser

1. **Remplacer le formulaire de profil :**
   - Garder le même formulaire (série, notes, intérêts, etc.)
   - Envoyer le profil au premier message de la conversation

2. **Implémenter le streaming côté client :**
   ```typescript
   const response = await fetch(`${API_URL}/assistant/chat`, {
     method: 'POST',
     headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
     body: JSON.stringify({ message, profile, conversation_id })
   });

   const reader = response.body?.getReader();
   const decoder = new TextDecoder();
   while (true) {
     const { done, value } = await reader.read();
     if (done) break;
     const chunk = decoder.decode(value);
     // Ajouter le chunk au message en cours
   }
   ```

3. **UX du chat :**
   - Afficher les caractères au fur et à mesure (effet typing)
   - Indicateur "L'assistant réfléchit..." pendant le chargement
   - Scroll automatique vers le bas

4. **Supprimer la logique hardcodée :**
   - Retirer `generateOrientationAdvice()` et tout le code de recommandation local

## Critères d'acceptation

- [ ] Le chat appelle l'API backend au lieu de la logique locale
- [ ] Les réponses s'affichent en streaming (effet typing)
- [ ] Le profil étudiant est envoyé comme contexte
- [ ] L'indicateur de chargement s'affiche pendant la réponse
