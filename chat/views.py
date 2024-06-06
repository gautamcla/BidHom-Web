# -*- coding: utf-8 -*-
"""This file contains general view functions for this module
"""
import json
import datetime
from datetime import timedelta
from django.shortcuts import render, redirect
from django.conf import settings
from django.http import JsonResponse
from django.http import HttpResponse
# from home.services import *
from django.core.cache import cache
from django.conf import settings
from subdomain.constants import *
from subdomain.services import call_api_get_method, call_api_post_method
from django.http import HttpResponseRedirect
from packages.context_processors import subdomain_site_details
from packages.globalfunction import *
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from geopy.geocoders import Nominatim
import urllib.request
from urllib.request import urlopen, unquote
from urllib.parse import parse_qs, urlparse
import math
CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)
from django.views.decorators.csrf import csrf_exempt
from django.template.loader import get_template


# @csrf_exempt
# def chat_list(request):
#     try:
#         try:
#             site_detail = subdomain_site_details(request)
#             site_id = site_detail['site_detail']['site_id']
#             templete_dir = site_detail['site_detail']['theme_directory']

#         except Exception as exp:
#             print(exp)
#             site_id = ""
#             templete_dir = 'theme-1'

#         static_dir = templete_dir

#         token = request.session['token']['access_token']
#         user_id = request.session['user_id']

#         page_size = 10
#         if request.is_ajax() and request.method == 'POST':
#             page = 1
#             if 'page' in request.POST and request.POST['page'] != "":
#                 page = request.POST['page']

#             if 'page_size' in request.POST and request.POST['page_size'] != "":
#                 page_size = request.POST['page_size']

#             last_msg_id = ''
#             if 'last_msg_id' in request.POST and request.POST['last_msg_id'] != "":
#                 last_msg_id = request.POST['last_msg_id']

#             filter_chat = ''
#             if 'filter_chat' in request.POST and request.POST['filter_chat'] != "":
#                 filter_chat = request.POST['filter_chat']

#             params = {
#                 "site_id": site_id,
#                 "user_id": user_id,
#                 "page": page,
#                 "page_size": page_size,
#                 "last_msg_id": last_msg_id,
#                 "filter_data": filter_chat,
#             }
#             if 'msg_type' in request.POST and request.POST['msg_type'] != "":
#                 msg_type = request.POST['msg_type']
#                 params['msg_type'] = msg_type

#             api_url = settings.API_URL + '/api-contact/user-chat-master-listing/'
#             chat_data = call_api_post_method(params, api_url, token=token)

#             if 'error' in chat_data and chat_data['error'] == 0:
#                 chat_listing = chat_data['data']['data']
#                 try:
#                     length = len(chat_listing)
#                     first_master_id = chat_listing[0]['id']
#                     last_master_id = chat_listing[length-1]['id']
#                 except:
#                     first_master_id = ''
#                     last_master_id = ''

#                 total = chat_data['data']['total']
#                 page = chat_data['data']['page']
#                 page_size = chat_data['data']['page_size']
#             else:
#                 chat_listing = []
#                 total = 0
#                 page = page
#                 page_size = page_size
#                 first_master_id = ''
#                 last_master_id = ''


#             context = {'chat_listing': chat_listing, 'total': total, "aws_url": settings.AWS_URL}

#             chat_listing_path = 'home/{}/user-dashboard/chat/chat-listing.html'.format(templete_dir)
#             chat_listing_template = get_template(chat_listing_path)
#             chat_listing_html = chat_listing_template.render(context)


#             data = {'chat_listing_html': chat_listing_html, 'status': 200, 'msg': '', 'error': 0, 'total': total, "page": page, "page_size": page_size, "last_master_id": last_master_id, "first_master_id": first_master_id}
#             return JsonResponse(data)

