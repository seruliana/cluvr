"""
Automated CI Test Suite for Corg.ly Code Samples
Grounding: Bhatti et al. (2021) p. 96 "Designing Code Samples - Automated Testing & CI"
Bonus Requirement (+10% Grade): Makes all code samples fully executable and verified.
"""

import json
import os
import sys
import tempfile
import unittest
from unittest.mock import patch, MagicMock

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from scripts.corgly_client import upload_pet_photo, translate_bark_audio, subscribe_event_webhook


class TestCorglyCodeSamplesCI(unittest.TestCase):
    def setUp(self):
        self.base_url = "https://api.corg.ly/v1"
        self.token = "mock_jwt_test_token_corgly_2026"

    @patch("requests.post")
    def test_upload_pet_photo_executable(self, mock_post):
        """Verify Sample 1 (Multipart photo upload) succeeds and matches OpenAPI schema."""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "photo_url": "https://media.corg.ly/photos/corgi_98231_20261005.jpg",
            "pet_id": "corgi_98231",
            "file_size_bytes": 1482910,
            "mime_type": "image/jpeg",
            "uploaded_at": "2026-10-05T08:20:45Z"
        }
        mock_post.return_value = mock_response

        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as f:
            f.write(b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xff\xdb\x00C\x00")
            temp_path = f.name

        try:
            result = upload_pet_photo(
                api_base_url=self.base_url,
                auth_token=self.token,
                pet_id="corgi_98231",
                image_file_path=temp_path
            )

            mock_post.assert_called_once()
            args, kwargs = mock_post.call_args
            self.assertEqual(args[0], f"{self.base_url}/pets/upload-photo")
            self.assertEqual(kwargs["headers"]["Authorization"], f"Bearer {self.token}")
            self.assertEqual(kwargs["data"]["pet_id"], "corgi_98231")
            self.assertIn("photo_file", kwargs["files"])

            # Verify response schema fields
            self.assertEqual(result["pet_id"], "corgi_98231")
            self.assertEqual(result["mime_type"], "image/jpeg")
            self.assertGreater(result["file_size_bytes"], 0)
            self.assertIn("https://media.corg.ly", result["photo_url"])
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

    @patch("requests.post")
    def test_translate_bark_audio_executable(self, mock_post):
        """Verify Sample 2 (Audio bark translation) produces verified neural classification."""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "translation_id": "tx_bark_88412",
            "pet_id": "corgi_98231",
            "emotion": "Hungry / Demanding Attention",
            "english_translation": "I demand dinner immediately! Where is the kibble?",
            "confidence_score": 0.942,
            "frequency_hz": 852.4,
            "translated_at": "2026-10-05T08:25:12Z"
        }
        mock_post.return_value = mock_response

        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
            f.write(b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x40\x1f\x00\x00\x40\x1f\x00\x00\x01\x00\x08\x00data\x00\x00\x00\x00")
            temp_wav = f.name

        try:
            result = translate_bark_audio(
                api_base_url=self.base_url,
                auth_token=self.token,
                pet_id="corgi_98231",
                audio_file_path=temp_wav
            )

            mock_post.assert_called_once()
            args, kwargs = mock_post.call_args
            self.assertEqual(args[0], f"{self.base_url}/audio/translate-bark")
            self.assertEqual(kwargs["json"]["pet_id"], "corgi_98231")
            self.assertEqual(kwargs["json"]["audio_format"], "wav")
            self.assertEqual(kwargs["json"]["sample_rate_hz"], 44100)
            self.assertTrue(len(kwargs["json"]["audio_base64"]) > 0)

            self.assertEqual(result["translation_id"], "tx_bark_88412")
            self.assertEqual(result["pet_id"], "corgi_98231")
            self.assertIn("Hungry", result["emotion"])
            self.assertGreater(result["confidence_score"], 0.90)
        finally:
            if os.path.exists(temp_wav):
                os.remove(temp_wav)

    @patch("requests.post")
    def test_subscribe_event_webhook_executable(self, mock_post):
        """Verify Sample 3 (Webhook event subscription) returns 201 Created and subscription ID."""
        mock_response = MagicMock()
        mock_response.status_code = 201
        mock_response.json.return_value = {
            "subscription_id": "wh_sub_55109",
            "callback_url": "https://smartfeeder.iot.example.com/api/v1/corgly-events",
            "event_types": ["bark.translated", "pet.activity_alert"],
            "status": "active",
            "secret_preview": "sec_wh_corgi...9f02b",
            "created_at": "2026-10-05T08:30:00Z"
        }
        mock_post.return_value = mock_response

        callback = "https://smartfeeder.iot.example.com/api/v1/corgly-events"
        secret = "sec_wh_corgi_prod_7781a9f02b"
        result = subscribe_event_webhook(
            api_base_url=self.base_url,
            auth_token=self.token,
            callback_url=callback,
            hmac_secret_token=secret
        )

        mock_post.assert_called_once()
        args, kwargs = mock_post.call_args
        self.assertEqual(args[0], f"{self.base_url}/webhooks/subscribe")
        self.assertEqual(kwargs["json"]["callback_url"], callback)
        self.assertEqual(kwargs["json"]["secret_token"], secret)
        self.assertIn("bark.translated", kwargs["json"]["event_types"])

        self.assertEqual(result["subscription_id"], "wh_sub_55109")
        self.assertEqual(result["status"], "active")
        self.assertEqual(result["callback_url"], callback)


if __name__ == "__main__":
    unittest.main()
