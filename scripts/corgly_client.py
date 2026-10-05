"""
Corg.ly Onboarding API - Python Code Samples
Refactored in accordance with Bhatti's 5 Principles for Quality Code Samples:
(Explained, Concise, Clear, Usable, Trustworthy) - Docs for Developers, pp. 86-94.
"""

import base64
import os
import requests


# ==============================================================================
# Sample 1: Pet Photo Upload (Multipart Form Data)
# ==============================================================================
def upload_pet_photo(api_base_url: str, auth_token: str, pet_id: str, image_file_path: str) -> dict:
    """
    Uploads a high-resolution photo file for a registered pet profile using multipart form-data.
    Assumes the pet profile (e.g., corgi_98231) has already been created in the registry.

    Args:
        api_base_url (str): Base URL of Corg.ly API (e.g. 'https://api.corg.ly/v1' or 'http://127.0.0.1:4010').
        auth_token (str): JWT Bearer token for authentication.
        pet_id (str): Unique pet identifier string (e.g. 'corgi_98231').
        image_file_path (str): Local filesystem path to the pet photo (JPEG or PNG).

    Returns:
        dict: Server response containing public CDN URL and image metadata.
    """
    endpoint_url = f"{api_base_url}/pets/upload-photo"
    headers = {
        "Authorization": f"Bearer {auth_token}"
    }

    filename = os.path.basename(image_file_path)
    with open(image_file_path, "rb") as photo_stream:
        multipart_files = {
            "photo_file": (filename, photo_stream, "image/jpeg")
        }
        form_data = {
            "pet_id": pet_id
        }

        response = requests.post(
            endpoint_url,
            headers=headers,
            data=form_data,
            files=multipart_files,
            timeout=15
        )
        response.raise_for_status()
        return response.json()


# Practical copy-paste usage block:
if __name__ == "__main__":
    demo_token = "replace_with_your_jwt_token"
    # To run against local Prism mock server: api_base_url = "http://127.0.0.1:4010"
    pet_response = upload_pet_photo(
        api_base_url="https://api.corg.ly/v1",
        auth_token=demo_token,
        pet_id="corgi_98231",
        image_file_path="your_pet_photo.jpg"
    )
    print("Photo URL:", pet_response.get("photo_url"))


# ==============================================================================
# Sample 2: Translate Bark Audio (Acoustic Neural Translation)
# ==============================================================================
def translate_bark_audio(api_base_url: str, auth_token: str, pet_id: str, audio_file_path: str) -> dict:
    """
    Submits an acoustic bark audio recording to Corg.ly neural models for human translation.
    Encodes audio to base64 format and returns emotional classification and English translation.

    Args:
        api_base_url (str): Base URL of Corg.ly API.
        auth_token (str): JWT Bearer token.
        pet_id (str): Target pet identifier.
        audio_file_path (str): Path to local WAV audio recording (44.1 kHz recommended).

    Returns:
        dict: Translated intent, confidence score, and detected dominant frequency.
    """
    endpoint_url = f"{api_base_url}/audio/translate-bark"
    headers = {
        "Authorization": f"Bearer {auth_token}"
    }

    with open(audio_file_path, "rb") as audio_stream:
        encoded_audio_bytes = base64.b64encode(audio_stream.read()).decode("utf-8")

    translation_payload = {
        "pet_id": pet_id,
        "audio_format": "wav",
        "sample_rate_hz": 44100,
        "audio_base64": encoded_audio_bytes
    }

    response = requests.post(
        endpoint_url,
        headers=headers,
        json=translation_payload,
        timeout=20
    )
    response.raise_for_status()
    return response.json()


# Practical copy-paste usage block:
if __name__ == "__main__":
    demo_token = "replace_with_your_jwt_token"
    translation_result = translate_bark_audio(
        api_base_url="https://api.corg.ly/v1",
        auth_token=demo_token,
        pet_id="corgi_98231",
        audio_file_path="replace_with_real_bark.wav"
    )
    print("Translation:", translation_result.get("english_translation"))


# ==============================================================================
# Sample 3: Subscribe Webhook (Asynchronous Event Streaming)
# ==============================================================================
def subscribe_event_webhook(api_base_url: str, auth_token: str, callback_url: str, hmac_secret_token: str) -> dict:
    """
    Registers an external HTTPS webhook callback to stream real-time pet activity events.
    Verifies subscription parameters and returns subscription ID and verification status.

    Args:
        api_base_url (str): Base URL of Corg.ly API.
        auth_token (str): JWT Bearer token.
        callback_url (str): External HTTPS listener endpoint.
        hmac_secret_token (str): Shared secret token (min 16 chars) for HMAC signature checks.

    Returns:
        dict: Subscription confirmation payload with status 201 Created.
    """
    endpoint_url = f"{api_base_url}/webhooks/subscribe"
    headers = {
        "Authorization": f"Bearer {auth_token}"
    }

    subscription_payload = {
        "callback_url": callback_url,
        "event_types": ["bark.translated", "pet.activity_alert"],
        "secret_token": hmac_secret_token,
        "description": "Smart Pet Feeder Automated Callback Listener"
    }

    response = requests.post(
        endpoint_url,
        headers=headers,
        json=subscription_payload,
        timeout=10
    )
    response.raise_for_status()
    return response.json()


# Practical copy-paste usage block:
if __name__ == "__main__":
    demo_token = "replace_with_your_jwt_token"
    subscription_result = subscribe_event_webhook(
        api_base_url="https://api.corg.ly/v1",
        auth_token=demo_token,
        callback_url="https://smartfeeder.iot.example.com/api/v1/corgly-events",
        hmac_secret_token="replace_with_your_hmac_secret_token_min16"
    )
    print("Subscription ID:", subscription_result.get("subscription_id"))