#         else:
#             try:
#                 params = {"site_id": site_id, "user_id": user_id, "page": 1, "page_size": page_size}
#                 api_url = settings.API_URL + '/api-contact/user-chat-master-listing/'
#                 chat_data = call_api_post_method(params, api_url, token=token)
#                 if 'error' in chat_data and chat_data['error'] == 0:
#                     chat_listing = chat_data['data']['data']
#                     length = len(chat_listing)
#                     try:
#                         first_master_id = chat_listing[0]['id']
#                         last_master_id = chat_listing[length-1]['id']
#                     except:
#                         first_master_id = ''
#                         last_master_id = ''
#                     total = chat_data['data']['total']
#                     page = chat_data['data']['page']
#                     page_size = chat_data['data']['page_size']

#                 else:
#                     chat_listing = []
#                     total = 0
#                     page = 1
#                     first_master_id = ''
#                     last_master_id = ''
#                     page_size = page_size
#             except:
#                 chat_listing = []
#                 total = 0
#                 page = 1
#                 page_size = page_size
#                 first_master_id = ''
#                 last_master_id = ''

#         context = {"active_menu": "chat", "chat_listing": chat_listing, "total": total, "page": page, "page_size": page_size, "last_master_id": last_master_id, "first_master_id": first_master_id}

#         theme_path = 'home/{}/user-dashboard/chat/chat.html'.format(templete_dir)
#         return render(request, theme_path, context)
#     except Exception as exp:
#         print(exp)
#         return HttpResponse("Issue in views")

@csrf_exempt
def chat(request):
    try:
        try:
            site_detail = subdomain_site_details(request)
            site_id = site_detail['site_detail']['site_id']
            templete_dir = site_detail['site_detail']['theme_directory']

        except Exception as exp:
            print(exp)
            site_id = ""
            templete_dir = 'theme-1'
        
        
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip_address = x_forwarded_for.split(',')[0]
        else:
            ip_address = request.META.get('REMOTE_ADDR')

        context = {"active_menu": "chat", "site_id": site_id, "ip_address": ip_address, "node_url": settings.NODE_URL,}

        theme_path = 'home/{}/user-dashboard/chat/chat.html'.format(templete_dir)
        return render(request, theme_path, context)
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


@csrf_exempt
def chat_history(request):
    try:
        if request.is_ajax() and request.method == 'POST':
            try:
                site_detail = subdomain_site_details(request)
                site_id = site_detail['site_detail']['site_id']
                templete_dir = site_detail['site_detail']['theme_directory']
            except Exception as exp:
                site_id = ""
                templete_dir = 'theme-1'

            static_dir = templete_dir
            user_id = None
            token = None
            page = 1
            page_size = 10
            if 'user_id' in request.session:
                user_id = request.session['user_id']
                token = request.session['token']['access_token']


            master_id = request.POST['master_id']
            params = {
                "site_id": site_id,
                "user_id": user_id,
                "master_id": master_id,
                "page": page,
                "page_size": page_size,
                "last_msg_id": request.POST['last_msg_id'],
            }
            if 'msg_type' in request.POST and request.POST['msg_type'] != "":
                msg_type = request.POST['msg_type']
                params['msg_type'] = msg_type

            api_url = settings.API_URL + '/api-contact/user-chat-listing/'
            chat_data = call_api_post_method(params, api_url, token=token)
            if 'error' in chat_data and chat_data['error'] == 0:
                try:
                    read_msg_params = {
                        "site_id": site_id,
                        "user_id": user_id,
                        "master_id": master_id
                    }
                    read_api_url = settings.API_URL + '/api-contact/mark-chat-read/'
                    read_chat = call_api_post_method(read_msg_params, read_api_url, token=token)
                except Exception as exp:
                    print(exp)
                    pass
                chat_listing = chat_data['data']['data']
                length = len(chat_listing)
                last_msg_id = chat_listing[length-1]['id']
                first_msg_id = chat_listing[0]['id']
                total = chat_data['data']['total']
                page = page
                page_size = page_size
            else:
                chat_listing = []
                total = 0
                page = page
                page_size = page_size
                last_msg_id = ''
                first_msg_id = ''

            context = {'chat_listing': chat_listing, 'total': total, "aws_url": settings.AWS_URL, 'sess_user_id': user_id}

            chat_listing_path = 'home/{}/user-dashboard/chat/message-history.html'.format(templete_dir)
            chat_listing_template = get_template(chat_listing_path)
            chat_listing_html = chat_listing_template.render(context)
            data = {'chat_listing_html': chat_listing_html, 'total': total, 'last_msg_id': last_msg_id, 'master_id': master_id, 'error': 0, "first_msg_id": first_msg_id}
        else:
            data = {'chat_listing_html': '', 'total': 0, 'last_msg_id': '', 'master_id': master_id, 'error': 1}

        return JsonResponse(data)
    except Exception as exp:
        print(exp)
        data = {'status': 403, 'suggestion_list': [], 'error': 1}
        return JsonResponse(data)

