from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    """
    Wrap DRF error responses in a consistent JSON envelope for the frontend.
    """
    response = exception_handler(exc, context)
    if response is None:
        return response

    if isinstance(response.data, dict):
        errors = response.data
    elif isinstance(response.data, list):
        errors = {'non_field_errors': response.data}
    else:
        errors = {'detail': response.data}

    response.data = {
        'success': False,
        'errors': errors,
    }
    return response
