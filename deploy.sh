#!/usr/bin/env bash

set -e

if [ "${1}" == "dev" ]; then
  echo "there is no dev"
elif [ "${1}" == "prod" ]; then
  echo "deploying to prod"
  CLOUDFRONT_DISTRIBUTION_ID="EG01URWC7FNFD"
  CLOUDFRONT_S3_BUCKET="s3://cf-tb-taskbase-angular-libraries/"
else
  echo "Expected prod as argument"
  exit 0
fi

aws s3 cp ./dist/angular-libraries-demo/ $CLOUDFRONT_S3_BUCKET --recursive # use trailing slash to copy contents of directory!
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
echo "Done!"

