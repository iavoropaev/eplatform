import requests

from educationplatform.settings import BOT_TOKEN

from bs4 import BeautifulSoup


def clean_html_for_telegram(html):
    soup = BeautifulSoup(html, 'html.parser')
    allowed_tags = {'b', 'strong', 'i', 'em', 'u', 'ins', 's', 'strike', 'del',
                    'span', 'a', 'code', 'pre'}
    for tag in soup.find_all(True):
        if tag.name not in allowed_tags:
            tag.unwrap()
        else:
            if tag.name == 'span':
                if 'class' not in tag.attrs or 'tg-spoiler' not in tag['class']:
                    tag.unwrap()
    return str(soup)


def send_message_to_tg(chat_id, message):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    message = clean_html_for_telegram(message)
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "HTML",
    }
    try:
        res = requests.post(url, json=payload)
    except Exception as e:
        print(e)
