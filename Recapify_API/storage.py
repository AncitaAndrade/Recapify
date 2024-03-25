import boto3
from dbClient import client
import Model.SummaryFile

AWS_S3_BUCKET_NAME = 'summary-files'
AWS_REGION = 'us-east-2'

LOCAL_FILE = '/Users/ancitaandrade/Downloads/sample3.txt'
NAME_FOR_S3 = 'test_file.txt'

db = client['customersData']
summaryCollection = db['SummariesCollection']

def getAllRecapsForCustomer(customerId):
    customer_recaps = summaryCollection.find_one({'CustomerId': customerId})
    recaps = []
    if customer_recaps and 'Summaries' in customer_recaps:
            for summary in customer_recaps['Summaries']:
                recaps.append({
                    'heading': summary['Heading'],
                    'filename': summary['FileName']
                })

    return recaps

def save_user_summary(customer_id, summary_file):
    # Check if the document already exists for the customerId
    existing_data = summaryCollection.find_one({'CustomerId': customer_id})

    if existing_data is not None:
        # Document exists, update it by appending the new summaryFile
        summaryCollection.update_one(
            {'CustomerId': customer_id},
            {'$push': {'Summaries': {'Heading': summary_file.Heading, 'FileName': summary_file.FileName}}},
            upsert=True
        )
    else:
        # Document doesn't exist, insert new document
        data = {
            'CustomerId': customer_id,
            'Summaries': [{'Heading': summary_file.Heading, 'FileName': summary_file.FileName}]
        }
        summaryCollection.insert_one(data)


def upload_file_to_s3():
    s3_client = boto3.client(
        service_name='s3',
        region_name=AWS_REGION,
        aws_access_key_id="Key",
        aws_secret_access_key="Key"
    )
    
    response = s3_client.upload_file(LOCAL_FILE, AWS_S3_BUCKET_NAME, NAME_FOR_S3)

    print(f'upload_log_to_aws response: {response}')

def read_file_from_s3(bucket_name, file_name):
    s3 = boto3.client(
        service_name='s3',
        region_name=AWS_REGION,
        aws_access_key_id="Key",
        aws_secret_access_key="KEY"
    )
    obj = s3.get_object(Bucket=bucket_name, Key=file_name)
    data = obj['Body'].read()
    print(data)
    return data
