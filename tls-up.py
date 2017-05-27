#!/usr/bin/env python

import os
import io
import sys
import pathlib
import tarfile
import boto3

required_tls_files = [
    '/etc/ssl/pushbot.party/fullchain.pem',
    '/etc/ssl/pushbot.party/privkey.pem',
    '/etc/ssl/dhparams.pem'
]

any_files_missing = False
for required_file in required_tls_files:
    if not pathlib.Path(required_file).is_file():
        any_files_missing = True

if not any_files_missing:
    print('All TLS certificates are present.')
    sys.exit(0)
print('Downloading current TLS certificates from S3.')

bucket_name = os.environ['S3_BUCKET_NAME']

s3 = boto3.resource('s3')
kms = boto3.client('kms')

ciphertext = io.BytesIO()
s3.Bucket(bucket_name).download_fileobj('tls-certificates.tar.enc', ciphertext)

print('Decrypting tarball.')
response = kms.decrypt(CiphertextBlob=ciphertext.getvalue())
ciphertext.close()
tarball = io.BytesIO(response['Plaintext'])

print('Unpacking tarball.')
with tarfile.open(name='tls-certificates.tar.gz', fileobj=tarball, mode='r') as tf:
    tf.list(verbose=True)
    tf.extractall(path='/etc/ssl/')

missing_files = []
for required_file in required_tls_files:
    if not pathlib.Path(required_file).is_file():
        missing_files.append(required_file)

if missing_files:
    print('Missing required TLS files:\n{}'.format('\n'.join(missing_files)))
    sys.exit(1)
