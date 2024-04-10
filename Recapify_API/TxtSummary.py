import Utility.FileHelper
from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import TextAnalyticsClient, TextDocumentInput


def sample_abstractive_summarization(client, file_path):
    summaries = []
    file_extension = file_path.filename.lower().split(".")[-1]
    # Read the content of the file based on its extension
    print(file_path)
    if file_extension == "txt":
        document_text = file_path.read().decode("utf-8")
    elif file_extension == "pdf":
        # Add code to extract text from PDF
        document_text = Utility.FileHelper.extract_text_from_pdf(file_path)
    elif file_extension == "docx":
        # Add code to extract text from DOCX
        document_text = Utility.FileHelper.extract_text_from_docx(file_path)
    else:
        raise ValueError("Unsupported file format")
    print(document_text)
    # Create a TextDocumentInput object
    document_input = [TextDocumentInput(id="1", text=document_text)]

    # Call the Text Analytics API for abstractive summarization
    poller = client.begin_abstract_summary(document_input)
    abstract_summary_results = poller.result()

    for result in abstract_summary_results:
        if result.kind == "AbstractiveSummarization":
            for summary in result.summaries:
                summaries.append(summary.text)  # Append the summary to the list
        elif result.is_error is True:
            print(
                "...Is an error with code '{}' and message '{}'".format(
                    result.error.code, result.error.message
                )
            )

    return summaries  # Return the list of summaries


def getTextFileSummary(file):
    endpoint = "https://recapifytextsummary.cognitiveservices.azure.com/"
    key = "ba7b72c0e21c4b96949315c38e6d089b"

    # Initialize Text Analytics client
    client = TextAnalyticsClient(endpoint=endpoint, credential=AzureKeyCredential(key))

    # Call the sample function
    return sample_abstractive_summarization(client, file)
