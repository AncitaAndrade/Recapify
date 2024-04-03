import Utility.FileHelper 
from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import TextAnalyticsClient, TextDocumentInput

def sample_abstractive_summarization(client, file_path):
    summaries = []
    file_extension = file_path.filename.lower().split('.')[-1]
    # Read the content of the file based on its extension
    if file_extension == "txt":
        document_text = file_path.read().decode('utf-8')
    elif file_extension == "pdf":
        document_text = Utility.FileHelper.extract_text_from_pdf(file_path)
    elif file_extension == "docx":
        document_text = Utility.FileHelper.extract_text_from_docx(file_path)
    else:
        raise ValueError("Unsupported file format")
    print(document_text)
    # Create a TextDocumentInput object
    document_input = [TextDocumentInput(id="1", text=document_text)]

    poller = client.begin_abstract_summary(document_input)
    abstract_summary_results = poller.result()

    for result in abstract_summary_results:
        if result.kind == "AbstractiveSummarization":
            for summary in result.summaries:
                summaries.append(summary.text)  
        elif result.is_error is True:
            print("...Is an error with code '{}' and message '{}'".format(
                result.error.code, result.error.message
            ))
    
    return summaries  

def getTextFileSummary(file):
    endpoint = "https://recap.cognitiveservices.azure.com/"
    key = "bb7b021856bf47e5a4a175294ee1394b"

    # Initialize Text Analytics client
    client = TextAnalyticsClient(endpoint=endpoint, credential=AzureKeyCredential(key))

    # Call the sample function
    return sample_abstractive_summarization(client, file)