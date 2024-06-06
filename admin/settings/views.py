# -*- coding: utf-8 -*-
"""This file contains general view functions for this module
"""
import re
import json
import time
import datetime
from datetime import timedelta
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.http import HttpResponseForbidden
from django.conf import settings
from django.http import JsonResponse
from django.http import HttpResponse
# from home.services import *
from django.core.cache import cache
from django.conf import settings
from subdomain.services import call_api_get_method, call_api_post_method
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from django.views.decorators.csrf import csrf_exempt
from subdomain.constants import settings_data
from packages.context_processors import subdomain_site_details, subdomain_admin_settings
from packages.globalfunction import *
from packages.constants import *
from django.template import RequestContext
from django.template.loader import get_template
from geopy.geocoders import Nominatim
import urllib.request
from urllib.request import urlopen, unquote
from urllib.parse import parse_qs, urlparse
from pyzipcode import ZipCodeDatabase
import math
import pandas as pd
import io
from io import BytesIO
from io import StringIO
from xhtml2pdf import pisa
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, Border, Side, PatternFill
from django.http import JsonResponse
from django.contrib import messages
from openpyxl.utils import get_column_letter
from packages.constants import PROPERTY_FEATURE_LOOKUPS
from django.template.defaulttags import register
CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)

# Create your views here.


def available_themes(request):
    """ Use to list/App/Update available themes for 
    broker/agent websites
    """
    try:
        try:
            # get themes path
            path = os.path.join(
                settings.SUBDOMAIM_DIR_PARENT, 'templates/home')
            #  include theme folders only
            themelist = [x for x in os.listdir(path) if not x.startswith(
                '.') and os.path.isdir(os.path.join(path, x))]
        except Exception as exp:
            print(exp, flush=True)
            themelist = []
        if request.method == 'POST':  # add theme
            api_url = settings.API_URL + '/api-settings/add-theme/'
            payload = {
                'theme_name': request.POST['name'],
                'theme_dir': request.POST['theme_dir'],
                'is_active': int(request.POST['is_active']) if 'is_active' in request.POST and request.POST['is_active'] != '' else 1
            }
            #  check if edit
            if 'theme_id' in request.POST and request.POST['theme_id']:
                payload['theme_id'] = int(request.POST['theme_id'])
            #  check theme directory value
            if request.POST['theme_dir'] not in themelist:
                messages.error(request, 'Theme Directory not Available')
                return redirect('admin-themes')
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['admin_token']['access_token'])
                if "error" in response and response['error'] == 0:
                    messages.success(request, response['msg'])
                    return redirect('admin-themes')
                else:
                    messages.error(request, response['msg'])
                    return redirect('admin-themes')
            except Exception as exp:
                messages.error(request, exp)
                return redirect('admin-themes')
        else:
            api_url = settings.API_URL + '/api-settings/admin-theme-listing/'
            data = []
            try:
                response = call_api_post_method(
                    {}, api_url, request.session['admin_token']['access_token'])
                if "error" in response and response['error'] == 0:
                    data = response['data']
                else:
                    messages.error(request, response['msg'])
            except Exception as exp:
                messages.error(request, exp)

            return render(request, "admin/settings/themes.html", {"data":  data, "themelist": themelist})
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def active_inactive_theme(request):
    """ Use to active/Inactive themes
    """
    try:
        error = 1
        if request.method == 'POST':
            api_url = settings.API_URL + '/api-settings/theme-status-change/'
            payload = {
                'theme_id': request.POST['theme_id'],
                'status': request.POST['status']
            }
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['admin_token']['access_token'])
                msg = response['msg']
                error = response['error']
            except Exception as exp:
                msg = exp
        else:
            msg = 'Get action not allowed'

        return JsonResponse({"msg": msg, "error": error})
    except Exception as exp:
        print(exp)
        return JsonResponse({"msg": exp, "error": 1})


