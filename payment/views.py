from django.shortcuts import render
from django.http.response import HttpResponseNotFound, JsonResponse
from django.shortcuts import get_object_or_404, render
from django.urls import reverse, reverse_lazy
from django.views.generic import ListView, CreateView, DetailView, TemplateView
import stripe
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import HttpResponse
from subdomain.services import call_api_get_method, call_api_post_method
from packages.context_processors import subdomain_site_details
from django.shortcuts import redirect
import re

# Create your views here.


@csrf_exempt
def create_checkout_session_old(request, id):
    try:
        token = request.session['token']['access_token']
        user_id = request.session['user_id']
        site_detail = subdomain_site_details(request)
        site_id = site_detail['site_detail']['site_id']
        params = {"plan_pricing_id": id, "user_id": user_id, "domain_id": site_id}
        api_url = settings.API_URL + '/api-payments/payment-subscription-detail/'
        api_response = call_api_post_method(params, api_url, token)
        if 'error' in api_response and api_response['error'] == 0:
            api_data = api_response['data']
            request_data = json.loads(request.body)
            stripe.api_key = settings.STRIPE_SECRET_KEY
            checkout_session = stripe.checkout.Session.create(
                mode="subscription",
                subscription_data={
                    # 'trial_end': 1605387163
                    "trial_settings": {"end_behavior": {"missing_payment_method": "cancel"}},
                    "trial_period_days": 30,
                },
                client_reference_id=user_id,
                # customer_email=request_data['email'],
                customer_email=api_data['email'],
                payment_method_types=['card'],
                # phone_number_collection={
                #     'enabled': True,
                # },
                # line_items=[
                #     {
                #         'price_data': {
                #             'currency': 'inr',
                #             'product_data': {
                #                 'name': api_data['subscription']['subscription_name'],
                #             },
                #             'unit_amount': int(api_data['subscription']['cost'])*100,
                #         },
                #         'quantity': 1,
                #     }
                # ],
                line_items=[
                    {
                        "price": "price_1MwJ6QSAnhL0wO1t76NH4HIH",
                        "quantity": 1,
                    }
                ],
                metadata={
                    "plan_price_id": id,  # Got this data at the time of success
                },
                # mode='payment',
                success_url=request.build_absolute_uri(reverse('success')) + "?session_id={CHECKOUT_SESSION_ID}",
                cancel_url=request.build_absolute_uri(reverse('failed')),
            )
            params = {
                "domain_id": site_id,
                "user_id": user_id,
                "plan_price_id": id,
                "amount": int(checkout_session.amount_total/100),
                "stripe_session": checkout_session.id,
                "theme_id": request_data['theme_id']
            }
            api_url = settings.API_URL + '/api-payments/create-order/'
            api_response = call_api_post_method(params, api_url, token)
            if 'error' in api_response and api_response['error'] == 0:
                return JsonResponse({"sessionId": checkout_session.id, "error": 0, "msg": ""})
            else:
                return JsonResponse({'sessionId': "", 'error': 1, "msg": api_response['msg']})
        else:
            return JsonResponse({'sessionId': "", 'error': 1, "msg": api_response['msg']})
    except Exception as exp:
        return JsonResponse({'sessionId': "", 'error': 1, "msg": str(exp)})


