# -*- coding: utf-8 -*-
import json
import sys
import csv

DELIMITER = ';'
DEBUG = True
places = []

class Place(object):
	"""docstring for Place"""
	def __init__(self, __type,Title,Name,Description,Latitude,Longitude):
		self.__type = __type
		self.Title = Title
		self.Name = Name
		self.Description = Description
		self.Latitude = Latitude
		self.Longitude = Longitude
	def __str__(self):
		#return '{+self.__type + " - " + self.Title+ " - " + self.Name+ " - " + self.Description+ " - " + self.Latitude+ " - " + self.Longitude+"}"
		return  '{"__type": "'+self.__type+'","Title": "'+self.Title+'","Name": "'+self.Name+'","Description": "'+self.Description+'","Latitude":' +self.Latitude+',"Longitude": '+self.Longitude+'}'

class Log(object):
	@staticmethod
	def d(msg):
		if DEBUG:
			print msg
	@staticmethod
	def e(msg):
		if DEBUG:
			print "ERROR : " + msg
				    
def object_decoder(obj):
    if '__type__' in obj and obj['__type__'] == 'Place':
        return User(obj['__type__'], obj['Title'], obj['Name'], obj['Description'], obj['Latitude'], obj['Longitude'])
    return obj


def main(FILE_NAME):
	with open(FILE_NAME, 'r') as csvfile:
		spamreader = csv.reader(csvfile, delimiter=DELIMITER)
		header = spamreader.next()
		for row in spamreader:
			#__type;Title;Name;Description;Adress;latitude;longitude
			p = Place(row[0],row[1],row[2],row[3],row[5],row[6])
			places.append(p)
	#display all places
	print '{"d":['
	count = 0
	for place in places:
		count = count+1
		if count == len(places) :
			print place 
		else :
			print str(place) + ","
	print "]}"

if __name__ == "__main__":
	if len(sys.argv) >  1:
		main(sys.argv[1])
	else :
		Log.e(u"Veuillez passer en paramètre le nom du fichier CVS :\n reader.py fichierIn.csv")