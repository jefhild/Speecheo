en pièce jointe le script python qui permet, à partir du CSV de rené de créé le même CSV mais avec 2 colonnes (longitude et latitude) supplémentaires. Mais aussi le fichier que j'ai généré.

s'utilise comme ceci : python reader.py fichierIn.csv fichierOut.csv

Mais aussi, le json qui contient l'ensemble des lieux des conférences pour Paris qui est formater pour la carte bing que j'ai faite.
Et enfin aussi le script Python qui permet de générer ce json a partir du CSV généré précédemment.

à utiliser comme : python csvToJson.py fichierOut.csv (fichierOut de la génération précédente)