@csrf_exempt
def create_checkout_session(request, id):
    try:
        token = request.session['token']['access_token']
        user_id = request.session['user_id']
        site_detail = subdomain_site_details(request)
        site_id = site_detail['site_detail']['site_id']
        params = {"plan_pricing_id": id, "user_id": user_id, "domain_id": site_id}
        api_url = settings.API_URL + '/api-payments/payment-subscription-detail/'
        api_response = call_api_post_method(params, api_url, token)
        if 'error' in api_response and api_response['error'] == 0:
            api_data = api_response['data']
            request_data = json.loads(request.body)
            stripe.api_key = settings.STRIPE_SECRET_KEY
            checkout_session = stripe.checkout.Session.create(
                # customer_email=request_data['email'],
                customer_email=api_data['email'],
                payment_method_types=['card'],
                # phone_number_collection={
                #     'enabled': True,
                # },
                line_items=[
                    {
                        'price_data': {
                            'currency': 'inr',
                            'product_data': {
                                'name': api_data['subscription']['subscription_name'],
                            },
                            'unit_amount': int(api_data['subscription']['cost'])*100,
                        },
                        'quantity': 1,
                    }
                ],
                metadata={
                    "plan_price_id": id,  # Got this data at the time of success
                },
                mode='payment',
                success_url=request.build_absolute_uri(reverse('success')) + "?session_id={CHECKOUT_SESSION_ID}",
                cancel_url=request.build_absolute_uri(reverse('failed')),
            )
            params = {
                "domain_id": site_id,
                "user_id": user_id,
                "plan_price_id": id,
                "amount": int(checkout_session.amount_total/100),
                "stripe_session": checkout_session.id,
                "theme_id": request_data['theme_id']
            }
            api_url = settings.API_URL + '/api-payments/create-order/'
            api_response = call_api_post_method(params, api_url, token)
            if 'error' in api_response and api_response['error'] == 0:
                return JsonResponse({"sessionId": checkout_session.id, "error": 0, "msg": ""})
            else:
                return JsonResponse({'sessionId': "", 'error': 1, "msg": api_response['msg']})
        else:
            return JsonResponse({'sessionId': "", 'error': 1, "msg": api_response['msg']})
    except Exception as exp:
        return JsonResponse({'sessionId': "", 'error': 1, "msg": str(exp)})


class PaymentSuccessView(TemplateView):
    template_name = "admin/payment/payment_success.html"

    def get(self, request, *args, **kwargs):
        session_id = request.GET.get('session_id')
        if session_id is None:
            return HttpResponseNotFound()

        stripe.api_key = settings.STRIPE_SECRET_KEY
        session = stripe.checkout.Session.retrieve(session_id)
        payment_intent = session.payment_intent

        params_data = {
            'payment_intent': payment_intent
        }
        url = settings.API_URL + '/api-payments/success-payment-detail/'
        print(params_data)
        api_response = call_api_post_method(params_data, url)
        print(api_response)
        if 'error' in api_response and api_response['error'] == 0:
            success_data = api_response['data']
        else:
            success_data = {}
        return render(request, self.template_name, context=success_data)


class SuccessPaymentView(TemplateView):
    template_name = "admin/payment/new_payment_success.html"

    def get(self, request):
        # session_id = request.GET.get('session_id')
        # if session_id is None:
        #     return HttpResponseNotFound()
        site_detail = subdomain_site_details(request)
        site_id = site_detail['site_detail']['site_id']
        user_id = request.session['user_id']
        token = request.session['token']['access_token']
        api_url = settings.API_URL + "/api-payments/check-payment-success/"
        params = {
            "domain_id": site_id,
            "user_id": user_id,
        }
        api_response = call_api_post_method(params, api_url, token)
        print(api_response)
        if 'error' in api_response and api_response['error'] == 0:
            cost = api_response['data']['cost']
        else:
            cost = 0

        success_data = {"cost": cost}
        return render(request, self.template_name, context=success_data)


class PaymentFailedView(TemplateView):
    template_name = "admin/payment/payment_failed.html"


