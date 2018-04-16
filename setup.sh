#!/usr/bin/env bash

# Login to the Google CLoud SDK
gcloud auth login

# Read the settings file
source settings.conf

# Set working project
gcloud config set project $PROJECT_ID

# Create the service account
gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME

# Bind the service account to the project
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member "serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role "roles/owner"

# Create a service account JSON file to be used by the client libraries
gcloud iam service-accounts keys create service-account.json \
  --iam-account $SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com

# Set the location of the service account to an environment variable
export GOOGLE_APPLICATION_CREDENTIALS=$PWD/service-account.json

# Create the bucket to store the process
gsutil mb -p $PROJECT_ID gs://$BUCKET_NAME/