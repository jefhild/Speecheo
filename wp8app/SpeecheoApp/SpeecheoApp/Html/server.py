import tornado.ioloop
import tornado.web

class MapHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("join.html")


class WSDataHandler(tornado.web.RequestHandler):
    def get(self):
		self.render("mapParis.json")

    def post(self):
		self.render("mapParis.json")


application = tornado.web.Application([
    (r"/", 		MapHandler),
    (r"/data", 	WSDataHandler),
    (r"/img/(.*)", tornado.web.StaticFileHandler, {"path": "img/"})
])

if __name__ == "__main__":
	PORT = 8888
	application.listen(PORT)
	print "Starting server on port : " + str(PORT)
	tornado.ioloop.IOLoop.instance().start()