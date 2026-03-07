# Deploiement Site Vitrine YdvSystems

## Infos serveur

| Info          | Valeur                            |
| ------------- | --------------------------------- |
| **Hebergeur** | Hetzner Cloud                     |
| **IP**        | 46.225.71.188                     |
| **User**      | root                              |
| **Domaine**   | https://ydvsystems.com            |
| **DNS**       | OVH                              |
| **Port**      | 3001                             |
| **PM2**       | ydvsystems-site                   |

## Structure serveur

```
/var/www/ydvsystems-site/          # Code source (clone Git)
/etc/nginx/sites-available/        # Config Nginx
/etc/letsencrypt/                  # Certificats SSL
```

## Stack installee

- **Node.js** : v20+
- **npm** : gestionnaire de packages
- **PM2** : process manager
- **Nginx** : reverse proxy
- **Certbot** : certificats SSL Let's Encrypt

## Deploiement rapide

```bash
ssh root@46.225.71.188 "cd /var/www/ydvsystems-site && git pull origin master && npm install && npm run build && pm2 restart ydvsystems-site"
```

## Deploiement etape par etape

```bash
# 1. Se connecter
ssh root@46.225.71.188

# 2. Aller dans le dossier
cd /var/www/ydvsystems-site

# 3. Recuperer les derniers changements
git pull origin master

# 4. Installer les dependances (si nouvelles)
npm install

# 5. Rebuild
npm run build

# 6. Redemarrer l'app
pm2 restart ydvsystems-site

# 7. Verifier
pm2 list
pm2 logs ydvsystems-site --lines 20
```

## Commandes utiles

### PM2

```bash
pm2 list                             # Voir toutes les apps
pm2 logs ydvsystems-site             # Logs en temps reel
pm2 logs ydvsystems-site --lines 50  # Dernieres 50 lignes
pm2 restart ydvsystems-site          # Redemarrer
pm2 stop ydvsystems-site             # Arreter
pm2 start ydvsystems-site            # Demarrer
```

### Nginx

```bash
nginx -t                    # Tester la config
systemctl reload nginx      # Recharger sans downtime
systemctl restart nginx     # Redemarrer
```

### Certificat SSL

```bash
certbot renew               # Renouveler (normalement auto)
certbot certificates        # Voir les certificats
```

## Autres apps sur ce serveur

| App | PM2 | Port | Dossier |
|-----|-----|------|---------|
| CIP Platform | cip-platform | 3000 | /var/www/cip-platform/ |
| **Site vitrine** | **ydvsystems-site** | **3001** | **/var/www/ydvsystems-site/** |
| Blog Parkinson | blog-parkinson | 3002 | /opt/blog-parkinson/ |

## Sous-domaines configures (OVH)

| Sous-domaine | IP | Usage |
|---|---|---|
| ydvsystems.com | 46.225.71.188 | CIP Platform (insertion) |
| www | 46.225.71.188 | CIP Platform |
| insertion | 46.225.71.188 | CIP Platform |
| formation | 46.225.71.188 | CIP Platform |
| coaching | 46.225.71.188 | CIP Platform (bientot) |
| manager | 46.225.71.188 | CIP Platform (bientot) |
| lesmotsdemarilyn | 46.225.71.188 | Blog Parkinson |
| dracula | 46.225.71.188 | Jeu Le Chateau de Dracula |
| kart | 46.225.71.188 | Jeu Pills Stadium |
| n8n | 46.224.181.128 | Automatisation n8n (VPS separe) |

## Jeux en ligne (sous-domaines statiques)

| Jeu | Sous-domaine | Dossier serveur | Source locale |
|-----|-------------|-----------------|--------------|
| Le Chateau de Dracula | dracula.ydvsystems.com | /var/www/games/dracula/ | dist/ (Vite build) |
| Pills Stadium | kart.ydvsystems.com | /var/www/games/kart/ | public/ (pas de build) |

### Mise a jour d'un jeu

```bash
# Dracula — apres modification du jeu
cd "E:\YdvSystemsProd\Le chateau de Dracula\le_chateau_de_dracula"
npm run build
scp -r dist/* root@46.225.71.188:/var/www/games/dracula/

# Kart — apres modification du jeu
scp -r "E:\YdvSystemsProd\jeu_kart\pills-stadium\public\*" root@46.225.71.188:/var/www/games/kart/
```

Aucun restart serveur necessaire — Nginx sert des fichiers statiques.

## Troubleshooting

### L'app ne demarre pas

```bash
pm2 logs ydvsystems-site --lines 100
```

### Erreur de build

```bash
cd /var/www/ydvsystems-site
npm run build 2>&1 | tail -50
```

### Site inaccessible

```bash
systemctl status nginx
nginx -t
pm2 list
curl http://localhost:3001
```
