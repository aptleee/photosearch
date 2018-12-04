import json
import boto3
from elasticsearch import Elasticsearch, RequestsHttpConnection
from requests_aws4auth import AWS4Auth
def lambda_handler(event, context):
    # ------------ search photos -----------------
    q = event['message']
    if q.find('and')>=0:
        pass
    else:
        q = q + ' and '
    client = boto3.client('lex-runtime')
    response1 = client.post_text(
        botName='Search',
        botAlias='$LATEST',
        userId='Ximing',
        inputText= q
    )
    slots = response1['slots']
    if slots['keyb'] != None:
        q = slots['keya'] + ' and ' + slots['keyb']
    else:
        q = slots['keya']
    # ---------------- elastic ----------------
    host = ''
    region = 'us-west-2'

    service = 'es'
    credentials = boto3.Session().get_credentials()
    awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service,session_token=credentials.token)
    
    es = Elasticsearch(
        hosts = [{'host': host, 'port': 443}],
        http_auth = awsauth,
        use_ssl = True,
        verify_certs = True,
        connection_class = RequestsHttpConnection
    )
    # es.indices.delete(index='photos', ignore=[400, 404])
    if q == 'all':
        client = boto3.client('s3')
        response = client.list_objects(
            Bucket='photolx'
        )
        l = [x['Key'] for x in response['Contents']]
    else:
        search_label = {
            'size': 100, 
            'query': {
                'match': {
                    'labels': {
                        'query':q, 
                        'operator':'and',
                        'analyzer': 'stop',
                        'fuzziness': '1'
                    }
                }
            }
        }
        res = es.search(index="photos", body=json.dumps(search_label))
        l = [x['_source']['objectKey'] for x in res['hits']['hits']]
    return {
        'statusCode': 200,
        'body': l
    }


    

