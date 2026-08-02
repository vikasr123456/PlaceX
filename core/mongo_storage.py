import pymongo
from django.conf import settings
from django.core.files.base import File
from django.core.files.storage import Storage
from django.utils.deconstruct import deconstructible
from gridfs import GridFS


@deconstructible
class GridFSStorage(Storage):
    """Django storage backend backed by MongoDB Atlas GridFS."""

    def __init__(self, location=None, base_url=None):
        self._client = None
        self._db = None
        self._fs = None

    @property
    def client(self):
        if self._client is None:
            self._client = pymongo.MongoClient(
                settings.MONGO_URI,
                serverSelectionTimeoutMS=15000,
            )
        return self._client

    @property
    def db(self):
        if self._db is None:
            self._db = self.client[settings.MONGO_DB_NAME]
        return self._db

    @property
    def fs(self):
        if self._fs is None:
            self._fs = GridFS(self.db)
        return self._fs

    def _open(self, name, mode='rb'):
        grid_out = self.fs.get_last_version(name)
        return File(grid_out, name)

    def _save(self, name, content):
        grid_in = self.fs.new_file(filename=name)
        try:
            for chunk in content.chunks():
                grid_in.write(chunk)
        finally:
            grid_in.close()
        return name

    def delete(self, name):
        grid_out = self.fs.get_last_version(name)
        self.fs.delete(grid_out._id)

    def exists(self, name):
        return self.fs.exists(filename=name)

    def size(self, name):
        return self.fs.get_last_version(name).length

    def url(self, name):
        return name