def lookup_objects(request):
    """ Use to List/Add/Update lookup objects
    """
    try:
        if request.method == 'POST':  # add lookup object
            api_url = settings.API_URL + '/api-settings/add-lookup-object/'
            payload = {
                'object_name': request.POST['name'],
                'is_active': int(request.POST['is_active']) if 'is_active' in request.POST and request.POST['is_active'] != '' else 1
            }
            #  check if edit
            if 'object_id' in request.POST and request.POST['object_id']:
                payload['object_id'] = int(request.POST['object_id'])
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    messages.success(request, response['msg'])
                    return redirect('admin-lookup-objects')
                else:
                    messages.error(request, response['msg'])
                    return redirect('admin-lookup-objects')
            except Exception as exp:
                messages.error(request, exp)
                return redirect('admin-lookup-objects')
        else:
            api_url = settings.API_URL + '/api-settings/lookup-object-listing/'
            data = []
            try:
                response = call_api_post_method(
                    {}, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    data = response['data']
                else:
                    messages.error(request, response['msg'])
            except Exception as exp:
                messages.error(request, exp)

            return render(request, "admin/settings/lookup-objects.html", {"data":  data, "active_submenu": "lookup-objects"})
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def active_inactive_object(request):
    """ Use to Active/In-active lookup
    objects
    """
    try:
        error = 1
        if request.method == 'POST':
            api_url = settings.API_URL + '/api-settings/lookup-object-status-change/'
            payload = {
                'object_id': request.POST['object_id'],
                'is_active': request.POST['status']
            }
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                msg = response['msg']
                error = response['error']
            except Exception as exp:
                msg = exp
        else:
            msg = 'Get action not allowed'

        return JsonResponse({"msg": msg, "error": error})
    except Exception as exp:
        print(exp)
        return JsonResponse({"msg": exp, "error": 1})


def lookup_status(request):
    """ Use to List/Add/Update lookup Status
    """
    try:
        if request.method == 'POST':  # add lookup status
            api_url = settings.API_URL + '/api-settings/add-lookup-status/'
            payload = {
                'status_name': request.POST['name'],
                'is_active': int(request.POST['is_active']) if 'is_active' in request.POST and request.POST['is_active'] != '' else 1,
                # 'object_id': request.POST['object_id']
            }
            #  check if edit
            if 'status_id' in request.POST and request.POST['status_id']:
                payload['status_id'] = int(request.POST['status_id'])
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    messages.success(request, response['msg'])
                    return redirect('admin-lookup-status')
                else:
                    messages.error(request, response['msg'])
                    return redirect('admin-lookup-status')
            except Exception as exp:
                messages.error(request, exp)
                return redirect('admin-lookup-status')
        else:
            api_url = settings.API_URL + '/api-settings/admin-lookup-status-listing/'
            data = objectlist = []
            try:
                response = call_api_post_method(
                    {}, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    data = response['data']
                else:
                    messages.error(request, response['msg'])
            except Exception as exp:
                messages.error(request, exp)

            # get lookup objects
            api_url = settings.API_URL + '/api-settings/lookup-object-listing/'
            try:
                response = call_api_post_method(
                    {'is_active': True}, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    objectlist = response['data']
                else:
                    messages.error(request, response['msg'])
            except Exception as exp:
                messages.error(request, exp)

            return render(request, "admin/settings/lookup-status.html", {"data":  data, "objectlist": objectlist, "active_submenu": "lookup-status"})
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def active_inactive_status(request):
    """ Use to Active/In-active lookup
    status
    """
    try:
        error = 1
        if request.method == 'POST':
            api_url = settings.API_URL + '/api-settings/lookup-status-change-status/'
            payload = {
                'status_id': request.POST['status_id'],
                'is_active': request.POST['status']
            }
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                msg = response['msg']
                error = response['error']
            except Exception as exp:
                msg = exp
        else:
            msg = 'Get action not allowed'

        return JsonResponse({"msg": msg, "error": error})
    except Exception as exp:
        print(exp)
        return JsonResponse({"msg": exp, "error": 1})


def lookup_object_status(request):
    """ This function is used to list
    and lookup object status
    """
    try:
        if request.method == 'POST':
            api_url = settings.API_URL + '/api-settings/add-lookup-object-status/'
            payload = {
                'object_id': request.POST['object_id'],
                'status_id': request.POST['status_id'],
                'is_active': int(request.POST['is_active']) if 'is_active' in request.POST and request.POST['is_active'] != '' else 1
            }
            #  check if edit
            if 'status_object_id' in request.POST and request.POST['status_object_id']:
                payload['status_object_id'] = int(
                    request.POST['status_object_id'])
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    return JsonResponse({"msg": response['msg'], "error": 0})
                else:
                    return JsonResponse({"msg": response['msg'], "error": 1})
            except Exception as exp:
                return JsonResponse({"msg": exp, "error": 1})

        else:
            api_url = settings.API_URL + '/api-settings/lookup-object-listing/'
            object_list = []
            try:
                response = call_api_post_method(
                    {}, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    object_list = response['data']
                else:
                    messages.error(request, response['msg'])
            except Exception as exp:
                messages.error(request, exp)

            return render(
                request,
                "admin/settings/lookup-object-status/lookup-object-status.html",
                {"object_list":  object_list, "active_submenu": "lookup-object-status"}
            )
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


@csrf_exempt
def ajax_lookup_object_status(request):
    """ This function is to load property lookup
    object status list
    """
    feature_data = {}
    pagination = {}
    page_size = 20
    page_size = int(request.GET.get('count', 20))
    total_contacts = 0
    current_page = int(request.GET.get('page', '1'))
    # get object id
    object_id = request.GET.get('object_id', '')
    if object_id:
        object_id = int(object_id)
    api_url = settings.API_URL + '/api-settings/lookup-object-status-listing/'
    params = {
        'object_id': object_id,
        'page': current_page,
        'page_size': page_size,
        'search': request.GET['search'] if 'search' in request.GET else ''
    }
    try:
        response = call_api_post_method(
            params, api_url, request.session['token']['access_token'])

    except Exception as exp:
        response = {'msg': exp, 'status': 422}
    else:
        if "error" in response and response['error'] == 0:
            feature_data = response['data']['data']
            total_contacts = response['data']['total']
            total_pages = total_contacts / page_size
            if total_contacts % page_size != 0:
                total_pages += 1  # adding one more page if the last page
                # will contains less contacts

            pagination = make_pagination_html(current_page, total_pages,
                                              'lookup_object', 'lookup_object_list')

        try:
            object_details = []
            api_url = settings.API_URL + '/api-settings/lookup-object-detail/'
            response = call_api_post_method(
                {'object_id': object_id}, api_url, request.session['token']['access_token'])
            if "error" in response and response['error'] == 0:
                object_details = response['data'][0]
        except Exception as exp:
            pass

        lookup_status_data = get_lookup_status_list(request)
    context = {
        'data': feature_data,
        'pagination': pagination,
        'total_contacts': total_contacts,
        'search': request.GET['search'] if 'search' in request.GET else '',
        'object_details': object_details,
        'lookup_status_data': lookup_status_data,
        'start_index': (current_page - 1) * page_size,
        'page_size': page_size,
    }

    return render(request, 'admin/settings/lookup-object-status/ajax-lookup-object-status.html', context)


def active_inactive_object_status(request):
    """ Use to Active/In-active lookup
    object status
    """
    try:
        error = 1
        if request.method == 'POST':
            api_url = settings.API_URL + '/api-settings/lookup-object-change-status/'
            payload = {
                'status_object_id': request.POST['status_object_id'],
                'is_active': request.POST['status']
            }
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                msg = response['msg']
                error = response['error']
            except Exception as exp:
                msg = exp
        else:
            msg = 'Get action not allowed'

        return JsonResponse({"msg": msg, "error": error})
    except Exception as exp:
        print(exp)
        return JsonResponse({"msg": exp, "error": 1})


def plans(request):
    """ Use to list/add/update plans
    """
    try:
        if request.method == 'POST':  # add plans
            api_url = settings.API_URL + '/api-settings/add-plan-type/'
            payload = {
                'type_name': request.POST['type_name'],
                'duration_in_days': request.POST['duration_in_days'],
                'benefits': request.POST['benifits'],
                'is_active': int(request.POST['is_active']) if 'is_active' in request.POST and request.POST['is_active'] != '' else 1,
            }
            #  check if edit
            if 'type_id' in request.POST and request.POST['type_id']:
                payload['type_id'] = int(request.POST['type_id'])
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['admin_token']['access_token'])
                if "error" in response and response['error'] == 0:
                    messages.success(request, response['msg'])
                    return redirect('admin-plan')
                else:
                    messages.error(request, response['msg'])
                    return redirect('admin-plan')
            except Exception as exp:
                messages.error(request, exp)
                return redirect('admin-plan')
        else:
            api_url = settings.API_URL + '/api-settings/plan-type-listing/'
            data = []
            try:
                response = call_api_post_method(
                    {}, api_url, request.session['admin_token']['access_token'])
                if "error" in response and response['error'] == 0:
                    data = response['data']
                else:
                    messages.error(request, response['msg'])
            except Exception as exp:
                messages.error(request, exp)

            return render(request, "admin/settings/plans.html", {"data":  data})
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def active_inactive_plan(request):
    """ Use to active/in-active plan types
    """
    try:
        error = 1
        if request.method == 'POST':
            api_url = settings.API_URL + '/api-settings/plan-type-change-status/'
            payload = {
                'type_id': request.POST['type_id'],
                'is_active': request.POST['status']
            }
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['admin_token']['access_token'])
                msg = response['msg']
                error = response['error']
            except Exception as exp:
                msg = exp
        else:
            msg = 'Get action not allowed'

        return JsonResponse({"msg": msg, "error": error})
    except Exception as exp:
        print(exp)
        return JsonResponse({"msg": exp, "error": 1})


def subscriptions(request):
    """ Use to list/add/update subscriptions
    """
    try:
        if request.method == 'POST':  # add subscriptions
            api_url = settings.API_URL + '/api-settings/add-subscription/'
            payload = {
                'plan_name': request.POST['plan_name'],
                'plan_desc': request.POST['plan_desc'],
                'is_active': int(request.POST['is_active']) if 'is_active' in request.POST and request.POST['is_active'] != '' else 1
            }
            #  check if edit
            if 'subscription_id' in request.POST and request.POST['subscription_id']:
                payload['subscription_id'] = int(
                    request.POST['subscription_id'])
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['admin_token']['access_token'])
                if "error" in response and response['error'] == 0:
                    messages.success(request, response['msg'])
                    return redirect('admin-subscription')
                else:
                    messages.error(request, response['msg'])
                    return redirect('admin-subscription')
            except Exception as exp:
                messages.error(request, exp)
                return redirect('admin-subscription')
        else:
            #  get subscription plan list
            api_url = settings.API_URL + '/api-settings/admin-subscription-listing/'
            data = plantypelist = []
            try:
                response = call_api_post_method(
                    {}, api_url, request.session['admin_token']['access_token'])
                if "error" in response and response['error'] == 0:
                    data = response['data']
                else:
                    messages.error(request, response['msg'])
            except Exception as exp:
                messages.error(request, exp)

            return render(request, "admin/settings/subscriptions.html", {"data":  data})
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def active_inactive_subscription(request):
    """ Use to active/in-active subscriptions
    """
    try:
        error = 1
        if request.method == 'POST':
            api_url = settings.API_URL + '/api-settings/subscription-status-change/'
            payload = {
                'subscription_id': request.POST['subscription_id'],
                'is_active': request.POST['status']
            }
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['admin_token']['access_token'])
                msg = response['msg']
                error = response['error']
            except Exception as exp:
                msg = exp
        else:
            msg = 'Get action not allowed'

        return JsonResponse({"msg": msg, "error": error})
    except Exception as exp:
        print(exp)
        return JsonResponse({"msg": exp, "error": 1})


