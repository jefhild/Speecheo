# -*- coding: utf-8 -*-
#from __future__ import print_function
import csv
import urllib2
import json
import os
import sys
import time

WS_PROTOCOL = "http://"
WS_URL = u"maps.googleapis.com/maps/api/geocode/json?address={}&sensor=false";
#FILE_NAME = "salles.csv"
#OUTPUTFILE = "salles_avec_geo.csv"
HEADER_ADRESS = "Adress"
DEBUG = True
DELIMITER = ';'
TITLE_LATITUDE = "latitude"
TITLE_LONGITUDE = "longitude"

class Log(object):
	@staticmethod
	def d(msg):
		if DEBUG:
			print msg
	@staticmethod
	def e(msg):
		if DEBUG:
			print "ERROR : " + msg
			
def findGeoPlace(address):
	url = WS_PROTOCOL+WS_URL.format(urllib2.quote(address))
	Log.d("Calling URL : "+url)
	jsonReturn = urllib2.urlopen(url).read()
	obj = json.loads(jsonReturn)
	if len(obj["results"]) > 0 :
		if "geometry" in obj["results"][0] : 
			if "location" in obj["results"][0]["geometry"]: 
				location = obj["results"][0]["geometry"]["location"]
				Log.d("latitude=" + str(location["lat"]))
				Log.d("longitude=" + str(location["lng"]))
				Log.d("*"*100)
				return location
			else:
				Log.e(u"Géolocation introuvable pour l'adresse : " + address)
		else:
			Log.e(u"Pas de géolocalisation pour l'adresse : " + address)
	else:
		Log.e(u"Web Service injoignable : "+str(len(obj["results"]))+"\n" + str(obj))
		
def main(FILE_NAME,OUTPUTFILE):
	with open(OUTPUTFILE, 'w') as output:
		with open(FILE_NAME, 'r') as csvfile:
			spamreader = csv.reader(csvfile, delimiter=DELIMITER)
			header = spamreader.next()
			newheader = DELIMITER.join(header) + DELIMITER + TITLE_LATITUDE + DELIMITER + TITLE_LONGITUDE + "\n"
			output.write(newheader)
			indexAdress = header.index(HEADER_ADRESS)
			count = 0
			for row in spamreader:
				if len(row)>=indexAdress or (len(row)>=indexAdress and row[indexAdress] is None  and row[indexAdress+1] is None):
					try:
						address = row[indexAdress]
						if 5 > count:
							time.sleep(1) #we wait 1 second each 5 requests
							count = 0
						location = findGeoPlace(unicode(address))
						count = count+1
						if location is not None:
							line = DELIMITER.join(row) + DELIMITER + str(location["lat"]) + DELIMITER + str(location["lng"]) +"\n"
							output.write(line)
						else :
							output.write(DELIMITER.join(row)+DELIMITER+DELIMITER+"\n")
					except Exception: 
						Log.d("Erreur a la ligne :" + DELIMITER.join(row))
				else :
					output.write(DELIMITER.join(row)+DELIMITER+DELIMITER+"\n")
					
if __name__ == "__main__":
	if len(sys.argv) > 2 :
		main(sys.argv[1],sys.argv[2])
	else :
		Log.e(u"Veuillez passer en paramètre le nom du fichier CVS :\n reader.py fichierIn.csv fichierOut.csv")
