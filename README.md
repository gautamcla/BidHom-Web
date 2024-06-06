Create virtual env with diff version of python 
==============================================
Get executable path for desired python version
==============================================  
ie: which python3.10
/usr/bin/python3.10

==========================
Create virtual env python3.10
==========================
virtualenv -p /usr/bin/python3.10 <env_name>

==========================
Install python virtual env
==========================
1. sudo apt-get install python-virtualenv
2. virtualenv realityOne
3. source realityOne/bin/activate
4. pip3 install Django
5. pip3 install -r requirements.txt
====
Test
====
6. manage.py runserver