def plan_pricing(request):
    """ This function is used to list
    plan pricing
    """
    try:
        if request.method == 'POST':
            api_url = settings.API_URL + '/api-settings/add-plan-pricing/'
            payload = {
                'subscription_id': request.POST['subscription_id'],
                'plan_type_id': request.POST['plan_type_id'],
                'cost': request.POST['cost'],
                'is_active': int(request.POST['is_active']) if 'is_active' in request.POST and request.POST['is_active'] != '' else 1
            }
            #  check if edit
            if 'plan_price_id' in request.POST and request.POST['plan_price_id']:
                payload['plan_price_id'] = int(request.POST['plan_price_id'])

            try:
                response = call_api_post_method(
                    payload, api_url, request.session['admin_token']['access_token'])
                if "error" in response and response['error'] == 0:
                    messages.success(request, response['msg'])
                    return redirect('admin-plan-pricing')
                else:
                    messages.error(request, response['msg'])
                    return redirect('admin-plan-pricing')
            except Exception as exp:
                messages.error(request, exp)
                return redirect('admin-plan-pricing')
        else:
            api_url = settings.API_URL + '/api-settings/plan-type-list/'
            plan_types = []
            try:
                response = call_api_post_method(
                    {}, api_url, request.session['admin_token']['access_token'])
                if "error" in response and response['error'] == 0:
                    plan_types = response['data']
                else:
                    messages.error(request, response['msg'])
            except Exception as exp:
                messages.error(request, exp)

            api_url = settings.API_URL + '/api-settings/subscription-list/'
            subscription_types = []
            try:
                response = call_api_post_method(
                    {}, api_url, request.session['admin_token']['access_token'])
                if "error" in response and response['error'] == 0:
                    subscription_types = response['data']
                else:
                    messages.error(request, response['msg'])
            except Exception as exp:
                messages.error(request, exp)

            api_url = settings.API_URL + '/api-settings/admin-plan-pricing-listing/'
            plan_pricing_list = []
            try:
                response = call_api_post_method(
                    {}, api_url, request.session['admin_token']['access_token'])
                if "error" in response and response['error'] == 0:
                    plan_pricing_list = response['data']
                else:
                    messages.error(request, response['msg'])
            except Exception as exp:
                messages.error(request, exp)

            return render(
                request,
                "admin/settings/plan-pricing.html",
                {
                    "plan_types": plan_types,
                    "subscription_types": subscription_types,
                    "plan_pricing_list": plan_pricing_list
                }
            )
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def active_inactive_plan_pricing(request):
    """ Use to Active/In-active plan
    pricing status
    """
    try:
        error = 1
        if request.method == 'POST':
            api_url = settings.API_URL + '/api-settings/plan-pricing-status-change/'
            payload = {
                'plan_price_id': request.POST['plan_pricing_id'],
                'is_active': request.POST['status']
            }
            print(payload)
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['admin_token']['access_token'])
                msg = response['msg']
                error = response['error']
            except Exception as exp:
                msg = exp
        else:
            msg = 'Get action not allowed'

        return JsonResponse({"msg": msg, "error": error})
    except Exception as exp:
        print(exp)
        return JsonResponse({"msg": exp, "error": 1})


