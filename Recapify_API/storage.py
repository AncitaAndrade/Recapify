import boto3
from dbClient import client
from application import application

AWS_S3_BUCKET_NAME = 'summary-files'
AWS_REGION = 'us-east-2'

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
    existing_data = summaryCollection.find_one({'CustomerId': customer_id})
    if existing_data is not None:
        summaryCollection.update_one(
            {'CustomerId': customer_id},
            {'$push': {'Summaries': {'Heading': summary_file.Heading, 'FileName': summary_file.FileName}}},
            upsert=True
        )
    else:
        data = {
            'CustomerId': customer_id,
            'Summaries': [{'Heading': summary_file.Heading, 'FileName': summary_file.FileName}]
        }
        summaryCollection.insert_one(data)


def upload_file_to_s3(file, fileName):
    s3_client = boto3.client(
        service_name='s3',
        region_name=AWS_REGION,
        aws_access_key_id = application.config['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key = application.config['AWS_SECRET_ACCESS_KEY']
    )
    
    response = s3_client.upload_file(file, AWS_S3_BUCKET_NAME, fileName)

    print(f'upload_log_to_aws response: {response}')
    return response

def read_file_from_s3(bucket_name, file_name):
    s3 = boto3.client(
        service_name='s3',
        region_name = AWS_REGION,
        aws_access_key_id = application.config['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key = application.config['AWS_SECRET_ACCESS_KEY']
    )
    obj = s3.get_object(Bucket=bucket_name, Key=file_name)
    data = obj['Body'].read()
    return data
