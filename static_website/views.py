# -*- coding: utf-8 -*-
"""This file contains general view functions for this module
"""
import datetime
from datetime import timedelta
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.http import HttpResponse
from django.conf import settings
from subdomain.constants import *
from packages.globalfunction import *
from django.views.decorators.csrf import csrf_exempt
from packages.context_processors import subdomain_site_details
from subdomain.services import call_api_get_method, call_api_post_method
from django.core.cache.backends.base import DEFAULT_TIMEOUT
CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)
from packages.constants import *


def home(request):
    """This function is used to home
    Page
    """
    try:
        journey = request.GET.get('journey', '')
        context = {
            'is_home_page': True,
            'aws_url': settings.AWS_URL,
            'title': "Bidhom - Home Page",
            'journey': journey
        }
        theme_path = 'static_website/front/home.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def our_listing(request):
    """This function is used to listing
    Page
    """
    try:
        context = {
            'is_home_page': False,
            'aws_url': settings.AWS_URL,
            'title': 'Theme - Listing Page'
        }
        theme_path = 'static_website/front/listing.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def our_listing_map(request):
    """This function is used to listing
    Page
    """
    try:
        context = {
            'is_home_page': False,
            'aws_url': settings.AWS_URL,
            'title': 'Theme - Listing Page'
        }
        theme_path = 'static_website/front/listing-map.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def asset_details(request):
    """This function is used to asset details
    Page
    """
    try:
        asset_type = request.GET.get('asset_type', None)

        if asset_type == 'highest':
            theme_path = 'static_website/front/highest-asset-detail.html'
            title = "Theme - Highest Asset Detail Page"
        elif asset_type == 'classic':
            theme_path = 'static_website/front/classic-asset-detail.html'
            title = "Theme - Theme - Classic Asset Detail Page"
        elif asset_type == 'traditional':
            theme_path = 'static_website/front/traditional-asset-detail.html'
            title = "Theme - Traditional Asset Detail Page"
        else:
            theme_path = 'static_website/front/classic-asset-detail.html'
            title = "Theme - Theme - Classic Asset Detail Page"
        context = {
            'is_home_page': False,
            'aws_url': settings.AWS_URL,
            'title': title
        }
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def contact_us(request):
    """This function is used to contact us
    Page
    """
    try:
        context = {
            'is_home_page': False,
            'aws_url': settings.AWS_URL,
            'title': 'Theme - Contact Page'
        }

        theme_path = 'static_website/front/contact.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def my_bids(request):
    """This function is used to my bids
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'Theme - My Bid Page',
            'active_menu': 'my_bid'
        }

        theme_path = 'static_website/user_dashboard/my-bids.html'
        return render(request, theme_path, context)
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def my_offers(request):
    """This function is used to my offers
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'Theme - My Offer Page',
            'active_menu': 'my_offers'
        }

        theme_path = 'static_website/user_dashboard/my-offers.html'
        return render(request, theme_path, context)
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def favourite_listings(request):
    """This function is used to my favourite listings
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'Theme - Favorite Listings Page',
            'active_menu': 'favourite_listings'

        }

        theme_path = 'static_website/user_dashboard/favorite-listing.html'
        return render(request, theme_path, context)
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def save_search(request):
    """This function is used to my save search
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'Theme - Save Search Page',
            'active_menu': 'save_search'
        }

        theme_path = 'static_website/user_dashboard/save-search.html'
        return render(request, theme_path, context)
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def edit_profile(request):
    """This function is used to my edit profile
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'Theme - Edit Profile Page',
            'active_menu': 'edit_profile'
        }

        theme_path = 'static_website/user_dashboard/edit-profile.html'
        return render(request, theme_path, context)
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def chat(request):
    """This function is used to my chat
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'Theme - Chat Page',
            'active_menu': 'chat'
        }

        theme_path = 'static_website/user_dashboard/chat.html'
        return render(request, theme_path, context)
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def best_offer(request):
    """This function is used to best offer
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'Theme - Best Offer Page',
            'active_menu': 'best_offer'
        }

        theme_path = 'static_website/user_dashboard/best-offer.html'
        return render(request, theme_path, context)
    except Exception as exp:
        print(exp)
        return HttpResponse("Issue in views")


def registration(request):
    """This function is used to registration
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'Theme - Best Offer Page',
            'active_menu': 'registration'
        }

        theme_path = 'static_website/front/registration.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def website(request):
    """This function is used to website
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'REBA - Website Page',
            'active_menu': ''
        }

        theme_path = 'static_website/admin_dashboard/website.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def dashboard(request):
    """This function is used to dashboard
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'REBA - Dashboard Page',
            'active_menu': ''
        }

        theme_path = 'static_website/admin_dashboard/dashboard.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def agents(request):
    """This function is used to agents
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'REBA - Create Agent Page',
            'active_menu': ''
        }

        theme_path = 'static_website/admin_dashboard/agent.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def add_agent(request):
    """This function is used to agent
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'REBA - Create Agent Page',
            'active_menu': ''
        }

        theme_path = 'static_website/admin_dashboard/add-agent.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def listing(request):
    """This function is used to listing
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'REBA - Listing Page',
            'active_menu': ''
        }

        theme_path = 'static_website/admin_dashboard/listing.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def admin_chat(request):
    """This function is used to admin chat
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'REBA - Chat Page',
            'active_menu': ''
        }

        theme_path = 'static_website/admin_dashboard/chat.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def auction_dashboard(request):
    """This function is used to auction dashboard
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'REBA - Insider Auction Dashboard Page',
            'active_menu': ''
        }

        theme_path = 'static_website/admin_dashboard/auction-dashboard.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def my_offer(request):
    """This function is used to my offer
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'REBA - My Offer Page',
            'active_menu': ''
        }

        theme_path = 'static_website/admin_dashboard/my-offer.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def offer_details(request):
    """This function is used to offer details
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'REBA - My Offer Page',
            'active_menu': ''
        }

        theme_path = 'static_website/admin_dashboard/my-offer-details.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def property_estimator_list(request):
    """This function is used to property estimator list
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'REBA - Property Estimator Page',
            'active_menu': ''
        }

        theme_path = 'static_website/admin_dashboard/property-estimator.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def property_estimator_details(request):
    """This function is used to property estimator details
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'REBA - Property Estimator Page',
            'active_menu': ''
        }

        theme_path = 'static_website/admin_dashboard/property-estimator-detail.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def bidder_registration(request):
    """This function is used to bidder registration
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'REBA - Bidder Registration Page',
            'active_menu': ''
        }

        theme_path = 'static_website/admin_dashboard/bidder-registration-new.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def bidder_registration_details(request):
    """This function is used to bidder registration details
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'REBA - Bidder Registration Page',
            'active_menu': ''
        }

        theme_path = 'static_website/admin_dashboard/bidder-registration-edit.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def listing_property_info(request):
    """This function is used to listing property info
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'REBA - Add listing Page',
            'active_menu': ''
        }

        theme_path = 'static_website/admin_dashboard/add-listing.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def property_map_view(request):
    """This function is used to property map view
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'REBA - Add listing 2 Page',
            'active_menu': ''
        }

        theme_path = 'static_website/admin_dashboard/add-listing-2.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def property_photo_video(request):
    """This function is used to property photo video
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'REBA - Add listing 3 Page',
            'active_menu': ''
        }

        theme_path = 'static_website/admin_dashboard/add-listing-3.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


