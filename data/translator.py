import csv

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
    mounth_increment = 1
    for key, value in pizza_count.items():
        group = {"Mois": mounth_increment}
        percentages.append({"Mois": mounth_increment, "Pourcentage": round((value / nbre_pizza) * 100, 2)})
        mounth_increment += 1
    
    # Écriture des pourcentages dans un nouveau fichier CSV
    with open('./data/pizza_name_per_mounth_percentage.csv', mode='w', newline='') as csvfile:
        fieldnames = ["Type", "Pourcentage"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        # Écrire les en-têtes
        writer.writeheader()
        
        # Écrire les données
        for row in percentages:
            writer.writerow(row)


if __name__ == '__main__':
    # translate_percentage()
    # translate_pizza_type()
    # translate_pizza_name_per_mounth()
