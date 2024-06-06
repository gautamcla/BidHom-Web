# -*- coding: utf-8 -*-
from django.urls import path
from . import views

urlpatterns = [
        #  theme management
        path('available-themes/', views.available_themes, name="admin-themes"),
        path('active-inactive-theme/', views.active_inactive_theme, name="admin-theme-status-change"),

        # lookup object management
        path('lookup-objects/', views.lookup_objects, name="admin-lookup-objects"),   
        path('active-inactive-object/', views.active_inactive_object, name="admin-object-status-change"), 

        #  lookup status management
        path('lookup-status/', views.lookup_status, name="admin-lookup-status"),
        path('active-inactive-status/', views.active_inactive_status, name="admin-lookup-status-change"),

        #  lookup object status management
        path('lookup-object-status/', views.lookup_object_status, name="admin-lookup-object-status"),
        path('ajax-lookup-object-status/', views.ajax_lookup_object_status, name="akax-admin-lookup-object-status"),
        path('active-inactive-object-status/', views.active_inactive_object_status, name="admin-lookup-object-status-change"), 
       
        #  plan type management
        path('plan-types/', views.plans, name="admin-plan"),
        path('active-inactive-plan/', views.active_inactive_plan, name="admin-plan-status-change"),

        # subscription management
        path('subscriptions/', views.subscriptions, name="admin-subscription"),
        path('active-inactive-subscription/', views.active_inactive_subscription, name="admin-subscriptions-status-change"),
        
        #  lookup object status management
        path('plan-pricing/', views.plan_pricing, name="admin-plan-pricing"),
        path('active-inactive-plan-pricing/', views.active_inactive_plan_pricing, name="admin-plan-pricing-change"),

        # user type management
        path('user-types/', views.user_type, name="admin-user-type"),   
        path('active-inactive-user-type/', views.active_inactive_user_type, name="admin-user-type-status-change"),

        # user type management
        path('permissions/', views.user_permissions, name="admin-user-permissions"),   
        path('active-inactive-user-permission/', views.active_inactive_user_permission, name="admin-user-permission-status-change"),

        # property type management
        # path('property-types/', views.property_type, name="admin-property-type"),   
        # path('active-inactive-property-type/', views.active_inactive_property_type, name="admin-property-type-status-change"),

        #  auction type management 
        path('auction-types/', views.auction_type, name="admin-auction-type"),   
        path('active-inactive-auction-type/', views.active_inactive_auction_type, name="admin-auction-type-status-change"), 

        # document type management
        path('document-types/', views.document_type, name="admin-document-type"),   
        path('active-inactive-document-type/', views.active_inactive_document_type, name="admin-document-type-status-change"), 

        # blog categories management
        path('blog-categories/', views.blog_category, name="admin-blog-categories"),   
        # path('active-inactive-blog-category/', views.active_inactive_blog_category, name="admin-blog-categories-status-change"), 

        # address type management
        path('address-types/', views.address_type, name="admin-address-type"),   
        path('active-inactive-address-type/', views.active_inactive_address_type, name="admin-address-type-status-change"), 

        # event type management
        path('event-types/', views.event_type, name="admin-event-type"),   
        path('active-inactive-event-type/', views.active_inactive_event_type, name="admin-event-type-status-change"),

        # upload steps management
        path('upload-steps/', views.upload_step, name="admin-upload-step"),   
        path('active-inactive-upload-step/', views.active_inactive_upload_step, name="admin-upload-step-status-change"), 

        # site settings management
        path('site-settings/', views.site_setting, name="admin-site-setting"),   
        path('active-inactive-site-settings/', views.active_inactive_site_setting, name="admin-site-setting-status-change"), 

        # time zone management
        path('time-zones/', views.time_zones, name="admin-time-zones"), 
        path('ajax-time-zones/', views.ajax_time_zone, name="ajax-admin-time-zones"),   
        path('active-inactive-time-zone/', views.active_inactive_time_zone, name="admin-time-zones-status-change"), 

        # property Features settings
        path('property-features/', views.property_features, name="admin-property-features"),
        path('ajax-property-features-list/', views.ajax_property_features_list, name="admin-property-features-list"),
        path('active-inactive-property-feature/', views.active_inactive_property_feature, name="admin-property-fetaure-status-change"), 
]