@csrf_exempt
def webhook_old(request):
    try:
        payload = request.body
        new_event = None
        params = {}
        try:
            new_event = stripe.Event.construct_from(json.loads(payload), stripe.api_key)
        except ValueError as e:
            # Invalid payload
            return HttpResponse(status=400)

        # Handle the event
        if new_event.type == 'payment_intent.succeeded':
            payment_intent = new_event.data.object  # contains a stripe.PaymentIntent

        elif new_event.type == 'checkout.session.completed':
            all_data = new_event.data.object
            stripe.api_key = settings.STRIPE_SECRET_KEY
            payment_intent = stripe.PaymentIntent.retrieve(all_data['payment_intent'])
            params['card_last_four'] = payment_intent['charges']['data'][0]['payment_method_details']['card']['last4']
            params['card_network'] = payment_intent['charges']['data'][0]['payment_method_details']['card']['network']
            params['card_exp_month'] = payment_intent['charges']['data'][0]['payment_method_details']['card']['exp_month']
            params['card_exp_year'] = payment_intent['charges']['data'][0]['payment_method_details']['card']['exp_year']
            params['amount_paid'] = int(payment_intent['amount_received']/100)
            params['stripe_payment_intent'] = payment_intent['id']
            params['stripe_receipt_url'] = payment_intent['charges']['data'][0]['receipt_url']
            params['stripe_session'] = all_data['id']
            # --------------------Call payment success method to update related table-----------
            payment_success(params)

        return HttpResponse(status=200)
    except Exception as exp:
        print(exp)


def payment_success_old(params):
    try:
        api_url = settings.API_URL + '/api-payments/order-success/'
        api_response = call_api_post_method(params, api_url)
        if 'error' in api_response and api_response['error'] == 0:
            data = api_response['data']
            params_data = {
                'site_id': data['domain_id'],
                'user_id': data['user_id'],
                'opted_plan': data['plan_price_id'],
                'theme_id': data['theme_id'],
                'order_id': data['order_id'],
            }
            url = settings.API_URL + '/api-payments/after-payment-change-plan/'
            api_response = call_api_post_method(params_data, url)
            if 'error' in api_response and api_response['error'] != 0:
                return False
        else:
            return True
        return True
    except Exception as exp:
        print(exp)
        return False


@csrf_exempt
def webhook(request):
    try:
        payload = request.body
        new_event = None
        params = {}
        try:
            new_event = stripe.Event.construct_from(json.loads(payload), stripe.api_key)
        except ValueError as e:
            # Invalid payload
            return HttpResponse(status=400)
        site_detail = subdomain_site_details(request)
        site_id = site_detail['site_detail']['site_id']
        # Handle the event
        if new_event.type == 'payment_intent.succeeded':
            payment_intent = new_event.data.object  # contains a stripe.PaymentIntent
        elif new_event.type == 'checkout.session.completed':
            all_data = new_event.data.object
            stripe.api_key = settings.STRIPE_SECRET_KEY
            user_subscription = stripe.Subscription.retrieve(all_data['subscription'])
            params['stripe_customer_id'] = all_data['customer']
            params['stripe_subscription_id'] = all_data['subscription']
            params['email'] = all_data['customer_details']['email']
            params['amount'] = user_subscription['items']['data'][0]['price']['unit_amount'] / 100
            params['stripe_price_id'] = user_subscription['plan']['id']
            params['domain_id'] = site_id
            # print(params)
            # --------------------Call payment success method to update related table-----------
            payment_success(params)
        return HttpResponse(status=200)
    except Exception as exp:
        print(exp)


def payment_success(params):
    try:
        api_url = settings.API_URL + '/api-payments/check-payment/'
        api_response = call_api_post_method(params, api_url)
        if 'error' in api_response and api_response['error'] == 0:
            data = api_response['data']
            params_data = {
                'site_id': data['domain_id'],
                'user_id': data['user_id'],
                'opted_plan': data['plan_price_id'],
                'theme_id': data['theme_id'],
            }
            url = settings.API_URL + '/api-payments/plan-upgrade-after-payment/'
            api_response = call_api_post_method(params_data, url)
            if 'error' in api_response and api_response['error'] != 0:
                return False
        else:
            return True
        return True
    except Exception as exp:
        print(exp)
        return False
    

