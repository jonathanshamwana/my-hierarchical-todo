import os
import requests
from flask import Flask, jsonify
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

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
        # Save new tokens from the response
        new_token = response.json()
        os.environ['STRAVA_ACCESS_TOKEN'] = new_token['access_token']
        os.environ['STRAVA_REFRESH_TOKEN'] = new_token['refresh_token']
        return new_token['access_token']
    else:
        print(f"Error refreshing token: {response.status_code} - {response.text}")
        return None

@app.route('/api/strava/profile', methods=['GET'])
def get_strava_profile():
    """Fetches the Strava profile of the authenticated user."""
    access_token = refresh_strava_token()
    if access_token:
        response = requests.get(
            url="https://www.strava.com/api/v3/athlete",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({'error': f"Error fetching profile: {response.status_code} - {response.text}"}), 500
    else:
        return jsonify({'error': 'Failed to refresh access token.'}), 500

@app.route('/api/strava/activities', methods=['GET'])
def get_strava_activities():
    """Fetches recent Strava activities for the authenticated user."""
    access_token = refresh_strava_token()
    if access_token:
        response = requests.get(
            url="https://www.strava.com/api/v3/athlete/activities",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({'error': f"Error fetching activities: {response.status_code} - {response.text}"}), 500
    else:
        return jsonify({'error': 'Failed to refresh access token.'}), 500

@app.route('/api/strava/run_totals', methods=['GET'])
def get_ytd_run_totals():
    """Fetches year-to-date running totals for the authenticated user."""
    access_token = refresh_strava_token()
    if access_token:
        url = f"https://www.strava.com/api/v3/athletes/{client_id}/stats"
        response = requests.get(
            url=url,
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if response.status_code == 200:
            ytd_run_totals = response.json().get('ytd_run_totals', {})
            return jsonify(ytd_run_totals), 200
        else:
            return jsonify({'error': f"Error fetching stats: {response.status_code} - {response.text}"}), 500
    else:
        return jsonify({'error': 'Failed to refresh access token.'}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)
