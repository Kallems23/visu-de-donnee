import csv
import re

def translate_percentage():
    with open('./data/pizza_sales.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        nbre_S, nbre_M, nbre_L, nbre_XL, nbre_XXL, nbre_pizza = 0, 0, 0, 0, 0, 0
        for row in reader:
            if row['pizza_size'] == 'S':
                nbre_S += float(row['quantity'])
            elif row['pizza_size'] == 'M':
                nbre_M += float(row['quantity'])
            elif row['pizza_size'] == 'L':
                nbre_L += float(row['quantity'])
            elif row['pizza_size'] == 'XL':
                nbre_XL += float(row['quantity'])
            elif row['pizza_size'] == 'XXL':
                nbre_XXL += float(row['quantity'])
            else :
                print('Error')
            
            nbre_pizza += float(row['quantity'])

    print(nbre_S, nbre_M, nbre_L, nbre_XL, nbre_XXL, nbre_pizza)

    percentages = [
        {"Taille": "S", "Pourcentage": round((nbre_S / nbre_pizza) * 100, 2)},
        {"Taille": "M", "Pourcentage": round((nbre_M / nbre_pizza) * 100, 2)},
        {"Taille": "L", "Pourcentage": round((nbre_L / nbre_pizza) * 100, 2)},
        {"Taille": "XL", "Pourcentage": round((nbre_XL / nbre_pizza) * 100, 2)},
        {"Taille": "XXL", "Pourcentage": round((nbre_XXL / nbre_pizza) * 100, 2)}
    ]
    
    # Écriture des pourcentages dans un nouveau fichier CSV
    with open('./data/size_percentage.csv', mode='w', newline='') as csvfile:
        fieldnames = ["Taille", "Pourcentage"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        # Écrire les en-têtes
        writer.writeheader()
        
        # Écrire les données
        for row in percentages:
            writer.writerow(row)


def translate_pizza_type():
    with open('./data/pizza_sales.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        nbre_pizza = 0
        pizza_count = {}

        for row in reader:
            pizza_name = row['pizza_name_id']
            pizza_name_parts = pizza_name.split('_')  
            name = name = "_".join(pizza_name_parts[:-1])
            
            if name in pizza_count:
                pizza_count[name] += float(row['quantity'])
            else:
                pizza_count[name] = float(row['quantity'])

            nbre_pizza += float(row['quantity'])

    percentages = []
    for key, value in pizza_count.items():
        percentages.append({"Type": key, "Pourcentage": round((value / nbre_pizza) * 100, 2)})
    
    # Écriture des pourcentages dans un nouveau fichier CSV
    with open('./data/type_percentage.csv', mode='w', newline='') as csvfile:
        fieldnames = ["Type", "Pourcentage"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        # Écrire les en-têtes
        writer.writeheader()
        
        # Écrire les données
        for row in percentages:
            writer.writerow(row)


def translate_pizza_name_per_month():
    with open('./data/pizza_sales.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        nbre_pizza = 0
        pizza_count = {1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}, 7:{}, 8:{}, 9:{}, 10:{}, 11:{}, 12:{}}
        month = 1

        for row in reader:
            # To get pizza's name
            pizza_name = row['pizza_name_id']
            pizza_name_parts = pizza_name.split('_')  
            name = "_".join(pizza_name_parts[:-1])
            
            # To get the month
            month = re.split(r'[-/]', row['order_date'])
            month = int(month[1])

            # To count the number of pizza sold per month
            if name in pizza_count[month]:
                pizza_count[month][name] += float(row['quantity'])
            else:
                pizza_count[month][name] = float(row['quantity'])

            nbre_pizza += float(row['quantity'])

    for month in pizza_count:
        sorted_pizzas = dict(sorted(pizza_count[month].items()))
        pizza_count[month] = sorted_pizzas

    lines = []
    for month, pizzas in pizza_count.items():
        group = {"Mois": month}
        for name, number in pizza_count[month].items():
            group[name] = number
        lines.append(group)

    with open('./data/pizza_name_per_mounth_percentage.csv', mode='w', newline='') as csvfile:
        fieldnames = ["Mois"]
        for name, number in pizza_count[1].items():
            fieldnames.append(name)

        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        # Écrire les en-têtes
        writer.writeheader()
        
        # Écrire les données
        for row in lines:
            writer.writerow(row)




def find_interval(time):
    """
    Trouve l'intervalle de 30 minutes auquel appartient une heure donnée.
    
    :param heure: Une chaîne au format "HH:MM".
    :return: Une chaîne représentant l'intervalle correspondant ou un message d'erreur.
    """
    try:
        # Convertir l'heure en heures et minutes
        h, m = map(int, time.split(':'))
        
        # Vérifier si l'heure est valide
        if not (0 <= h < 24) or not (0 <= m < 60):
            return "Heure invalide. Assurez-vous d'utiliser le format HH:MM avec des valeurs correctes."

        # Calculer le nombre total de minutes depuis minuit
        total_minutes = h * 60 + m

        # Trouver le début de l'intervalle
        if total_minutes % 30 == 0:  # Si l'heure est exacte (comme 12:30)
            debut_min = total_minutes - 29
            fin_min = total_minutes
        else:  # Sinon, trouver l'intervalle correspondant
            debut_min = (total_minutes // 30) * 30 + 1
            fin_min = debut_min + 29

        # Convertir les minutes en heures et minutes
        debut_h, debut_m = divmod(debut_min, 60)
        fin_h, fin_m = divmod(fin_min, 60)

        # Formatter les heures et minutes
        intervalle = f"{debut_h:02}:{debut_m:02}-{fin_h:02}:{fin_m:02}"
        return intervalle

    except ValueError:
        return "Erreur de format. Veuillez fournir l'heure au format HH:MM."
    

def translate_pizza_name_per_hour_per_type():
    with open('./data/pizza_sales.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        nbre_pizza = 0
        pizza_count = {"00:01-00:30":{}, "00:31-01:00":{}, "01:01-01:30":{}, "01:31-02:00":{}, "02:01-02:30":{}, "02:31-03:00":{}, "03:01-03:30":{}, "03:31-04:00":{}, "04:01-04:30":{}, "04:31-05:00":{}, "05:01-05:30":{}, "05:31-06:00":{}, "06:01-06:30":{}, "06:31-07:00":{}, "07:01-07:30":{}, "07:31-08:00":{}, "08:01-08:30":{}, "08:31-09:00":{}, "09:01-09:30":{}, "09:31-10:00":{}, "10:01-10:30":{}, "10:31-11:00":{}, "11:01-11:30":{}, "11:31-12:00":{}, "12:01-12:30":{}, "12:31-13:00":{}, "13:01-13:30":{}, "13:31-14:00":{}, "14:01-14:30":{}, "14:31-15:00":{}, "15:01-15:30":{}, "15:31-16:00":{}, "16:01-16:30":{}, "16:31-17:00":{}, "17:01-17:30":{}, "17:31-18:00":{}, "18:01-18:30":{}, "18:31-19:00":{}, "19:01-19:30":{}, "19:31-20:00":{}, "20:01-20:30":{}, "20:31-21:00":{}, "21:01-21:30":{}, "21:31-22:00":{}, "22:01-22:30":{}, "22:31-23:00":{}, "23:01-23:30":{}, "23:31-00:00":{}}
        
        for row in reader:
            # To get pizza's name without the size
            pizza_name = row['pizza_name_id']
            pizza_name_parts = pizza_name.split('_')  
            name = "_".join(pizza_name_parts[:-1])
            
            # To get the time
            time = row['order_time'][:5]
            if (time[4] == ':'): # Format H:MM:
                time = time[:4]
                time = "0" + time
            interval = find_interval(time)

            # To count the number of pizza sold per interval
            try:
                if name in pizza_count[interval]:
                    pizza_count[interval][name] += float(row['quantity'])
                else:
                    pizza_count[interval][name] = float(row['quantity'])

                nbre_pizza += float(row['quantity'])
            except:
                print(time, interval)
                
    lines = []
    for interval, pizzas in pizza_count.items():
        group = {"Intervalle": interval}
        for name, number in pizza_count[interval].items():
            group[name] = number
        lines.append(group)

    with open('./data/pizza_name_per_hour_per_type.csv', mode='w', newline='') as csvfile:
        fieldnames = ["Intervalle", "bbq_ckn", "big_meat", "brie_carre", "calabrese", "cali_ckn", "ckn_alfredo", "ckn_pesto", "classic_dlx", "five_cheese", "four_cheese", "green_garden", "hawaiian", "ital_cpcllo", "ital_supr", "ital_veggie", "mediterraneo", "mexicana", "napolitana", "pep_msh_pep", "pepperoni", "peppr_salami", "prsc_argla", "sicilian", "soppressata", "southw_ckn", "spicy_ital", "spin_pesto", "spinach_fet", "spinach_supr", "thai_ckn", "the_greek", "veggie_veg"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        # Écrire les en-têtes
        writer.writeheader()
        
        # Écrire les données
        for row in lines:
            writer.writerow(row)


if __name__ == '__main__':
    # translate_percentage()
    # translate_pizza_type()
    # translate_pizza_name_per_month()
    translate_pizza_name_per_hour_per_type()
