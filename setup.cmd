@echo off

rem Login to the Google CLoud SDK
call gcloud auth login

rem Read the settings file
for /f "delims== tokens=1,2" %%G in (settings.conf) do set %%G=%%H

rem Set working project
call gcloud config set project %PROJECT_ID%

rem Create the service account
call gcloud iam service-accounts create %SERVICE_ACCOUNT_NAME%

rem Bind the service account to the project
call gcloud projects add-iam-policy-binding %PROJECT_ID% ^
  --member "serviceAccount:%SERVICE_ACCOUNT_NAME%@%PROJECT_ID%.iam.gserviceaccount.com" ^
  --role "roles/owner"

rem Create a service account JSON file to be used by the client libraries
call gcloud iam service-accounts keys create service-account.json ^
  --iam-account %SERVICE_ACCOUNT_NAME%@%PROJECT_ID%.iam.gserviceaccount.com

rem Set the location of the service account to an environment variable
set GOOGLE_APPLICATION_CREDENTIALS=%cd%\service-account.json

rem Create the bucket to store the process
call gsutil mb -p %PROJECT_ID% gs://%BUCKET_NAME%/