def property_document(request):
    """This function is used to property document
    Page
    """
    try:
        context = {
            'aws_url': settings.AWS_URL,
            'title': 'REBA - Add listing 4 Page',
            'active_menu': ''
        }

        theme_path = 'static_website/admin_dashboard/add-listing-4.html'
        return render(request, theme_path, context)
    except Exception as exp:
        return HttpResponse("Issue in views")


@csrf_exempt
def set_tour_session(request):
    """This function is used to set tour session
    Page
    """
    try:
        if request.is_ajax() and request.method == 'POST':
            request.session['demo_tour'] = 1
            data = {'status': 200, 'error': 0, "msg": "success"}
        else:
            data = {'status': 403, 'error': 1, "msg": "Forbidden"}
        return JsonResponse(data)
    except Exception as exp:
        print(exp)
        data = {'status': 403, 'error': 1, 'msg': 'invalid request.'}
        return JsonResponse(data)


@csrf_exempt
def close_tour(request):
    try:
        if request.is_ajax() and request.method == 'POST':
            request.session['demo_tour'] = 0
            data = {'status': 200, "error": 0, "msg": "success"}
        else:
            data = {'status': 403, 'error': 1, "msg": "Forbidden"}
        return JsonResponse(data)
    except Exception as exp:
        data = {'status': 403, 'error': 1, 'msg': 'invalid request.'}
        return JsonResponse(data)