def user_type(request):
    """ Use to List/Add/Update user type
    """
    try:
        if request.method == 'POST':  # add user type
            api_url = settings.API_URL + '/api-settings/add-user-type/'
            payload = {
                'user_type': request.POST['user_type'],
                'is_active': int(request.POST['is_active']) if 'is_active' in request.POST and request.POST['is_active'] != '' else 1
            }
            #  check if edit
            if 'user_type_id' in request.POST and request.POST['user_type_id']:
                payload['user_type_id'] = int(request.POST['user_type_id'])
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    messages.success(request, response['msg'])
                    return redirect('admin-user-type')
                else:
                    messages.error(request, response['msg'])
                    return redirect('admin-user-type')
            except Exception as exp:
                messages.error(request, exp)
                return redirect('admin-user-type')
        else:
            data = get_user_type_list(request)

            return render(request, "admin/settings/user-type.html", {"data":  data, "active_submenu": "user-types"})
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def active_inactive_user_type(request):
    """ Use to active/in-active user type
    """
    try:
        error = 1
        if request.method == 'POST':
            api_url = settings.API_URL + '/api-settings/user-type-change-status/'
            payload = {
                'user_type_id': request.POST['user_type_id'],
                'is_active': request.POST['status']
            }
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                msg = response['msg']
                error = response['error']
            except Exception as exp:
                msg = exp
        else:
            msg = 'Get action not allowed'

        return JsonResponse({"msg": msg, "error": error})
    except Exception as exp:
        print(exp)
        return JsonResponse({"msg": exp, "error": 1})


def user_permissions(request):
    """ Use to List/Add/Update user permissions
    """
    try:
        if request.method == 'POST':  # add user type
            api_url = settings.API_URL + '/api-settings/add-permission/'
            payload = {
                'name': request.POST['name'],
                'permission_type': request.POST['permission_type'],
                'is_active': int(request.POST['is_active']) if 'is_active' in request.POST and request.POST['is_active'] != '' else 1
            }
            #  check if edit
            if 'permission_id' in request.POST and request.POST['permission_id']:
                payload['permission_id'] = int(request.POST['permission_id'])
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    messages.success(request, response['msg'])
                    return redirect('admin-user-permissions')
                else:
                    messages.error(request, response['msg'])
                    return redirect('admin-user-permissions')
            except Exception as exp:
                messages.error(request, exp)
                return redirect('admin-user-permissions')
        else:
            data = get_permissions_list(request)
            return render(request, "admin/settings/lookup-permissions.html", {"data":  data, "active_submenu": "permissions"})
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def active_inactive_user_permission(request):
    """ Use to active/in-active user permission
    """
    try:
        error = 1
        if request.method == 'POST':
            api_url = settings.API_URL + '/api-settings/permission-change-status/'
            payload = {
                'permission_id': request.POST['permission_id'],
                'is_active': request.POST['status']
            }
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                msg = response['msg']
                error = response['error']
            except Exception as exp:
                msg = exp
        else:
            msg = 'Get action not allowed'

        return JsonResponse({"msg": msg, "error": error})
    except Exception as exp:
        print(exp)
        return JsonResponse({"msg": exp, "error": 1})


