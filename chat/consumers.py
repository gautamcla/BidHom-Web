import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async, async_to_sync
from subdomain.services import call_api_get_method, call_api_post_method
from django.conf import settings

class ChatConsumer(AsyncWebsocketConsumer):

    async def fetch_messages(self, data):
        site_id = await self.get_site_id()
        try:
            user_id = self.scope["session"]["user_id"]
            token = self.scope["session"]['token']['access_token']

            params = {"site_id": site_id, "user_id": user_id, "master_id": self.room_id, "page": 1, "page_size": 10}
            api_url = settings.API_URL + '/api-contact/user-chat-listing/'
            chat_data = call_api_post_method(params, api_url, token=token)
            if 'error' in chat_data and chat_data['error'] == 0:
                chat_list = chat_data['data']['data']
                length = len(chat_list)
                last_msg_id = chat_list[0]['id']
            else:
                chat_list = []
                last_msg_id = ''
            content = {
                'command': 'fetch_messages',
                'message': chat_list,
                'last_msg_id': last_msg_id
            }
            main_content = {
                'type': 'fetch_messages',
                'message': content
            }
            print("content from fetch==================")
            print(main_content)
            await self.send_message(main_content)
        except Exception as exp:
            print("from fetch msg exp")
            print(exp)


    async def new_message(self, data):
        site_id = await self.get_site_id()
        try:
            message = data['message']
            chat_list = []
            user_id = self.scope["session"]["user_id"]
            token = self.scope["session"]['token']['access_token']

            send_params = {"site_id": site_id, "user_id": user_id, "master_id": self.room_id, "message": message}
            new_api_url = settings.API_URL + '/api-contact/user-send-chat/'
            new_chat_data = call_api_post_method(send_params, new_api_url, token=token)

            if 'error' in new_chat_data and new_chat_data['error'] == 0:
                msg_data = new_chat_data['data'] if 'data' in new_chat_data and new_chat_data['data'] != "" else ""

                if msg_data:
                    chat_list.append(msg_data)
            else:
                chat_list = []
                last_msg_id = ''
            content = {
                'command': 'new_message',
                'message': chat_list,
            }

            await self.send_chat_message(content)
        except Exception as exp:
            print("from new msg exp")
            print(exp)


    async def get_site_id(self):
        try:
            is_server = settings.IS_SERVER
            if int(is_server) == 1:
                domain_name_url = request.META['HTTP_HOST'].split('.')[0]
            else:
                domain_name_url = settings.DOMAIN_NAME_URL.split('.')[0]
        except Exception as exp:
            domain_name_url = request.META['HTTP_HOST'].split('.')[0]

        domain_name = domain_name_url.replace('http://', '')
        setting_param = {'domain_name': domain_name}
        setting_url = settings.API_URL + '/api-users/get-site-detail/'
        site_details_data = call_api_post_method(setting_param, setting_url)
        if 'error' in site_details_data and site_details_data['error'] == 0:
            site_details = site_details_data['data']
            site_id = site_details['data']['site_id']
        else:
            site_id = False

        return site_id

    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message,
    }

    async def connect(self):
        self.room_id = str(self.scope['url_route']['kwargs']['room_id'])
        self.room_group_name = 'chat_%s' % self.room_id

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        print(data)
        await self.commands[data['command']](self,data)


    async def send_chat_message(self, data):
        try:
            message = data
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message
                }
            )
        except Exception as exp:
            print(exp)


    async def send_message(self, message):
        await self.send(text_data=json.dumps(message))


    # Receive message from room group
    async def chat_message(self, event):
        message = event
        # Send message to WebSocket
        await self.send(text_data=json.dumps(message))