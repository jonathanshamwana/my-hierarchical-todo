import os
import requests
from flask import Flask, jsonify
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Strava API credentials
client_id = os.getenv('STRAVA_CLIENT_ID')
client_secret = os.getenv('STRAVA_CLIENT_SECRET')
refresh_token = os.getenv('STRAVA_REFRESH_TOKEN')

def refresh_strava_token():
    """Refreshes the Strava access token using the refresh token."""
    response = requests.post(
        url="https://www.strava.com/oauth/token",
        data={
            'client_id': client_id,
            'client_secret': client_secret,
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token
        }
    )
    if response.status_code == 200:
        new_token = response.json()
        os.environ['STRAVA_ACCESS_TOKEN'] = new_token['access_token']
        os.environ['STRAVA_REFRESH_TOKEN'] = new_token['refresh_token']
        return new_token['access_token']
    else:
        print(f"Error refreshing token: {response.status_code} - {response.text}")
        return None

def get_strava_activities():
    """Fetches recent Strava activities for the authenticated user."""
    access_token = refresh_strava_token()
    if access_token:
        response = requests.get(
            url="https://www.strava.com/api/v3/athlete/activities",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if response.status_code == 200:
            return response.json()  # Return the activities as JSON
        else:
            print(f"Error fetching activities: {response.status_code} - {response.text}")
            return []
    else:
        print("Failed to refresh access token.")
        return []

@app.route('/api/strava/activities', methods=['GET'])
def strava_activities_endpoint():
    """API endpoint to fetch Strava activities."""
    activities = get_strava_activities()
    return jsonify(activities), 200 if activities else 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)