def property_type(request):
    """ Use to List/Add/Update property type
    """
    try:
        if request.method == 'POST':  # add property type
            api_url = settings.API_URL + '/api-settings/add-property-type/'
            payload = {
                'property_type': request.POST['property_type'],
                'is_active': int(request.POST['is_active']) if 'is_active' in request.POST and request.POST['is_active'] != '' else 1
            }
            #  check if edit
            if 'property_type_id' in request.POST and request.POST['property_type_id']:
                payload['property_type_id'] = int(
                    request.POST['property_type_id'])
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['admin_token']['access_token'])
                if "error" in response and response['error'] == 0:
                    messages.success(request, response['msg'])
                    return redirect('admin-property-type')
                else:
                    messages.error(request, response['msg'])
                    return redirect('admin-property-type')
            except Exception as exp:
                messages.error(request, exp)
                return redirect('admin-property-type')
        else:
            api_url = settings.API_URL + '/api-settings/property-type-listing/'
            data = []
            try:
                response = call_api_post_method(
                    {}, api_url, request.session['admin_token']['access_token'])
                if "error" in response and response['error'] == 0:
                    data = response['data']
                else:
                    messages.error(request, response['msg'])
            except Exception as exp:
                messages.error(request, exp)

            return render(request, "admin/settings/property-type.html", {"data":  data})
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def active_inactive_property_type(request):
    """ Use to active/in-active property type
    """
    try:
        error = 1
        if request.method == 'POST':
            api_url = settings.API_URL + '/api-settings/property-type-change-status/'
            payload = {
                'property_type_id': request.POST['property_type_id'],
                'is_active': request.POST['status']
            }
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['admin_token']['access_token'])
                msg = response['msg']
                error = response['error']
            except Exception as exp:
                msg = exp
        else:
            msg = 'Get action not allowed'

        return JsonResponse({"msg": msg, "error": error})
    except Exception as exp:
        print(exp)
        return JsonResponse({"msg": exp, "error": 1})


