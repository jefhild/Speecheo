en pi�ce jointe le script python qui permet, � partir du CSV de ren� de cr�� le m�me CSV mais avec 2 colonnes (longitude et latitude) suppl�mentaires. Mais aussi le fichier que j'ai g�n�r�.

s'utilise comme ceci : python reader.py fichierIn.csv fichierOut.csv

Mais aussi, le json qui contient l'ensemble des lieux des conf�rences pour Paris qui est formater pour la carte bing que j'ai faite.
Et enfin aussi le script Python qui permet de g�n�rer ce json a partir du CSV g�n�r� pr�c�demment.

� utiliser comme : python csvToJson.py fichierOut.csv (fichierOut de la g�n�ration pr�c�dente)