@csrf_exempt
def save_chat_message(request):
    try:
        if request.is_ajax() and request.method == 'POST':
            try:
                site_detail = subdomain_site_details(request)
                site_id = site_detail['site_detail']['site_id']
                templete_dir = site_detail['site_detail']['theme_directory']
            except Exception as exp:
                site_id = ""
                templete_dir = 'theme-1'

            static_dir = templete_dir
            user_id = None
            token = None
            page = 1
            page_size = 10
            chat_list = []
            if 'user_id' in request.session:
                user_id = request.session['user_id']
                token = request.session['token']['access_token']

            master_id = request.POST['master_id']
            message = request.POST['message']

            send_params = {
                "site_id": site_id,
                "user_id": user_id,
                "master_id": master_id,
                "message": message
            }
            new_api_url = settings.API_URL + '/api-contact/user-send-chat/'
            new_chat_data = call_api_post_method(send_params, new_api_url, token=token)

            if 'error' in new_chat_data and new_chat_data['error'] == 0:
                msg_data = new_chat_data['data'] if 'data' in new_chat_data and new_chat_data['data'] != "" else ""
                last_msg_id = msg_data['id']
                if msg_data:
                    chat_list.append(msg_data)
            else:
                chat_list = []
                last_msg_id = ''

            context = {'chat_listing': chat_list, 'total': 1, "aws_url": settings.AWS_URL, 'sess_user_id': user_id}

            chat_listing_path = 'home/{}/user-dashboard/chat/message-history.html'.format(templete_dir)
            chat_listing_template = get_template(chat_listing_path)
            chat_listing_html = chat_listing_template.render(context)

            data = {'chat_listing_html': chat_listing_html, 'total': 1, 'last_msg_id': last_msg_id, 'master_id': master_id, 'error': 0}


            # params = {
            #     "site_id": site_id,
            #     "user_id": user_id,
            #     "master_id": master_id,
            #     "page": page,
            #     "page_size": page_size,
            #     "last_msg_id": request.POST['last_msg_id']
            # }
            # api_url = settings.API_URL + '/api-contact/user-chat-listing/'
            # chat_data = call_api_post_method(params, api_url, token=token)
            #
            # if 'error' in chat_data and chat_data['error'] == 0:
            #     chat_listing = chat_data['data']['data']
            #     last_msg_id = chat_listing[0]['id']
            #     total = chat_data['data']['total']
            #     page = page
            #     page_size = page_size
            # else:
            #     chat_listing = []
            #     total = 0
            #     page = page
            #     page_size = page_size
            #     last_msg_id = ''
            #
            # context = {'chat_listing': chat_listing, 'total': total, "aws_url": settings.AWS_URL, 'sess_user_id': user_id}
            #
            # chat_listing_path = 'home/{}/chat/user-dashboard/message-history.html'.format(templete_dir)
            # chat_listing_template = get_template(chat_listing_path)
            # chat_listing_html = chat_listing_template.render(context)
            # data = {'chat_listing_html': chat_listing_html, 'total': total, 'last_msg_id': last_msg_id, 'master_id': master_id, 'error': 0}
        else:
            data = {'chat_listing_html': '', 'total': 0, 'last_msg_id': '', 'master_id': master_id, 'error': 1}

        return JsonResponse(data)
    except Exception as exp:
        print(exp)
        data = {'status': 403, 'suggestion_list': [], 'error': 1}
        return JsonResponse(data)