from speechmatics.models import ConnectionSettings
from speechmatics.batch_client import BatchClient
from httpx import HTTPStatusError

API_KEY = "HsodVclnSt7HLLkC1mqEcxknbKxIL5o6"
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


def s_client(vfile):
    with BatchClient(settings) as client:
        try:
            job_id = client.submit_job(
                audio=vfile,
                transcription_config=conf,
            )
            print(f"job {job_id} submitted successfully, waiting for transcript")

            transcript = client.wait_for_completion(
                job_id, transcription_format="json-v2"
            )
            summary = transcript["summary"]["content"]
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
