import os
import requests
from dotenv import load_dotenv

load_dotenv()

client_id = os.getenv('STRAVA_CLIENT_ID')
client_secret = os.getenv('STRAVA_CLIENT_SECRET')
refresh_token = os.getenv('STRAVA_REFRESH_TOKEN')

def refresh_strava_token():
    response = requests.post(
        url="https://www.strava.com/oauth/token",
        data={
            'client_id': client_id,
            'client_secret': client_secret,
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token
        }
    )
    new_token = response.json()
    return new_token['access_token']

access_token = refresh_strava_token()
print(f"New access token: {access_token}")

