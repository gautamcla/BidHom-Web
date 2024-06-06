import requests
import datetime
from datetime import timedelta
from django.conf import settings
from django.shortcuts import redirect
from django.http import HttpResponseRedirect
from subdomain.services import call_api_get_method, call_api_post_method
class CheckSubdomainMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        try:
            response = self.get_response(request)
            # subdomain = request.META['HTTP_HOST']
            # subdomain = subdomain.split(".")[0]
            domain_name_url = request.META['HTTP_HOST']
            subdomain = domain_name_url + "/"

            if settings.SERVER_SETUP != "local":
                # api_url = settings.API_URL + '/api-users/check-subdomain/'
                api_url = settings.API_URL + '/api-users/new-check-subdomain/'
                payload = {
                    'domain_name': subdomain,
                }
                response_data = call_api_post_method(payload, api_url)
                if "error" in response_data and response_data['error'] == 0 and not response_data['data']['domain_name']:
                    return HttpResponseRedirect(settings.NOT_FOUND_REDIRECTION)
                request.session['site_id'] = response_data['data']['site_id']
            return response
        except Exception as exp:
            return HttpResponseRedirect(settings.NOT_FOUND_REDIRECTION)
class LoginMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        try:
            response = self.get_response(request)
            path = request.META['PATH_INFO'].split("/")[1]
            path = "dashboard" if path == "" else path
            if path != "" and path not in settings.ALLOW_URL and ("user_id" not in request.session or request.session['user_id'] <= 0):
                if request.get_full_path():
                    return HttpResponseRedirect("/login?next={}".format(request.get_full_path()))
                else:
                    return HttpResponseRedirect("/login")
            return response
        except Exception as exp:
            print(exp)
            http_host = request.META['HTTP_HOST']
            redirect_url = settings.URL_SCHEME + str(http_host)
            return HttpResponseRedirect(redirect_url)
# class LoginMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response
#     def __call__(self, request):
#         try:
#             response = self.get_response(request)
#             http_host = request.META['HTTP_HOST']
#             redirect_url = settings.URL_SCHEME + str(http_host)
#             path = request.META['PATH_INFO'].split("/")[1]
#             path = "dashboard" if path == "" else path
#             if path != "" and path not in settings.ALLOW_URL and ("user_id" not in request.session or request.session['user_id'] <= 0):
#                 return HttpResponseRedirect(redirect_url)
#             elif path == "login" and ("user_id" in request.session and request.session['user_id'] > 0):
#                 return HttpResponseRedirect(redirect_url)
#             elif path == "login" and ("user_id" not in request.session or request.session['user_id'] <= 0):
#                 callback_url = redirect_url + str("/login")
#                 return HttpResponseRedirect(settings.LOGIN_URL + "/?auth=" + callback_url)
#             return response
#         except Exception as exp:
#             http_host = request.META['HTTP_HOST']
#             redirect_url = settings.URL_SCHEME + str(http_host)
#             return HttpResponseRedirect(redirect_url)
class CheckAdminValidUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        try:
            response = self.get_response(request)
            http_host = request.META['HTTP_HOST']
            redirect_url = settings.URL_SCHEME + str(http_host)
            path = request.META['PATH_INFO'].split("/")
            is_admin_path = True if path[1].lower() == 'admin' else False
            if is_admin_path and "is_admin" not in request.session:
                return HttpResponseRedirect(redirect_url)
            elif is_admin_path and "is_admin" in request.session and not request.session['is_admin']:
                return HttpResponseRedirect(redirect_url)
            else:
                return response
        except Exception as exp:
            http_host = request.META['HTTP_HOST']
            redirect_url = settings.URL_SCHEME + str(http_host)
            return HttpResponseRedirect(redirect_url)
class AddNetworkUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        response = self.get_response(request)
        if "site_id" in request.session and "user_id" in request.session and request.session['site_id'] > 0 and request.session['user_id'] > 0:
            api_url = settings.API_URL + '/api-users/add-network-user/'
            payload = {
                'site_id': request.session['site_id'],
                'user_id': request.session['user_id'],
            }
            response_data = call_api_post_method(payload, api_url)
        return response
class CheckTokenValidityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        try:
            response = self.get_response(request)
            http_host = request.META['HTTP_HOST']
            redirect_url = settings.URL_SCHEME + str(http_host)
            current_time = datetime.datetime.now().timestamp() * 1000
            if 'user_id' in request.session and request.session['user_id'] > 0:
                expiry_time = request.session['token_expiry_time']
                if expiry_time < current_time:
                    try:
                        '''
                        checking session and expiring token forcefully
                        '''
                        api_url = settings.API_URL + '/api-users/revoke-token/'
                        payload = {
                            'user_id': request.session['user_id'],
                            'token': request.session['token']['access_token']
                        }
                        revoke_token_data = call_api_post_method(payload, api_url, request.session['token']['access_token'])
                        # flush only user relate sessions
                        del request.session['user_id']
                        del request.session['site_id']
                        del request.session['token']
                        del request.session['first_name']
                        del request.session['token_expiry_time']
                        request.session.modified = True
                        '''
                        checking session and expiring token forcefully end
                        '''
                        try:
                            auth = request.GET.get('auth', None)
                            if auth is not None:
                                return HttpResponseRedirect(settings.LOGIN_URL + "/login/?auth=" + auth)
                        except:
                            pass
                    except:
                        pass
                    return HttpResponseRedirect(redirect_url+"/logout")
            return response
        except Exception as exp:
            print(exp)


class CheckPlanMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
            check_admin = request.META['PATH_INFO']
            check_admin = check_admin.split("/")[1].lower()
            if check_admin == 'admin' and "site_id" in request.session and 'user_id' in request.session and request.session['site_id'] > 0 and request.session['user_id'] > 0:
                redirect_url = settings.URL_SCHEME + str(request.META['HTTP_HOST'])
                site_id = request.session['site_id']
                api_url = settings.API_URL + '/api-users/get-plan/'
                payload = {'domain': site_id}
                response_data = call_api_post_method(payload, api_url)
                path_info = request.META['PATH_INFO'].split('/admin/')[1]
                if path_info == "":
                    path_info = ""
                else:
                    path_info = path_info.split("/")[1]
                if "error" in response_data and response_data['error'] == 0 and response_data['data']['plan_id'] == 2 and response_data['data']['user_id'] == request.session['user_id'] and path_info != 'business-info' and path_info != 'create-checkout-session' and path_info != "":
                    return HttpResponseRedirect(redirect_url)
                elif "error" in response_data and response_data['error'] == 0 and response_data['data']['plan_id'] == 2 and response_data['data']['user_id'] != request.session['user_id']:
                    return HttpResponseRedirect(redirect_url)
                elif "error" in response_data and response_data['error'] == 0 and response_data['data']['plan_id'] == 3 and response_data['data']['user_id'] != request.session['user_id']:
                    return HttpResponseRedirect(redirect_url)
                elif "error" in response_data and response_data['error'] == 0 and response_data['data']['plan_id'] == 3 and response_data['data']['user_id'] == request.session['user_id'] and path_info == 'agents':
                    return HttpResponseRedirect(redirect_url)
            return response
        except Exception as exp:
            print(exp)
            return HttpResponseRedirect(settings.NOT_FOUND_REDIRECTION)


class CheckMaintenance:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            check_url = request.META['PATH_INFO']
            check_url = check_url.split("/")[1].lower()
            if int(settings.SERVER_ON_MAINTENANCE) and check_url != 'maintenance':
                return HttpResponseRedirect(settings.BASE_URL+"/maintenance/")
            elif not int(settings.SERVER_ON_MAINTENANCE) and check_url == 'maintenance':
                return HttpResponseRedirect(settings.BASE_URL)
            response = self.get_response(request)
            return response
        except Exception as exp:
            print(exp)
            return HttpResponseRedirect(settings.NOT_FOUND_REDIRECTION)


class CheckPayment:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
            is_server = settings.IS_SERVER
            if int(is_server) == 1:
                domain_name_url = request.META['HTTP_HOST']
            else:
                domain_name_url = settings.DOMAIN_NAME_URL
            domain_name = domain_name_url + "/"

            api_url = settings.API_URL + '/api-users/get-domain-user-detail/'
            payload = {'domain_name': domain_name}
            response_data = call_api_post_method(payload, api_url)
            response_data = response_data['data']
            check_url = request.META['PATH_INFO']
            check_url = check_url.split("/")[1].lower()
            redirect_url = settings.URL_SCHEME + str(request.META['HTTP_HOST'])
            if "site_id" in request.session and 'user_id' in request.session and request.session['site_id'] > 0 and request.session['user_id'] > 0:
                if "stripe_customer_id" in response_data and not response_data['stripe_customer_id'] and check_url == 'admin':
                    response = HttpResponseRedirect(redirect_url + "/demo/")
                elif "stripe_customer_id" in response_data and response_data['stripe_customer_id'] and check_url == 'demo':
                    response = HttpResponseRedirect(redirect_url + "/")
            return response
        except Exception as exp:
            print(exp)
            return HttpResponseRedirect(settings.NOT_FOUND_REDIRECTION)

class AjaxMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        def is_ajax(self):
            return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'
        
        request.is_ajax = is_ajax.__get__(request)
        response = self.get_response(request)
        return response