def auction_type(request):
    """ Use to List/Add/Update auction type
    """
    try:
        if request.method == 'POST':  # add auction type
            api_url = settings.API_URL + '/api-settings/add-auction-type/'
            payload = {
                'auction_type': request.POST['auction_type'],
                'is_active': int(request.POST['is_active']) if 'is_active' in request.POST and request.POST['is_active'] != '' else 1
            }
            #  check if edit
            if 'auction_type_id' in request.POST and request.POST['auction_type_id']:
                payload['auction_type_id'] = int(
                    request.POST['auction_type_id'])
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    messages.success(request, response['msg'])
                    return redirect('admin-auction-type')
                else:
                    messages.error(request, response['msg'])
                    return redirect('admin-auction-type')
            except Exception as exp:
                messages.error(request, exp)
                return redirect('admin-auction-type')
        else:
            api_url = settings.API_URL + '/api-settings/auction-type-listing/'
            data = []
            try:
                response = call_api_post_method(
                    {}, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    data = response['data']
                else:
                    messages.error(request, response['msg'])
            except Exception as exp:
                messages.error(request, exp)

            return render(request, "admin/settings/auction-type.html", {"data":  data, "active_submenu": "auction-types"})
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def active_inactive_auction_type(request):
    """ Use to active/in-active auction type
    """
    try:
        error = 1
        if request.method == 'POST':
            api_url = settings.API_URL + '/api-settings/auction-type-change-status/'
            payload = {
                'auction_type_id': request.POST['auction_type_id'],
                'is_active': request.POST['status']
            }
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                msg = response['msg']
                error = response['error']
            except Exception as exp:
                msg = exp
        else:
            msg = 'Get action not allowed'

        return JsonResponse({"msg": msg, "error": error})
    except Exception as exp:
        print(exp)
        return JsonResponse({"msg": exp, "error": 1})


def document_type(request):
    """ Use to List/Add/Update document type
    """
    try:
        if request.method == 'POST':  # add document type
            api_url = settings.API_URL + '/api-settings/add-documents-type/'
            payload = {
                'document_name': request.POST['document_name'],
                'is_active': int(request.POST['is_active']) if 'is_active' in request.POST and request.POST['is_active'] != '' else 1
            }
            #  check if edit
            if 'documents_type_id' in request.POST and request.POST['documents_type_id']:
                payload['documents_type_id'] = int(
                    request.POST['documents_type_id'])
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    messages.success(request, response['msg'])
                    return redirect('admin-document-type')
                else:
                    messages.error(request, response['msg'])
                    return redirect('admin-document-type')
            except Exception as exp:
                messages.error(request, exp)
                return redirect('admin-document-type')
        else:
            api_url = settings.API_URL + '/api-settings/documents-type-listing/'
            data = []
            try:
                response = call_api_post_method(
                    {}, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    data = response['data']
                else:
                    messages.error(request, response['msg'])
            except Exception as exp:
                messages.error(request, exp)

            return render(request, "admin/settings/document-type.html", {"data":  data, "active_submenu": "document-types"})
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def active_inactive_document_type(request):
    """ Use to active/in-active document type
    """
    try:
        error = 1
        if request.method == 'POST':
            api_url = settings.API_URL + '/api-settings/documents-type-change-status/'
            payload = {
                'documents_type_id': request.POST['documents_type_id'],
                'is_active': request.POST['status']
            }
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                msg = response['msg']
                error = response['error']
            except Exception as exp:
                msg = exp
        else:
            msg = 'Get action not allowed'

        return JsonResponse({"msg": msg, "error": error})
    except Exception as exp:
        print(exp)
        return JsonResponse({"msg": exp, "error": 1})


def blog_category(request):
    """ Use to List/Add/Update blog category
    """
    try:
        if request.method == 'POST':  # add blog category
            api_url = settings.API_URL + '/api-blog/add-blog-category/'
            payload = {
                'name': request.POST['name'],
                'status': int(request.POST['status']) if 'status' in request.POST and request.POST['status'] != '' else 1
            }
            #  check if edit
            if 'category_id' in request.POST and request.POST['category_id']:
                payload['category_id'] = int(request.POST['category_id'])
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    messages.success(request, response['msg'])
                    return redirect('admin-blog-categories')
                else:
                    messages.error(request, response['msg'])
                    return redirect('admin-blog-categories')
            except Exception as exp:
                messages.error(request, exp)
                return redirect('admin-blog-categories')
        else:
            api_url = settings.API_URL + '/api-blog/blog-category-list/'
            data = []
            try:
                response = call_api_post_method(
                    {}, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    data = response['data']
                else:
                    messages.error(request, response['msg'])
            except Exception as exp:
                messages.error(request, exp)

            status_list = get_lookup_status_list(request)

            return render(request, "admin/settings/blog-category.html", {"data":  data, 'status_list': status_list, "active_submenu": "blog-categories"})
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


# def active_inactive_blog_category(request):
#     """ Use to active/in-active document type
#     """
#     try:
#         error = 1
#         if request.method == 'POST':
#             api_url = settings.API_URL + '/api-settings/documents-type-change-status/'
#             payload = {
#                 'documents_type_id': request.POST['documents_type_id'],
#                 'is_active': request.POST['status']
#             }
#             try:
#                 response = call_api_post_method(payload, api_url, request.session['admin_token']['access_token'])
#                 msg = response['msg']
#                 error = response['error']
#             except Exception as exp:
#                 msg = exp
#         else:
#             msg = 'Get action not allowed'

#         return JsonResponse({"msg": msg, "error": error})
#     except Exception as exp:
#         print(exp)
#         return JsonResponse({"msg": exp, "error": 1})


def address_type(request):
    """ Use to List/Add/Update address type
    """
    try:
        if request.method == 'POST':  # add address type
            api_url = settings.API_URL + '/api-settings/add-address-type/'
            payload = {
                'address_type': request.POST['address_type'],
                'is_active': int(request.POST['is_active']) if 'is_active' in request.POST and request.POST['is_active'] != '' else 1
            }
            #  check if edit
            if 'address_type_id' in request.POST and request.POST['address_type_id']:
                payload['address_type_id'] = int(
                    request.POST['address_type_id'])
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    messages.success(request, response['msg'])
                    return redirect('admin-address-type')
                else:
                    messages.error(request, response['msg'])
                    return redirect('admin-address-type')
            except Exception as exp:
                messages.error(request, exp)
                return redirect('admin-address-type')
        else:
            api_url = settings.API_URL + '/api-settings/address-type-listing/'
            data = []
            try:
                response = call_api_post_method(
                    {}, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    data = response['data']
                else:
                    messages.error(request, response['msg'])
            except Exception as exp:
                messages.error(request, exp)

            return render(request, "admin/settings/address-type.html", {"data":  data, "active_submenu": "address-types"})
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def active_inactive_address_type(request):
    """ Use to active/in-active address type
    """
    try:
        error = 1
        if request.method == 'POST':
            api_url = settings.API_URL + '/api-settings/address-type-change-status/'
            payload = {
                'address_type_id': request.POST['address_type_id'],
                'is_active': request.POST['status']
            }
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                msg = response['msg']
                error = response['error']
            except Exception as exp:
                msg = exp
        else:
            msg = 'Get action not allowed'

        return JsonResponse({"msg": msg, "error": error})
    except Exception as exp:
        print(exp)
        return JsonResponse({"msg": exp, "error": 1})


def upload_step(request):
    """ Use to List/Add/Update upload step
    """
    try:
        if request.method == 'POST':  # add upload step
            api_url = settings.API_URL + '/api-settings/add-upload-step/'
            payload = {
                'uploads_name': request.POST['uploads_name'],
                'is_active': int(request.POST['is_active']) if 'is_active' in request.POST and request.POST['is_active'] != '' else 1
            }
            #  check if edit
            if 'upload_step_id' in request.POST and request.POST['upload_step_id']:
                payload['upload_step_id'] = int(request.POST['upload_step_id'])
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    messages.success(request, response['msg'])
                    return redirect('admin-upload-step')
                else:
                    messages.error(request, response['msg'])
                    return redirect('admin-upload-step')
            except Exception as exp:
                messages.error(request, exp)
                return redirect('admin-upload-step')
        else:
            api_url = settings.API_URL + '/api-settings/upload-step-listing/'
            data = []
            try:
                response = call_api_post_method(
                    {}, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    data = response['data']
                else:
                    messages.error(request, response['msg'])
            except Exception as exp:
                messages.error(request, exp)

            return render(request, "admin/settings/upload-step.html", {"data":  data, "active_submenu": "upload-steps"})
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def active_inactive_upload_step(request):
    """ Use to active/in-active upload step
    """
    try:
        error = 1
        if request.method == 'POST':
            api_url = settings.API_URL + '/api-settings/upload-step-change-status/'
            payload = {
                'upload_step_id': request.POST['upload_step_id'],
                'is_active': request.POST['status']
            }
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                msg = response['msg']
                error = response['error']
            except Exception as exp:
                msg = exp
        else:
            msg = 'Get action not allowed'

        return JsonResponse({"msg": msg, "error": error})
    except Exception as exp:
        print(exp)
        return JsonResponse({"msg": exp, "error": 1})


def event_type(request):
    """ Use to List/Add/Update event type
    """
    try:
        if request.method == 'POST':  # add event type
            api_url = settings.API_URL + '/api-settings/add-event/'
            payload = {
                'event_name': request.POST['event_name'],
                'slug': request.POST['event_slug'],
                'is_active': int(request.POST['is_active']) if 'is_active' in request.POST and request.POST['is_active'] != '' else 1
            }
            #  check if edit
            if 'event_id' in request.POST and request.POST['event_id']:
                payload['event_id'] = int(request.POST['event_id'])
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    messages.success(request, response['msg'])
                    return redirect('admin-event-type')
                else:
                    messages.error(request, response['msg'])
                    return redirect('admin-event-type')
            except Exception as exp:
                messages.error(request, exp)
                return redirect('admin-event-type')
        else:
            data = get_event_list(request)

            return render(request, "admin/settings/event-type.html", {"data":  data, "active_submenu": "event-types"})
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def active_inactive_event_type(request):
    """ Use to active/in-active event type
    """
    try:
        error = 1
        if request.method == 'POST':
            api_url = settings.API_URL + '/api-settings/event-change-status/'
            payload = {
                'event_id': request.POST['event_id'],
                'is_active': request.POST['status']
            }
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                msg = response['msg']
                error = response['error']
            except Exception as exp:
                msg = exp
        else:
            msg = 'Get action not allowed'

        return JsonResponse({"msg": msg, "error": error})
    except Exception as exp:
        print(exp)
        return JsonResponse({"msg": exp, "error": 1})


def site_setting(request):
    """ Use to List/Add/Update site setting
    """
    try:
        if request.method == 'POST':  # add site setting
            api_url = settings.API_URL + '/api-settings/add-site-setting/'
            payload = {
                'settings_name': request.POST['settings_name'],
                'setting_value': request.POST['setting_value'],
                'is_active': int(request.POST['is_active']) if 'is_active' in request.POST and request.POST['is_active'] != '' else 1
            }
            #  check if edit
            if 'setting_id' in request.POST and request.POST['setting_id']:
                payload['setting_id'] = int(request.POST['setting_id'])
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    messages.success(request, response['msg'])
                    return redirect('admin-site-setting')
                else:
                    messages.error(request, response['msg'])
                    return redirect('admin-site-setting')
            except Exception as exp:
                messages.error(request, exp)
                return redirect('admin-site-setting')
        else:
            api_url = settings.API_URL + '/api-settings/site-setting-listing/'
            data = []
            try:
                response = call_api_post_method(
                    {}, api_url, request.session['token']['access_token'])
                if "error" in response and response['error'] == 0:
                    data = response['data']
                else:
                    messages.error(request, response['msg'])
            except Exception as exp:
                messages.error(request, exp)

            return render(request, "admin/settings/site-setting.html", {"data":  data, "active_submenu": "site-settings"})
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def active_inactive_site_setting(request):
    """ Use to active/in-active site settings type
    """
    try:
        error = 1
        if request.method == 'POST':
            api_url = settings.API_URL + '/api-settings/site-setting-change-status/'
            payload = {
                'setting_id': request.POST['setting_id'],
                'is_active': request.POST['status']
            }
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                msg = response['msg']
                error = response['error']
            except Exception as exp:
                msg = exp
        else:
            msg = 'Get action not allowed'

        return JsonResponse({"msg": msg, "error": error})
    except Exception as exp:
        print(exp)
        return JsonResponse({"msg": exp, "error": 1})


# handle time zones
def time_zones(request):
    """ This function is used to show timezone page
    """
    try:
        return render(request, "admin/settings/timezones/time-zone.html", {"active_submenu": "time-zones"})
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def ajax_time_zone(request):
    """ This function is used to list
    time zone 
    """
    timezone_data = {}
    pagination = {}
    page_size = 20
    page_size = int(request.GET.get('count', 20))
    current_page = int(request.GET.get('page', '1'))
    api_url = settings.API_URL + '/api-settings/admin-timezone-listing/'
    params = {
        'page': current_page,
        'page_size': page_size,
        'search': request.GET.get('search') if 'search' in request.GET else ''
    }
    try:
        response = call_api_post_method(
            params, api_url, request.session['token']['access_token'])
    except Exception as exp:
        response = {'msg': exp, 'status': 422}
    else:
        if "error" in response and response['error'] == 0:
            timezone_data = response['data']
            total_contacts = response['data']['total']
            total_pages = total_contacts / page_size
            if total_contacts % page_size != 0:
                total_pages += 1  # adding one more page if the last page
                # will contains less contacts

            pagination = make_pagination_html(current_page, total_pages,
                                              'time_zones', 'time_zones_list')

    context = {
        'data': timezone_data,
        'pagination': pagination,
        'start_index': (current_page - 1) * page_size
    }
    return render(request, 'admin/settings/timezones/ajax-time-zones.html', context)


def active_inactive_time_zone(request):
    """ This function is used to active/inactive
    """
    try:
        error = 1
        if request.method == 'POST':
            api_url = settings.API_URL + '/api-settings/admin-timezone-change-status/'
            payload = {
                'timezone_id': request.POST['timezone_id'],
                'is_active': request.POST['status']
            }
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                msg = response['msg']
                error = response['error']
            except Exception as exp:
                msg = exp
        else:
            msg = 'Get action not allowed'

        return JsonResponse({"msg": msg, "error": error})
    except Exception as exp:
        print(exp)
        return JsonResponse({"msg": exp, "error": 1})


def property_features(request):
    """ This funcstion is used to list
    and save property fatures settings
    """
    try:
        if request.method == 'POST':
            api_url = settings.API_URL + '/api-settings/add-property-features/'
            payload = {
                'feature_type': request.POST['feature_type'],
                'asset_id': request.POST['asset_id'],
                'name': request.POST['name'],
                'is_active': int(request.POST['is_active']) if 'is_active' in request.POST and request.POST['is_active'] != '' else 1
            }
            #  check if edit
            if 'feature_id' in request.POST and request.POST['feature_id']:
                payload['feature_id'] = int(request.POST['feature_id'])
            try:
                response = call_api_post_method(
                    payload, api_url, request.session['admin_token']['access_token'])
                if "error" in response and response['error'] == 0:
                    return JsonResponse({"msg": response['msg'], "error": 0})
                else:
                    return JsonResponse({"msg": response['msg'], "error": 1})
            except Exception as exp:
                return JsonResponse({"msg": exp, "error": 1})

        else:
            property_feature_list = PROPERTY_FEATURE_LOOKUPS
            asset_list = get_property_asset_list(request)

            return render(
                request,
                "admin/property-settings/features-index.html",
                {"property_feature_list":  property_feature_list,
                    'asset_list': asset_list, 'active_submenu': 'property-features'}
            )
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


@csrf_exempt
def ajax_property_features_list(request):
    """ This function is to load property feature
    list selected
    """
    feature_data = {}
    pagination = {}
    page_size = 20
    page_size = int(request.GET.get('count', 20))
    total_contacts = 0
    current_page = int(request.GET.get('page', '1'))
    feature_type = request.GET.get('feature_type', '')
    # get asset id
    asset_id = request.GET.get('asset_id', '')
    if asset_id:
        asset_id = int(asset_id)
    api_url = settings.API_URL + '/api-settings/property-features-listing/'
    params = {
        'feature_type': feature_type,
        'asset_id': asset_id,
        'page': current_page,
        'page_size': page_size,
        'search': request.GET.get('search') if 'search' in request.GET else ''
    }
    try:
        response = call_api_post_method(
            params, api_url, request.session['token']['access_token'])

    except Exception as exp:
        response = {'msg': exp, 'status': 422}
    else:
        if "error" in response and response['error'] == 0:
            feature_data = response['data']['data']
            total_contacts = response['data']['total']
            total_pages = total_contacts / page_size
            if total_contacts % page_size != 0:
                total_pages += 1  # adding one more page if the last page
                # will contains less contacts

            pagination = make_pagination_html(current_page, total_pages,
                                              'property_Feature', 'property_Feature_list')
    context = {
        'data': feature_data,
        'pagination': pagination,
        'feature_type_name': PROPERTY_FEATURE_LOOKUPS[feature_type] if feature_type else '',
        'feature_type_key': feature_type,
        'total_contacts': total_contacts,
        'search': request.GET.get('search') if 'search' in request.GET else '',
        'asset_id': asset_id,
        'asset_data': get_property_asset_list(request),
        'start_index': (current_page - 1) * page_size,
        'page_size': page_size,
    }
    return render(request, 'admin/property-settings/ajax-property-feature.html', context)


def active_inactive_property_feature(request):
    """ Use to active/in-active property feature
    """
    try:
        error = 1
        if request.method == 'POST':
            api_url = settings.API_URL + '/api-settings/property-features-change-status/'
            payload = {
                'feature_id': request.POST['feature_id'],
                'feature_type': request.POST['feature_type'],
                'is_active': request.POST['status']
            }
            try:
                print(payload)
                response = call_api_post_method(
                    payload, api_url, request.session['token']['access_token'])
                print(response)
                msg = response['msg']
                error = response['error']
            except Exception as exp:
                msg = exp
        else:
            msg = 'Get action not allowed'

        return JsonResponse({"msg": msg, "error": error})
    except Exception as exp:
        print(exp)
        return JsonResponse({"msg": exp, "error": 1})


@register.filter()
def to_int(value):
    try:
        return int(value)
    except Exception as exp:
        # print(exp)
        return value        


@register.filter(expects_localtime=True)
def parse_iso(value):
    try: 
        if value:
            try:
                date_obj = datetime.datetime.strptime(value, "%Y-%m-%dT%H:%M:%SZ")
            except ValueError:
                date_obj = datetime.datetime.strptime(value, "%Y-%m-%dT%H:%M:%S.%fZ")
            return date_obj
        else:
            return value
    except Exception as exp:
        return value