def registration_create_checkout_session(request, listing_id):
    try:
        token = request.session['token']['access_token']
        user_id = request.session['user_id']
        site_detail = subdomain_site_details(request)
        site_id = site_detail['site_detail']['site_id']
        params = {"user_id": user_id, "listing_id": listing_id, "domain_id": site_id}
        api_url = settings.API_URL + '/api-payments/payment-listing-deposit-detail/'
        api_response = call_api_post_method(params, api_url, token)
        if 'error' in api_response and api_response['error'] == 0:
            api_data = api_response['data']
            # request_data = json.loads(request.body)
            stripe.api_key = settings.STRIPE_SECRET_KEY
            checkout_session = stripe.checkout.Session.create(
                customer_email=api_data['email'],
                payment_method_types=['card'],
                # phone_number_collection={
                #     'enabled': True,
                # },
                line_items=[
                    {
                        'price_data': {
                            'currency': 'inr',
                            'product_data': {
                                # 'name': "Propert Listing-"+ str(api_data['listing_deposit']['id']),
                                'name': "Property Deposit Amount",
                            },
                            'unit_amount': int(float(api_data['listing_deposit']['deposit_amount']))*100,
                            # 'unit_amount': 1000*100,
                        },
                        'quantity': 1,
                    }
                ],
                metadata={
                    "listing_id": api_data['listing_deposit']['id'],  # Got this data at the time of success
                    "user_email": api_data['email'],  # Got this data at the time of success
                },
                mode='payment',
                success_url=request.build_absolute_uri(reverse('bid-deposit-success')) + "?session_id={CHECKOUT_SESSION_ID}",
                cancel_url=request.build_absolute_uri(reverse('bid-deposit-cancel')),
            )
            # --------------------------------Bid Registration Here----------------------------
            data = {}
            if request.is_ajax() and request.method == 'POST':
                site_detail = subdomain_site_details(request)
                site_id = site_detail['site_detail']['site_id']

                phone_no = ''
                if 'phone' in request.POST and request.POST['phone'] != "":
                    phone_no = re.sub('\D', '', request.POST['phone'])

                agent_buyer_phone_no = ''
                if 'agent_buyer_phone' in request.POST and request.POST['agent_buyer_phone'] != "":
                    agent_buyer_phone_no = re.sub('\D', '', request.POST['agent_buyer_phone'])

                email = request.POST['email']



                # bidder_doc = []
                # if 'is_submit_proof_fund' in request.POST and int(request.POST['is_submit_proof_fund']) == 1:
                #     bidder_doc_id = request.POST['bidder_doc_id']
                #     try:
                #         bidder_doc = bidder_doc_id.split(',')

                #     except:
                #         bidder_doc = []


                addresses = {
                    "first_name": request.POST['first_name'],
                    "last_name": request.POST['last_name'],
                    "email": request.POST['email'],
                    "phone_no": phone_no,
                    "address_first": request.POST['address'],
                    "city": request.POST['city'],
                    "state": request.POST['state'],
                    "postal_code": request.POST['bidder_zip_code'],
                    "country": request.POST['buyer_country']
                }
                x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
                if x_forwarded_for:
                    ip = x_forwarded_for.split(',')[0]
                else:
                    ip = request.META.get('REMOTE_ADDR')

                bidder_params = {
                    "domain": site_id,
                    "user": user_id,
                    "property_id": request.POST['property_id'],
                    "user_type": request.POST['user_type'],
                    "term_accepted": request.POST['term_accepted'],
                    "age_accepted": request.POST['age_validate'],
                    # "uploads": bidder_doc,
                    # "ip_address": request.META.get("REMOTE_ADDR")
                    "ip_address": ip
                }
                
                # if bidder_doc:
                #     bidder_params['upload_pof'] = 1
                # else:
                #     bidder_params['upload_pof'] = 0
                #     bidder_params['reason_for_not_upload'] = request.POST['doc_reason']

                if 'user_type' in request.POST and int(request.POST['user_type']) == 2:
                    try:
                        bidder_params['working_with_agent'] = request.POST['working_with_agent']
                    except:
                        bidder_params['working_with_agent'] = 0

                if 'user_type' in request.POST and int(request.POST['user_type']) == 4:

                    try:
                        bidder_params['property_yourself'] = request.POST['working_with_agent']
                    except:
                        bidder_params['property_yourself'] = 0

                if 'user_type' in request.POST and int(request.POST['user_type']) == 2 and 'working_with_agent' in request.POST and int(request.POST['working_with_agent']) == 1:
                    agent_buyer_addresses = {
                        "first_name": request.POST['agent_buyer_first_name'],
                        "last_name": request.POST['agent_buyer_last_name'],
                        "email": request.POST['agent_buyer_email'],
                        "phone_no": agent_buyer_phone_no,
                        "address_first": request.POST['agent_buyer_address'],
                        "state": request.POST['agent_buyer_state'],
                        "city": request.POST['agent_buyer_city'],
                        "postal_code": request.POST['agent_buyer_zipcode'],
                        "company_name": request.POST['agent_buyer_company_name'],
                        "country": request.POST['agent_buyer_country']
                    }
                    bidder_params['agent_address'] = agent_buyer_addresses
                    bidder_params['buyer_address'] = addresses
                elif 'user_type' in request.POST and int(request.POST['user_type']) == 2 and 'working_with_agent' in request.POST and int(request.POST['working_with_agent']) == 0:
                    bidder_params['buyer_address'] = addresses
                elif 'user_type' in request.POST and int(request.POST['user_type']) == 4 and 'working_with_agent' in request.POST and int(request.POST['working_with_agent']) == 1:
                    agent_buyer_addresses = {
                        "first_name": request.POST['agent_buyer_first_name'],
                        "last_name": request.POST['agent_buyer_last_name'],
                        "email": request.POST['agent_buyer_email'],
                        "phone_no": agent_buyer_phone_no,
                        "address_first": request.POST['agent_buyer_address'],
                        "state": request.POST['agent_buyer_state'],
                        "city": request.POST['city'],
                        "postal_code": request.POST['agent_buyer_zipcode'],
                        "country": request.POST['agent_buyer_country']
                    }
                    addresses['company_name'] = request.POST['bidder_company_name']
                    bidder_params['agent_address'] = addresses
                    bidder_params['buyer_address'] = agent_buyer_addresses

                elif 'user_type' in request.POST and int(request.POST['user_type']) == 4 and 'working_with_agent' in request.POST and int(request.POST['working_with_agent']) == 0:

                    addresses['company_name'] = request.POST['bidder_company_name']
                    bidder_params['buyer_seller_address'] = addresses
                asset_type = request.POST['asset_type']
                
                bidder_api_url = settings.API_URL + '/api-bid/deposit-bid-registration/'
                bidder_params['session_id'] = checkout_session.id
                bidder_params['deposit_amount'] = api_data['listing_deposit']['deposit_amount']
                save_data = call_api_post_method(bidder_params, bidder_api_url, token=token)
                if 'error' in save_data and save_data['error'] == 0:
                    try:
                        reg_id = save_data['data']['registration_id']
                    except:
                        reg_id = ''
                    data = {'status': 200, 'msg': save_data['msg'], 'error': 0, 'data': save_data, 'reg_id': reg_id}
                else:
                     data = {'status': 403, 'msg': save_data['msg'], 'error': 1, 'data': "", 'reg_id': ""}   
            else:
                data = {'status': 403, 'msg': save_data['msg'], 'error': 1, 'data': save_data, 'reg_id': ''}

            # ---------------------------------------------------------------------------------
            data['sessionId'] = checkout_session.id
            data['url'] = checkout_session.url
            return JsonResponse(data)
            # return JsonResponse({"sessionId": checkout_session.id, "url": checkout_session.url, "error": 0, "msg": ""})
        else:
            return JsonResponse({'sessionId': "", "url": "", 'error': 1, "msg": api_response['msg']})
    except Exception as exp:
        return JsonResponse({'sessionId': "","url": "", 'error': 1, "msg": str(exp)})  







