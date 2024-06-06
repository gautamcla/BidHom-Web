from django.conf import settings
from subdomain.constants import settings_data
from subdomain.services import call_api_get_method, call_api_post_method
import json

def user_settings(request):
    try:
        pass
    except:
        pass

def subdomain_admin_settings(request):
    try:
        token = request.session['token']['access_token']
        user_id = request.session['user_id']
        settings_value = settings_data(request, token, user_id)
        access_permission_list = []
        try:
            for perm in settings_value['permission']:
                access_permission_list.append(int(perm['permission_id']))
        except Exception as exp:
            access_permission_list = []

        try:
            is_free = settings_value['is_free']
        except Exception as exp:
            is_free = False
        return {'settings_data': settings_value, 'access_permission_list': access_permission_list, 'is_free_plan': is_free}
    except Exception as exp:
        print(exp)
        return {'settings_data': {}}


def site_url(request):
    http_host = request.META['HTTP_HOST']
    redirect_url = settings.URL_SCHEME + str(http_host)
    return {'SITE_URL': redirect_url}

def aws_url(request):
    http_host = request.META['HTTP_HOST']
    aws_url = settings.AWS_URL
    return {'aws_url': aws_url}

def subdomain_site_details(request):
    try:
        try:
            # try:
            #     is_server = settings.IS_SERVER
            #     if int(is_server) == 1:
            #         domain_name_url = request.META['HTTP_HOST'].split('.')[0]
            #     else:
            #         domain_name_url = settings.DOMAIN_NAME_URL.split('.')[0]
            # except Exception as exp:
            #     domain_name_url = request.META['HTTP_HOST'].split('.')[0]
            #
            # domain_name = domain_name_url.replace('https://', '')
            try:
                is_server = settings.IS_SERVER
                if int(is_server) == 1:
                    domain_name_url = request.META['HTTP_HOST']
                else:
                    domain_name_url = settings.DOMAIN_NAME_URL
            except Exception as exp:
                domain_name_url = request.META['HTTP_HOST']
            domain_name = domain_name_url+"/"
            setting_param = {'domain_name': domain_name}
            # setting_url = settings.API_URL + '/api-users/get-site-detail/'
            setting_url = settings.API_URL + '/api-users/new-get-site-detail/'
            site_details_data = call_api_post_method(setting_param, setting_url)
            # print(site_details_data)
            site_details = site_details_data['data']
            try:
                dom_name = site_details['data']['domain_name']
            except:
                dom_name = ''

            try:
                company_name = site_details['data']['business_detail']['company_name']
            except:
                company_name = ''

            try:
                company_email = site_details['data']['business_detail']['email']
            except:
                company_email = ''

            try:
                licence_no = site_details['data']['business_detail']['licence_no']
            except:
                licence_no = ''

            try:
                phone_no = site_details['data']['business_detail']['phone_no']
            except:
                phone_no = ''

            try:
                footer_images = site_details['data']['footer_images']
            except:
                footer_images = []

            try:
                website_title = site_details['data']['custom_site_settings']['website_title']
            except:
                website_title = ''

            try:
                website_logo = site_details['data']['custom_site_settings']['website_logo']
            except:
                website_logo = ''

            try:
                favicon = site_details['data']['custom_site_settings']['favicon']
            except:
                favicon = ''

            try:
                website_name = site_details['data']['custom_site_settings']['website_name']
            except:
                website_name = ''

            try:
                theme_directory = site_details['data']['theme_folder']
            except:
                theme_directory = 'theme-1'

            try:
                current_theme_id = site_details['data']['theme']
            except:
                current_theme_id = 7

            try:
                plan_price_id = site_details['data']['plan_price_id']
            except:
                plan_price_id = ""

            try:
                previous_plan_price_id = site_details['data']['previous_plan_price_id']
            except:
                previous_plan_price_id = ""

            try:
                email_verified = site_details['data']['email_verified']
            except:
                email_verified = ""

            google_map_key = settings.GOOGLE_MAP_KEY
            request.session['google_map_key'] = google_map_key 

            data = {
                'site_id': site_details['data']['site_id'],
                'domain_name': dom_name,
                'company_name': company_name,
                'company_email': company_email,
                'licence_no': licence_no,
                'phone': phone_no,
                'footer_images': footer_images,
                'website_title': website_title,
                'website_logo': website_logo,
                'favicon': favicon,
                'website_name': website_name,
                'theme': site_details['data']['theme'],
                'theme_directory': theme_directory,
                'template_directory': theme_directory,
                'current_theme_id': current_theme_id,
                'current_plan_price_id': plan_price_id,
                'previous_plan_price_id': previous_plan_price_id,
                'email_verified': email_verified,
                'google_map_key': google_map_key
            }
            for addr in site_details['data']['business_detail']['address']:
                address_first = addr['address_first'] if 'address_first' in addr and addr['address_first'] is not None else ""
                postal_code = addr['postal_code'] if 'postal_code' in addr and addr['postal_code'] is not None else ""
                state_name = addr['state'] if 'state' in addr and addr['state'] is not None else ""
                site_address = address_first
                if state_name:
                    site_address = site_address+', '+state_name
                if postal_code:
                    site_address = site_address+', '+postal_code
                addr['site_address'] = site_address

            data['business_address'] = site_details['data']['business_detail']['address']
            # address_first = site_details['data']['business_detail']['address_first'] if site_details['data']['business_detail']['address_first'] is not None else ""
            # postal_code = site_details['data']['business_detail']['postal_code'] if site_details['data']['business_detail']['postal_code'] is not None else ""
            # state_name = site_details['data']['business_detail']['state_name'] if 'state_name' in site_details['data']['business_detail'] and  site_details['data']['business_detail']['state_name'] is not None else ""
            # site_address = address_first
            # if state_name:
            #     site_address = site_address+', '+state_name
            # if postal_code:
            #     site_address = site_address+', '+postal_code
            # data['site_address'] = site_address

            site_detail = data
        except Exception as exp:
            print(exp)
            site_detail = {}
        # print(site_detail)
        return {'site_detail': site_detail}
    except:
        return {'site_detail': {}}

def user_personal_info(request):
    try:
        try:
            user_id = request.session['user_id']
            token = request.session['token']['access_token']
            param = {
                'user_id': user_id
            }
            url = settings.API_URL + '/api-users/get-business-info/'
            user_personal_info_data = call_api_post_method(param, url, token)
            user_personal_info = user_personal_info_data['data']
        except:
            user_personal_info = {}
        return {'user_personal_info': user_personal_info}
    except Exception as exp:
        return {'user_personal_info': {}}

def node_url(request):
    return {'NODE_URL': settings.NODE_URL}

