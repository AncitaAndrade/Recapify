from speechmatics.models import ConnectionSettings
from speechmatics.batch_client import BatchClient
from httpx import HTTPStatusError

API_KEY = "CdrUadniiMaCCm8QzOKULKHBr4sXW9ZV"
PATH_TO_FILE = "C:\MyProject\sample.mp4"
LANGUAGE = "en"

settings = ConnectionSettings(
    url="https://asr.api.speechmatics.com/v2",
    auth_token=API_KEY,
)

# Define transcription parameters
conf = {
    "type": "transcription",
    "transcription_config": {"language": LANGUAGE},
    "summarization_config": {},
}


# Open the client using a context manager
def s_client():
    with BatchClient(settings) as client:
        try:
            job_id = client.submit_job(
                audio=PATH_TO_FILE,
                transcription_config=conf,
            )
            print(f"job {job_id} submitted successfully, waiting for transcript")

            # Note that in production, you should set up notifications instead of polling.
            # Notifications are described here: https://docs.speechmatics.com/features-other/notifications
            # transcript = s_client.wait_for_completion(job_id, transcription_format="txt")
            transcript = client.wait_for_completion(
                job_id, transcription_format="json-v2"
            )
            summary = transcript["summary"]["content"]
            # To see the full output, try setting transcription_format='json-v2'.
            # print(transcript)
            # print(summary)
            return summary
        except HTTPStatusError as e:
            if e.response.status_code == 401:
                print("Invalid API key - Check your API_KEY at the top of the code!")
                return "Invalid API key - Check your API_KEY at the top of the code!"
            elif e.response.status_code == 400:
                print(e.response.json()["detail"])
                return e.response.json()["detail"]
            else:
                raise e
