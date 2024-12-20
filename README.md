# TP1 : Visualisation de données

> Projet réalisé par : ROSANO Romain et CHERBLANC Noah.

## Visualisation du projet

### Lancement local

> Pour les commandes ci-dessous, on suppose que l'exéction se fait depuis le dossier **visu-de-donnee/**.

Pour lancer le projet en local, il faut :
- Entrer dans un terminal et exécuter la commande (lancement des outils de React) : `npm start`.
    > Par défaut, le projet se lancera sur : http://localhost:3000
- Dans un second terminal, exécuter la commande (lancement d'un serveur local en Python pour accéder aux fichiers (sinon, bug du fetch)) : `python3 .\src\PreferenceClient\begin_local_serv.py`

Le site est alors accessible.

### Lancement depuis Internet

Il suffit de se rendre sur [ce site](https://kallems23.github.io/visu-de-donnee/) (https://kallems23.github.io/visu-de-donnee/).

## Description du projet

Notre projet consiste à présenter les données d'une pizzeria américaine.
Les représentations fournies ont été réalisées avec la librairie **D3.js**.

### Recueil de données

Le dataset est accessible [ici](https://www.kaggle.com/datasets/nextmillionaire/pizza-sales-dataset) (https://www.kaggle.com/datasets/nextmillionaire/pizza-sales-dataset), ou depuis le dossier **data/** dans pizza_sales.csv.
Il présente principalement les ventes de pizzas d'une pizzeria américaine sur l'année 2015. On retrouve les informations pour chacune des commandes des clients. Parmi ces informations, on trouve notamment : le jour et l'heure de la commande, le montant de la commande, le nombre de pizzas commandées, le type de pizzas commandées...
Les données nécessaires à la visualisation ont été extraites de ce dataset à l'aide du script Python **translator.py** du même dossier.

### Visualisations

Nous avons réalisé plusieurs visualisations qui sont visibles directement depuis le [site](https://kallems23.github.io/visu_de_donnee/) cité plus haut. Ces visualisations sont accessibles depuis le menu de navigation en haut à droite de la page.