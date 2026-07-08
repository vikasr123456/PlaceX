from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def welcome_api(request):
    """
    Returns a simple welcome message and status indicator for testing connection.
    """
    return Response({
        "message": "Welcome to PlaceX API!",
        "status": "online",
        "features_available": [
            "Resume Parsing (MongoDB & Djongo)",
            "Asynchronous Task Queue (Celery & Redis)",
            "Relational Storage (PostgreSQL)"
        ]
    })
