# QuickSOS – One-Click Emergency Alert Web App

## Setup Instructions

1. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Replace Twilio credentials in `app.py` with your actual SID, token, and phone number.

4. Run the app:
   ```bash
   python app.py
   ```

5. Visit `http://127.0.0.1:5000` in your browser.

## Notes
- Make sure your Twilio account is verified to send SMS to your phone number.
- If using a free Twilio account, only verified numbers will receive messages.