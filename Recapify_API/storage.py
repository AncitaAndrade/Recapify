import boto3

AWS_S3_BUCKET_NAME = 'summary-files'
AWS_REGION = 'us-east-2'


LOCAL_FILE = '/Users/ancitaandrade/Downloads/sample3.txt'
NAME_FOR_S3 = 'test_file.txt'

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
