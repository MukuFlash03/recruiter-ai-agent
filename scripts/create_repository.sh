#!/bin/bash
set -x  # Turn on command tracing
# Define the repository name
REPOSITORY_NAME="recruit-ai-agent"
LOCAL_AWS_REGION="us-east-1"

# Create the ECR repository
aws ecr create-repository --repository-name "$REPOSITORY_NAME" --region "$LOCAL_AWS_REGION"
set +x  # Turn off command tracing
