import os
import time
import requests
from bs4 import BeautifulSoup
from flask import Flask, request, jsonify
from flask_cors import CORS
from requests.exceptions import RequestException, Timeout
from urllib3.util.retry import Retry
from requests.adapters import HTTPAdapter
import logging

TIMEOUT = 10
MAX_RETRIES = 3
RETRY_BACKOFF = 0.3

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_session():
    session = requests.Session()
    retry_strategy = Retry(
        total=MAX_RETRIES,
        backoff_factor=RETRY_BACKOFF,
        status_forcelist=[500, 502, 503, 504]
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("https://", adapter)
    return session

app = Flask(__name__)
app.config['DEBUG'] = False
CORS(app, resources={r"/*": {"origins": ["WHITELIST_YOUR_URL HERE"]}}) # THIS IS NOT PROVIDED, ENTER YOUR WEBSITE URL TO WHITELIST

url = "http://www.zufawryservices.zu.edu.eg/Militery/Views/General/GetStudInfo"

def get_form_fields():
    session = create_session()
    try:
        response = session.get(url, timeout=TIMEOUT)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        viewstate = soup.find(id="__VIEWSTATE")
        viewstate_generator = soup.find(id="__VIEWSTATEGENERATOR")
        event_validation = soup.find(id="__EVENTVALIDATION")
        if not all([viewstate, viewstate_generator, event_validation]):
            raise ValueError("Failed to get form fields")
        return {
            "__VIEWSTATE": viewstate["value"],
            "__VIEWSTATEGENERATOR": viewstate_generator["value"],
            "__EVENTVALIDATION": event_validation["value"]
        }
    except Exception as e:
        logger.error(f"Failed to retrieve form fields: {str(e)}")
        raise

def search_by_national_number(national_number):
    session = create_session()
    try:
        fields = get_form_fields()
        form_data = {
            "__EVENTTARGET": "",
            "__EVENTARGUMENT": "",
            "__VIEWSTATE": fields["__VIEWSTATE"],
            "__VIEWSTATEGENERATOR": fields["__VIEWSTATEGENERATOR"],
            "__EVENTVALIDATION": fields["__EVENTVALIDATION"],
            "txtNationalNumber": national_number,
            "btnSearch": "بحث"
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        response = session.post(url, data=form_data, headers=headers, timeout=TIMEOUT)
        response.raise_for_status()
        return response.text
    except Exception as e:
        logger.error(f"Search failed: {str(e)}")
        raise Exception(f"Search failed: {str(e)}")

def extract_data(html_content):
    try:
        soup = BeautifulSoup(html_content, "html.parser")
        student_name = soup.find(id="lblStudName")
        code_elem = soup.find(id="lblCode")
        phase_elem = soup.find(id="lblPhaseName")
        return {
            "student_name": student_name.text.strip() if student_name else "N/A",
            "student_code": code_elem.text.strip() if code_elem and code_elem.text.strip() else "N/A",
            "phase_name": phase_elem.text.strip() if phase_elem else "N/A"
        }
    except Exception as e:
        logger.error(f"Error parsing HTML: {str(e)}")
        return {"error": f"Error parsing HTML: {str(e)}"}

@app.route("/api/search/national", methods=["POST"])
def api_search_national():
    try:
        data = request.get_json(force=True)
        national_number = data.get("national_number", "").strip()
        if not national_number or not national_number.isdigit() or len(national_number) != 14:
            return jsonify({"error": "Invalid national number format"}), 400
        html_response = search_by_national_number(national_number)
        result = extract_data(html_response)
        if all(value == "N/A" for value in result.values()):
            return jsonify({"error": "No student found with this national number"}), 404
        return jsonify(result)
    except Exception as e:
        logger.error(f"API error: {str(e)}")
        return jsonify({"error": str(e)}), 500
