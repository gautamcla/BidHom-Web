# -*- coding: utf-8 -*-
"""This file contains list of commonly used services
throughout the program
"""

import requests
from django.conf import settings
from django.shortcuts import redirect


def call_api_get_method(params, url, token=None):
    """This function is used for calling API with get method.

    Parameters:
        params (dictionary): API return data on basis of params
        url (string): Url path of the API
        token (string): Url path of the API

    Returns:
        json: API returns data on json type
    """
    try:
        if token is None:
            headers = {'Authorization': 'Token '+settings.AUTH_TOKEN}
        else:
            headers = {'Authorization': 'Bearer ' + token}

        response = requests.get(url, params=params, headers=headers)
        result = response.json()
        return result
    except Exception as exp:
        print(exp)
        return False


def call_api_post_method(params, url, token=None):
    """This function is used for calling API with post method.

    Parameters:
        params (dictionary): API return data on basis of params
        url (string): Url path of the API
        token (string): Url path of the API

    Returns:
        json: API returns data on json type
    """
    try:
        if token is None:
            headers = {"Authorization": "Token " + settings.AUTH_TOKEN, "content_type": "application/json"}
        else:
            headers = {"Authorization": "Bearer " + token, "content_type": "application/json"}

        response = requests.post(url, json=params, headers=headers)
        result = response.json()
        return result
    except Exception as exp:
        print(exp)
        return False
