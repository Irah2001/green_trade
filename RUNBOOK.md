# 📖 Runbook d'Exploitation — GreenTrade

Ce document contient l'ensemble des procédures d'exploitation, de diagnostic et de maintenance pour l'application **GreenTrade** déployée sur le cluster Kubernetes (namespace `green-trade`).

---

## Table des Matières

1. [Diagnostic de pannes & Commandes de base](#1-diagnostic-de-pannes--commandes-de-base)
2. [Gestion de la Scalabilité (HPA & Manuel)](#2-gestion-de-la-scalabilit%C3%A9-hpa--manuel)
3. [Monitoring, Grafana & Alerting](#3-monitoring-grafana--alerting)
4. [Scénarios de Résilience & Maintenance](#4-sc%C3%A9narios-de-r%C3%A9silience--maintenance)
5. [Procédures Applicatives (Restart, Backup/Restore DB)](#5-proc%C3%A9dures-applicatives-restart-backuprestore-db)

---

## 1. Diagnostic de pannes & Commandes de base

### 1.1 Visualiser l'état général du Namespace
Pour lister toutes les ressources actives dans le namespace `green-trade` :
```bash
kubectl get all -n green-trade
```
Pour voir l'affectation des pods aux nœuds (nodes) et leurs adresses IP :
```bash
kubectl get pods -n green-trade -o wide
```

### 1.2 Consulter les logs applicatifs (JSON)
Les logs de l'API backend sont structurés au format JSON lorsque la variable `LOG_FORMAT=json` est active.
* **Afficher les 50 derniers logs d'un Deployment :**
  ```bash
  kubectl logs -n green-trade deployment/green-trade-catalog-api --tail=50
  ```
* **Suivre les logs en temps réel (Streaming) :**
  ```bash
  kubectl logs -n green-trade deployment/green-trade-catalog-api -f
  ```
* **Suivre les logs de tous les pods d'un composant (via labels) :**
  ```bash
  kubectl logs -n green-trade -l app.kubernetes.io/component=catalog-api -f
  ```

### 1.3 Inspecter une ressource en erreur
Si un pod reste bloqué en `Pending`, `CrashLoopBackOff` ou `ImagePullBackOff` :
* **Décrire le pod pour voir les événements système :**
  ```bash
  kubectl describe pod <nom-du-pod> -n green-trade
  ```
* **Consulter les derniers événements triés par ordre chronologique :**
  ```bash
  kubectl get events -n green-trade --sort-by=.lastTimestamp
  ```

#### Guide de résolution des statuts de pods courants :
* **`CrashLoopBackOff`** : L'application plante au démarrage. *Action :* Vérifier les logs du conteneur (`kubectl logs <pod> -p` pour voir le crash précédent) et s'assurer que les variables d'environnement dans le `ConfigMap`/`Secret` sont correctes.
* **`Pending`** : Ressources insuffisantes sur le cluster ou PVC non lié. *Action :* Faire un `kubectl describe pod` pour lire la cause (ex. `Insufficient cpu`, `no nodes available`).
* **`ImagePullBackOff`** : Kubernetes ne parvient pas à télécharger l'image du conteneur. *Action :* Vérifier le tag de l'image dans le déploiement ou l'authentification au Registry (imagePullSecrets).

---

## 2. Gestion de la Scalabilité (HPA & Manuel)

### 2.1 Suivre les métriques de ressources (CPU/Mémoire)
Le fonctionnement des métriques nécessite que `metrics-server` soit actif sur le cluster.
* **Consulter la consommation des Pods en direct :**
  ```bash
  kubectl top pods -n green-trade
  ```
* **Consulter la consommation des Nodes en direct :**
  ```bash
  kubectl top nodes
  ```

### 2.2 Surveiller l'Autoscaling (HPA)
L'Horizontal Pod Autoscaler ajuste le nombre de replicas selon la charge CPU constatée par rapport à la valeur cible (50%).
* **Voir l'état synthétique des HPA :**
  ```bash
  kubectl get hpa -n green-trade
  ```
* **Décrire l'état détaillé d'un HPA (historique de scale, métriques courantes) :**
  ```bash
  kubectl describe hpa green-trade-catalog-api-hpa -n green-trade
  ```

### 2.3 Scaler manuellement un Deployment
Si vous devez contourner temporairement le HPA ou redimensionner un service non managé par le HPA (ex. le frontend) :
```bash
kubectl scale deployment/green-trade-frontend --replicas=3 -n green-trade
```
*Note : Si vous scalez manuellement un Deployment managé par un HPA, le HPA écrasera votre commande lors de sa prochaine évaluation pour restaurer le nombre de replicas requis par les métriques.*

---

## 3. Monitoring, Grafana & Alerting

### 3.1 Installation de la stack de monitoring (Helm)
Si vous devez installer la stack `kube-prometheus-stack` (Prometheus, Grafana, Alertmanager) sur le cluster :
```bash
# 1. Ajouter le dépôt de charts Helm Prometheus Community
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# 2. Créer le namespace dédié au monitoring
kubectl create namespace monitoring

# 3. Installer la stack
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring
```

### 3.2 Accéder à Grafana
Une fois la stack installée et prête :
1. **Créer un tunnel de redirection de port local :**
   ```bash
   kubectl port-forward svc/monitoring-grafana 3001:80 -n monitoring
   ```
2. **Accéder à l'interface dans votre navigateur :**
   * URL : `http://localhost:3001`
3. **Récupérer le mot de passe administrateur par défaut :**
   ```bash
   kubectl get secret monitoring-grafana -n monitoring -o jsonpath="{.data.admin-password}" | base64 -d
   ```

### 3.3 Requêtes PromQL utiles (Console Prometheus / Grafana)
* **Trafic HTTP global (Taux de requêtes par seconde sur 1 min) :**
  ```promql
  sum(rate(http_requests_total[1m])) by (route)
  ```
* **Latence moyenne des requêtes HTTP (p95) :**
  ```promql
  histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route))
  ```
* **Consommation CPU des conteneurs par Pod dans le namespace `green-trade` :**
  ```promql
  sum(rate(container_cpu_usage_seconds_total{namespace="green-trade"}[5m])) by (pod)
  ```
* **Disponibilité des répliques pour le backend catalog :**
  ```promql
  kube_deployment_status_replicas_available{namespace="green-trade", deployment="green-trade-catalog-api"}
  ```

### 3.4 Interpréter une alerte PrometheusRule
Les alertes configurées sont déclarées dans `prometheusrule.yaml`.
* **Vérifier les règles d'alertes déclarées dans le namespace :**
  ```bash
  kubectl get prometheusrule -n green-trade
  ```
* **Alertes critiques configurées :**
  * `BackendCatalogNoAvailableReplicas` : Déclenchée si aucun replica de l'API catalogue n'est disponible pendant plus d'une minute.
  * `BackendOrdersNoAvailableReplicas` : Déclenchée si aucun replica de l'API commandes n'est disponible pendant plus d'une minute.
  * `PodHighCPUUsage` : Déclenchée si un pod consomme plus de 80% de son CPU alloué pendant plus de 5 minutes.
* **Que faire en cas d'alerte critique ?**
  1. Identifier le pod concerné via l'alerte.
  2. Inspecter les événements récents avec `kubectl describe pod`.
  3. Consulter les logs applicatifs (`kubectl logs`) pour identifier un éventuel bug de démarrage.

---

## 4. Scénarios de Résilience & Maintenance

### 4.1 Résilience : Kill manuel d'un Pod
Pour tester le self-healing (auto-remplacement) de Kubernetes :
```bash
kubectl delete pod <nom-du-pod-backend> -n green-trade
```
Le ReplicaSet détecte instantanément l'écart entre le nombre de pods voulus et réels, et lance un nouveau pod. Le service reste disponible sans coupure car au moins un autre replica est actif.

### 4.2 Maintenance : Drain d'un Node
Si vous devez effectuer une maintenance physique d'un nœud (ex: mise à jour du noyau OS du serveur) :
1. **Marquer le nœud comme indisponible pour les nouveaux pods (Cordon) :**
   ```bash
   kubectl cordon <nom-du-node>
   ```
2. **Éjecter proprement les pods existants vers d'autres nœuds (Drain) :**
   ```bash
   kubectl drain <nom-du-node> --ignore-daemonsets --delete-emptydir-data
   ```
   *Si un PodDisruptionBudget est déployé, le drain s'effectuera de façon progressive sans couper tous les pods d'un composant API en même temps (le PDB a été retiré dans une démarche YAGNI mais reste configurable).*
3. **Réintégrer le nœud dans le cluster après la maintenance (Uncordon) :**
   ```bash
   kubectl uncordon <nom-du-node>
   ```

### 4.3 Annuler un déploiement défectueux (Rollback)
Si une nouvelle version déployée par la CI/CD s'avère instable ou plante :
* **Vérifier l'historique des déploiements du composant :**
  ```bash
  kubectl rollout history deployment/green-trade-catalog-api -n green-trade
  ```
* **Suivre le statut du déploiement en cours :**
  ```bash
  kubectl rollout status deployment/green-trade-catalog-api -n green-trade
  ```
* **Annuler et revenir à la version précédente (Rollback) :**
  ```bash
  kubectl rollout undo deployment/green-trade-catalog-api -n green-trade
  ```
* **Revenir à une révision spécifique (ex: révision 2) :**
  ```bash
  kubectl rollout undo deployment/green-trade-catalog-api --to-revision=2 -n green-trade
  ```

---

## 5. Procédures Applicatives (Restart, Backup/Restore DB)

### 5.1 Redémarrage ordonné des Services (Rolling Restart)
Pour forcer le redémarrage propre de l'ensemble des conteneurs d'un Deployment (pour charger de nouvelles configurations ou secrets sans interruption de service) :
```bash
kubectl rollout restart deployment/green-trade-catalog-api -n green-trade
kubectl rollout restart deployment/green-trade-orders-api -n green-trade
kubectl rollout restart deployment/green-trade-frontend -n green-trade
```

### 5.2 Sauvegarde & Restauration de la Base de données (MongoDB StatefulSet)
MongoDB est déployé en tant que StatefulSet (`green-trade-mongo`) avec un stockage persistant (PVC).

#### A. Effectuer une sauvegarde (Backup)
1. **Exécuter `mongodump` à l'intérieur du pod MongoDB pour extraire les données dans un dossier temporaire du conteneur :**
   ```bash
   kubectl exec -it green-trade-mongo-0 -n green-trade -- mongodump --db greentrade --out /tmp/backup
   ```
2. **Copier le dossier de sauvegarde depuis le pod vers votre machine locale :**
   ```bash
   kubectl cp green-trade/green-trade-mongo-0:/tmp/backup ./mongo-backup
   ```
3. **Nettoyer le dossier temporaire dans le pod :**
   ```bash
   kubectl exec -it green-trade-mongo-0 -n green-trade -- rm -rf /tmp/backup
   ```

#### B. Effectuer une restauration (Restore)
1. **Copier le dossier de sauvegarde depuis votre machine locale vers le pod MongoDB :**
   ```bash
   kubectl cp ./mongo-backup green-trade/green-trade-mongo-0:/tmp/restore
   ```
2. **Exécuter `mongorestore` dans le pod pour restaurer les données dans la base `greentrade` :**
   ```bash
   kubectl exec -it green-trade-mongo-0 -n green-trade -- mongorestore --db greentrade /tmp/restore/greentrade
   ```
3. **Nettoyer le dossier temporaire dans le pod :**
   ```bash
   kubectl exec -it green-trade-mongo-0 -n green-trade -- rm -rf /tmp/restore
   ```