@csrf_exempt
def payment(request):
    try:
        if request.is_ajax() and request.method == 'POST':
            show_active_plan = 0
            if request.session['is_broker'] and request.session['is_free_plan']:
                show_active_plan = 1

            site_detail = subdomain_site_details(request)
            site_id = site_detail['site_detail']['site_id']
            user_id = request.session['user_id']
            token = request.session['token']['access_token']
            # ---------------------Save Payment Detail Data------------------
            plan_price_id = int(site_detail['site_detail']['current_plan_price_id'])
            theme_id = int(site_detail['site_detail']['current_theme_id'])
            api_url = settings.API_URL + "/api-payments/create-payment-detail/"
            params = {
                "domain_id": site_id,
                "user_id": user_id,
                "plan_price_id": plan_price_id,
                "theme_id": theme_id
            }
            api_response = call_api_post_method(params, api_url, token)
            if 'error' in api_response and api_response['error'] == 0:
                # -------------Stripe Payment Credentials-------------
                api_url = settings.API_URL + "/api-payments/stripe-payment-detail/"
                params = {
                    "plan_price_id": plan_price_id,
                }
                api_response = call_api_post_method(params, api_url, token)
                if 'error' in api_response and api_response['error'] == 0:
                    data = api_response['data']
                    data = {"data": data, "email": request.session['email'], "show_active_plan": show_active_plan, 'status': 200, "error": 0, "msg": "success"}
                else:
                    data = {'data': "", 'status': 403, 'error': 1, "msg": api_response['msg']}
            else:
                data = {'data': "", 'status': 403, 'error': 1, "msg": api_response['msg']}

        else:
            data = {'data': "", 'status': 403, 'error': 1, "msg": "Forbidden"}
        return JsonResponse(data)
    except Exception as exp:
        print(exp)
        data = {'data': "", 'status': 403, 'error': 1, 'msg': 'invalid request.'}
        return JsonResponse(data)


@csrf_exempt
def check_payment(request):
    try:
        if request.is_ajax() and request.method == 'POST':
            site_detail = subdomain_site_details(request)
            site_id = site_detail['site_detail']['site_id']
            user_id = request.session['user_id']
            token = request.session['token']['access_token']

            # api_url = settings.API_URL + "/api-payments/check-payment-success/"
            api_url = settings.API_URL + "/api-payments/check-payment-subscription/"
            params = {
                "domain_id": site_id,
                "user_id": user_id,
            }
            api_response = call_api_post_method(params, api_url, token)
            if 'error' in api_response and api_response['error'] == 0:
                request.session['is_free_plan'] = False
                data = {"data": "", "error": 0, "msg": api_response['msg']}
            else:
                data = {'data': "", 'error': 1, "msg": api_response['msg']}

        else:
            data = {'data': "", 'error': 1, "msg": "Forbidden"}
        return JsonResponse(data)
    except Exception as exp:
        data = {'data': '', 'status': 403, 'error': 1, 'msg': 'invalid request.'}
        return JsonResponse(data)