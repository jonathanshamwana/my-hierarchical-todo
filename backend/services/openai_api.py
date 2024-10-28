from flask import Blueprint, jsonify, request
import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai_bp = Blueprint('openai', __name__)
openai.api_key = os.getenv("OPENAI_API_KEY")

@openai_bp.route('/suggest-time-slots', methods=['POST'])
def suggest_time_slots():
    """
    Fetches optimal time slots based on user's calendar events and task details.
    """
    event_data = request.json.get('events')  # list of existing events
    task_description = request.json.get('description')  # task details like "Run 20 miles"
    task_duration = request.json.get('duration')  # in minutes

    # Enhanced prompt for OpenAI to suggest time slots based on task type, duration, and user calendar
    prompt = (
        f"Based on the following calendar events and the task description, suggest an optimal {task_duration}-minute time slot.\n\n"
        f"Calendar Events: {event_data}\n"
        f"Task Description: {task_description}\n\n"
        f"Please consider the following:\n"
        f"- For physically demanding tasks like 'Run 20 miles', schedule them early in the day when energy levels are high.\n"
        f"- Tasks that involve external dependencies (e.g., shopping) should consider typical store hours.\n"
        f"- Avoid scheduling tasks late in the day that may be affected by fatigue.\n"
        f"- Consider the user's preferences for weekends and availability.\n"
        f"Suggest an optimal time slot that aligns with these factors, ensuring no overlap with existing events."
    )

    try:
        completion = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        suggested_time_slots = completion.choices[0].message.content
        return jsonify({"suggestions": suggested_time_slots}), 200
    except Exception as e:
        print("An error occurred:", e)
        return jsonify({"error": "Failed to get time suggestions"}), 500

