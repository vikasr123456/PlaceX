class DatabaseRouter:
    """
    A router to control all database operations on models in the
    MongoDB database vs PostgreSQL database.
    """
    def db_for_read(self, model, **hints):
        """
        Attempts to read MongoDB models go to mongodb.
        """
        if model._meta.model_name in ['resumedocument', 'jobmatch']:
            return 'mongodb'
        return 'default'

    def db_for_write(self, model, **hints):
        """
        Attempts to write MongoDB models go to mongodb.
        """
        if model._meta.model_name in ['resumedocument', 'jobmatch']:
            return 'mongodb'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations if a model in the mongodb database is involved.
        """
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Make sure the MongoDB models only appear in the 'mongodb' database.
        """
        if model_name in ['resumedocument', 'jobmatch']:
            return db == 'mongodb'
        return db == 'default'
