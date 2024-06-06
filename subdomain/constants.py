import requests
from django.conf import settings
from subdomain.services import call_api_get_method, call_api_post_method


def settings_data(request, token, user_id):
    try:
        # try:
        #     is_server = settings.IS_SERVER
        #     if int(is_server) == 1:
        #         domain_name_url = request.META['HTTP_HOST'].split('.')[0]
        #     else:
        #         domain_name_url = settings.DOMAIN_NAME_URL.split('.')[0]
        # except Exception as exp:
        #     domain_name_url = request.META['HTTP_HOST'].split('.')[0]

        # domain_name = domain_name_url.replace('http://', '')
        # api_url = settings.API_URL + '/api-users/settings-data/'
        try:
            is_server = settings.IS_SERVER
            if int(is_server) == 1:
                domain_name_url = request.META['HTTP_HOST']
            else:
                domain_name_url = settings.DOMAIN_NAME_URL
        except Exception as exp:
            domain_name_url = request.META['HTTP_HOST']

        domain_name = domain_name_url + "/"

        api_url = settings.API_URL + '/api-users/new-settings-data/'
        payload = {
            'user_id': user_id,
            'domain_name': domain_name
        }
        response_data = call_api_post_method(payload, api_url, token)
        if "error" in response_data and response_data['error'] == 0:
            return response_data['data']
        return {}
    except Exception as exp:
        return {}