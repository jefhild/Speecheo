import tornado.ioloop
import tornado.web
import torndb

db = torndb.Connection("127.0.0.1", "speecheo",user="root",password="")

class MapHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("join.html")

class WSRegisterHandler(tornado.web.RequestHandler):
    def get(self,confId,number,name):
        result = db.query("INSERT INTO clientdata (applicationId,phone, pseudo) VALUES (" + str(confId) + ",'" + str(number) + "','" + str(name) + "');")
		#self.write(number + "-"+name)

class WSDataHandler(tornado.web.RequestHandler):
    def get(self):
		self.render("mapParis.json")

    def post(self):
		self.render("mapParis.json")

application = tornado.web.Application([
    (r"/", 		MapHandler),
    (r"/data", 	WSDataHandler),
    (r"/register/(.*?)/(.*?)/(.*?)", 	WSRegisterHandler),
    (r"/img/(.*)", tornado.web.StaticFileHandler, {"path": "img/"})
])

if __name__ == "__main__":
	PORT = 8888
	application.listen(PORT)
	print "Starting server on port : " + str(PORT)
	tornado.ioloop.IOLoop.instance().start()