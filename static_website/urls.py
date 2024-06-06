from django.urls import path
from .views import *

urlpatterns = [
    # -----------------------Front Section------------------
    path('', home, name='home'),
    path('our-listing/', our_listing, name='our-listing'),
    path('our-listing-map/', our_listing_map, name='our-listing-map'),
    path('asset-details/', asset_details, name='asset-details'),
    path('contact-us/', contact_us, name='contact-us'),
    path('my-bids/', my_bids, name='my-bids'),
    path('my-offers/', my_offers, name='my-offers'),
    path('favourite-listings/', favourite_listings, name='favourite-listings'),
    path('save-search/', save_search, name='save-search'),
    path('edit-profile/', edit_profile, name='edit-profile'),
    path('chat/', chat, name='chat'),
    path('best-offers/', best_offer, name='best-offer'),
    path('bidder-registration/', registration, name='registration'),

    # -----------------------Admin Section------------------
    path('admin/', website, name='website'),
    path('admin/dashboard/', dashboard, name='dashboard'),
    path('admin/agents/', agents, name='agents'),
    path('admin/users/', agents, name='agents'),
    path('admin/add-agent/', add_agent, name='add-agent'),
    path('admin/listing/', listing, name='listing'),
    path('admin/chat/', admin_chat, name='admin-chat'),
    path('admin/auction-dashboard/', auction_dashboard, name='auction-dashboard'),
    path('admin/my-offer/', my_offer, name='my-offer'),
    path('admin/offer-details/', offer_details, name='offer-details'),
    path('admin/property-estimator-list/', property_estimator_list, name='property-estimator-list'),
    path('admin/property-estimator-details/', property_estimator_details, name='property-estimator-details'),
    path('admin/bidder-registration/', bidder_registration, name='bidder-registration'),
    path('admin/bidder-registration-details/', bidder_registration_details, name='bidder-registration-details'),
    path('admin/listing-property-info/', listing_property_info, name='listing-property-info'),
    path('admin/property-map-view/', property_map_view, name='property-map-view'),
    path('admin/property-photo-video/', property_photo_video, name='property-photo-video'),
    path('admin/property-document/', property_document, name='property-document'),
    path('set-tour-session/', set_tour_session, name='set-tour-session'),

    # -----------------Common Route----------------
    path('close-tour/', close_tour, name='close-tour'),
    path('payment/', payment, name='payment'),
    path('check-payment/', check_payment, name='check-payment'),
]


