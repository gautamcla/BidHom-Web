import json
import time
import re
import math
import sys, os
import datetime
from django.conf import settings
from datetime import date
from django import template
import html

register = template.Library()
ones = ["", "one ", "two ", "three ", "four ", "five ", "six ", "seven ", "eight ", "nine ", "ten ", "eleven ",
        "twelve ", "thirteen ", "fourteen ", "fifteen ", "sixteen ", "seventeen ", "eighteen ", "nineteen "]

twenties = ["", "", "twenty ", "thirty ", "forty ", "fifty ", "sixty ", "seventy ", "eighty ", "ninety "]

thousands = ["", "thousand ", "million ", "billion ", "trillion ", "quadrillion ", "quintillion ", "sextillion ",
             "septillion ", "octillion ", "nonillion ", "decillion ", "undecillion ", "duodecillion ", "tredecillion ",
             "quattuordecillion ", "quindecillion", "sexdecillion ", "septendecillion ", "octodecillion ",
             "novemdecillion ", "vigintillion "]

@register.filter(expects_localtime=True)
def parse_iso(value):
    if value:
        try:
            date_obj = datetime.datetime.strptime(value, "%Y-%m-%dT%H:%M:%SZ")
        except ValueError:
            date_obj = datetime.datetime.strptime(value, "%Y-%m-%dT%H:%M:%S.%fZ")
        return date_obj

@register.filter(name='format_phone')
def format_phone(number):
    """Convert a 10 character string into (xxx) xxx-xxxx."""
    first = number[0:3]
    second = number[3:6]
    third = number[6:10]
    return '(' + first + ')' + ' ' + second + '-' + third

@register.simple_tag
def get_list_value(list, index, key):
    """Convert a 10 character string into (xxx) xxx-xxxx."""

    try:
        return list[index][key]
    except Exception:
        return None

@register.filter(name='convert_num')
def convert_num(number):
    """Convert the number to int if after decimal only 0"""
    try:
        if number is not None:
            number = float(number)
            new_number = number-int(number)

            if new_number > 0:
                return "{:.2f}".format(number)
            else:
                return int(number)
        else:
            return ""
    except Exception as exp:
        print("exp from convert_num")
        print(exp)
        return ""

@register.filter(name='convert_str_date')
def convert_str_date(value):
    dateString = ''
    if value:
        try:
            dateString = datetime.datetime.strptime(value, "%Y-%m-%dT%H:%M:%S.%fZ")
        except:
            dateString = datetime.datetime.strptime(value, "%Y-%m-%dT%H:%M:%SZ")

    return value

@register.simple_tag
def define_var(val=None):
  return val

@register.filter(name='remaining_hours')
def remaining_hours(value):
    today_date = datetime.datetime.now()
    hours_remain = ''
    if value:
        try:
            end_date = datetime.datetime.strptime(value, "%Y-%m-%dT%H:%M:%SZ")
        except:
            end_date = datetime.datetime.strptime(value, "%Y-%m-%dT%H:%M:%S.%fZ")

        delta = end_date - today_date
        total_seconds = delta.total_seconds()
        hours_remain = total_seconds / (60 * 60)
        hours_remain = math.ceil(hours_remain)


    return hours_remain

@register.simple_tag
def add_days(value,days):
    delta = ''
    if value:
        delta = value + datetime.timedelta(days=int(days))


    return delta

@register.filter(name='in_the_future')
def in_the_future(value):
    try:
        if value:
            try:
                value = datetime.datetime.strptime(value, "%Y-%m-%dT%H:%M:%SZ")
            except:
                value = datetime.datetime.strptime(value, "%Y-%m-%dT%H:%M:%S.%fZ")
            return value > datetime.datetime.now()
        return False
    except Exception as e:
        print(e)
        return False

@register.filter(name='escape_char')
def escape_char(value):
    esc_char = ''
    if value:
        esc_char =  value.replace("'","\\'")

    return esc_char

@register.filter(name='range')
def _range(_min, args=None):
    _max, _step = None, None
    if args:
        if not isinstance(args, int):
            _max, _step = map(int, args.split(','))
        else:
            _max = args

    args = filter(None, (_min, _max, _step))

    return range(*args)

@register.simple_tag
def cal_var(value,num):
    delta = ''
    if value:
        delta = value - num


    return delta

@register.filter(name='convert_float')
def convert_float(number):
    """Convert the number to int if after decimal only 0"""
    try:
        if number is not None:
            number = float(number)
            new_number = number-int(number)
            if new_number > 0:
                return "{:.2f}".format(number)
            else:
                return "{:.2f}".format(number)
        else:
            return ""
    except Exception as exp:
        print("exp from convert_float")
        print(exp)
        return ""

def num999(n):
    c = n % 10 # singles digit
    c = int(c)
    b = ((n % 100) - c) / 10 # tens digit
    b = int(b)
    a = ((n % 1000) - (b * 10) - c) / 100 # hundreds digit
    a = int(a)
    t = ""
    h = ""
    # if a != 0 and b == 0 and c == 0:
    #     t = ones[a] + "hundred "
    if a != 0:
        t = ones[a] + "hundred "
    if b <= 1:
        h = ones[n%100]
    elif b > 1:
        h = twenties[b] + ones[c]
    st = t + h
    return st

@register.filter(name='convert_to_words')
def convert_to_words(number):
    """Convert the number to int if after decimal only 0"""
    if number:
        num = int(number)
    else:
        num = 0
    try:
        if num == 0:
            return 'zero'
        i = 3
        n = str(num)

        word = ""
        k = 0
        while (i == 3):
            nw = n[-i:]
            n = n[:-i]

            if int(nw) == 0:
                word = num999(int(nw)) + thousands[int(nw)] + word
            else:
                word = num999(int(nw)) + thousands[k] + word
            if n == '':
                i = i + 1
            k += 1

        return word[:-1].upper()
    except Exception as exp:
        print("exp")
        print(exp)
        return ""

@register.filter(name='remove_html')
def remove_html(str):
    """Convert the number to int if after decimal only 0"""
    try:
        if str is not None:
            return html.unescape(str).strip()
        else:
            return ""
    except Exception as exp:
        print("exp from remove_html")
        print(exp)
        return ""

@register.filter(name='float_format')
def float_format(value, fmt):
    """Convert the number to int if after decimal only 0"""
    try:
        value = float(value)
        return fmt.format(value)
    except Exception as exp:
        print("exp from float format")
        print(exp)
        return 0

@register.filter
def escape_single_quotes(string):
    # The two backslashes are interpreted as a single one
    # because the backslash is the escaping character.
    return string.replace("'", "\\'")

@register.simple_tag
def split(value,delimiter):
    arr = []
    if value:
        arr = value.split(delimiter)

    return arr
