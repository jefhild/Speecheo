import tornado.ioloop
import tornado.web
import torndb
import sys

db = torndb.Connection("127.0.0.1", "speecheo",user="root",password="")

class MapHandler(tornado.web.RequestHandler):
	def get(self):
		#sys.exit()
		self.render("userinfo.html")
		
class WSUserQuitHandler(tornado.web.RequestHandler):
	def get(self,confId,number):
		query = "DELETE FROM `clientdata` WHERE `phone` = '"+number+"' AND `applicationId` = " + confId
		try:
			result = db.query(query)
			self.write('{"result": "ok"}')
		except :
			self.write('{"result": "ko"}')

class WSRegisterHandler(tornado.web.RequestHandler):
	def get(self,confId,number,name):
		self.write(confId + "-"+number + "-"+name)
		try:
			result = db.query("INSERT INTO clientdata (applicationId,phone, pseudo) VALUES (" + str(confId) + ",'" + str(number) + "','" + str(name) + "');")
			self.write('{"result": "ok"}')
		except :
			self.write('{"result": "ko"}')
			
class WSListHandler(tornado.web.RequestHandler):
	def get(self,confId):
		try:
			query = "SELECT pseudo,phone FROM clientdata WHERE applicationId=" + str(confId)
			result = db.query(query)
			json = "["
			count = 1
			for user in result:
				if count < len(result):
					json = json + '{"pseudo":"'+user["pseudo"] + '","phone":"'+user["phone"] + '"},'
				else :
					json = json + '{"pseudo":"'+user["pseudo"] + '","phone":"'+user["phone"] + '"}'
				count = count + 1
			json = json + "]"
			self.write(json)
		except :
			self.write('{"result": "ko"}')

		
class WSDataHandler(tornado.web.RequestHandler):
    def get(self):
		self.render("mapParis.json")

    def post(self):
		self.render("mapParis.json")

application = tornado.web.Application([
    (r"/", 		MapHandler),
    (r"/data", 	WSDataHandler),
    (r"/register/(.*?)/(.*?)/(.*?)", 	WSRegisterHandler),
    (r"/quit/(.*?)/(.*?)", 	WSUserQuitHandler),
    (r"/list/(.*?)", 	WSListHandler),
    (r"/img/(.*)", tornado.web.StaticFileHandler, {"path": "img/"})
])

if __name__ == "__main__":
	PORT = 8888
	application.listen(PORT)
	print "Starting server on port : " + str(PORT)
	tornado.ioloop.IOLoop.instance().start()