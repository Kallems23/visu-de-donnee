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


def translate_pizza_name_per_mounth():
    with open('./data/pizza_sales.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        nbre_pizza = 0
        pizza_count = {1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}, 7:{}, 8:{}, 9:{}, 10:{}, 11:{}, 12:{}}
        month = 1

        for row in reader:
            pizza_name = row['pizza_name_id']
            pizza_name_parts = pizza_name.split('_')  
            name = "_".join(pizza_name_parts[:-1])
            
            month = re.split(r'[-/]', row['order_date'])
            month = int(month[1])

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


if __name__ == '__main__':
    # translate_percentage()
    # translate_pizza_type()
    translate_pizza_name_per_mounth()
